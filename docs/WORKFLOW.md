# WORKFLOW.md - Enterprise Data Flow, Multi-Tenant Architecture & Phased Execution Plan

> **Document Type:** Single Source of Truth (SOT)
> **Version:** 2.0 (Dual-Sided Platform)
> **Last Updated:** 2026-07-24
> **Author:** Principal Architect (Audit Phase)
> **Status:** PLANNING - Awaiting Execution by Gemini Agent

---

## 1. Target System Architecture

```
                          HR Genetic AI - Production Topology (v2.0)

  [Browser - B2B]              [Browser - B2C]
  HR Dashboard / ATS           Job Seeker Portal / CV Builder
  Admin, HR_MANAGER,           CANDIDATE role
  RECRUITER roles
       |                            |
       +----------+-----------------+
                  |
            [API Gateway]
            Node.js / Express v5
            Port 3000
            +----------------------------+
            | /api/auth/*    (public)     |
            | /api/admin/*   (ADMIN)      |
            | /api/hr/*      (HR roles)   |
            | /api/candidate/* (CANDIDATE)|
            | /api/jobs/*    (mixed RBAC) |
            +----------------------------+
                  |              |
         +--------+       +-----+------+
         |                 |            |
   [PostgreSQL]      [Redis Queue]   [Object Storage]
   Prisma ORM        BullMQ          S3 / Supabase
   Multi-tenant      Job Workers     CV PDFs, Assets
   Port 5432                         
                           |
                    [AI Microservice]
                    FastAPI / LangGraph
                    Port 8000
                    +------------------------+
                    | /api/process-cv         |
                    | /api/chat               |
                    | /api/enhance-resume     |  <-- NEW: ATS optimization
                    | /api/vectorize-profile  |  <-- NEW: DB-to-vector pipeline
                    +------------------------+
                    | ChromaDB (Vector Store) |
                    | Google Gemini LLM       |
                    +------------------------+
```

---

## 2. End-to-End Data Pipelines

### Pipeline A: B2B - Candidate CV Ingestion (Legacy, Retained)

```
1. HR user uploads PDF via Admin Dashboard
2. Node Gateway validates (Multer: PDF only, 5MB max)
3. Gateway uploads file to Object Storage (S3/Supabase), receives URL
4. Gateway creates Candidate row in PostgreSQL (with company_id for tenant isolation)
5. Gateway enqueues "vectorize-cv" job to Redis (BullMQ)
6. Gateway returns 202 Accepted immediately (non-blocking)
7. Worker picks up job:
   a. Downloads PDF from Object Storage
   b. Sends to AI Service POST /api/process-cv
   c. AI Service: PyPDFLoader -> chunk -> embed -> ChromaDB
   d. Worker updates Candidate.vectorizationStatus = "COMPLETED"
   e. Worker deletes local temp file
```

### Pipeline B: B2B - HR Chat (RAG Agent Query)

```
1. HR user types query in ChatBox (Admin Dashboard)
2. Frontend sends POST /api/hr/chat with JWT (Bearer token)
3. Gateway validates token + role (ADMIN | HR_MANAGER | RECRUITER)
4. Gateway extracts company_id from JWT payload
5. Gateway forwards { query, company_id } to AI Service POST /api/chat
6. AI Service:
   a. Initializes ChromaDB retriever with metadata filter: company_id
   b. Creates ReAct agent with search_candidate_cv tool
   c. Agent reasons -> retrieves -> generates response
7. Response propagates back to frontend
```

### Pipeline C: B2C - Structured Resume Builder (NEW)

```
1. Candidate signs up (role = CANDIDATE, hardcoded)
2. Candidate logs in, accesses /candidate/resume-builder
3. Candidate fills structured forms:
   - Personal Info (name, email, phone, location)
   - Work Experience (company, title, startDate, endDate, description) [1..N]
   - Education (institution, degree, field, startDate, endDate) [1..N]
   - Skills (name, proficiency) [1..N]
4. Each section saves via REST API to PostgreSQL (relational tables)
5. Frontend displays a live preview panel alongside the form
```

### Pipeline D: B2C - AI ATS Enhancement (Human-in-the-Loop) (NEW)

```
1. Candidate clicks "Enhance with AI" on a specific Experience entry
2. Frontend sends POST /api/candidate/enhance-resume
   Body: { experienceId, originalDescription }
3. Gateway forwards to AI Service POST /api/enhance-resume
4. AI Service:
   a. Gemini rewrites description into ATS-optimized bullet points
   b. Returns { original, enhanced } pair
5. Frontend displays BOTH versions side-by-side
6. Candidate manually edits the AI output (Human-in-the-Loop)
7. Candidate clicks "Save" -> PATCH /api/candidate/experience/:id
8. Updated text is saved to PostgreSQL (NOT auto-saved)
```

### Pipeline E: B2C - Database-to-Vector Pipeline (NEW)

```
1. Candidate clicks "Publish Profile" or "Make Searchable"
2. Frontend sends POST /api/candidate/vectorize-profile
3. Gateway enqueues "vectorize-profile" job to Redis (BullMQ)
4. Gateway returns 202 Accepted
5. Worker picks up job:
   a. Queries PostgreSQL for all structured resume data (Experience, Education, Skills)
   b. Concatenates into a single plaintext document
   c. Sends to AI Service POST /api/vectorize-profile
   d. AI Service: chunk -> embed -> ChromaDB (with candidate_id + company_id metadata)
   e. Worker updates Candidate.vectorizationStatus = "COMPLETED"
6. NO PDF parsing involved. Direct database text extraction.
```

### Pipeline F: B2C - On-Demand PDF Generation (NEW)

```
1. Candidate clicks "Download PDF" on their resume
2. Frontend sends GET /api/candidate/resume/pdf
3. Gateway queries PostgreSQL for all structured resume data
4. Gateway generates PDF dynamically (using a library like pdf-lib or Puppeteer)
5. Gateway streams PDF response (Content-Type: application/pdf)
6. No PDF is stored permanently. Generated on-the-fly per request.
```

---

## 3. Defect Registry (Current Codebase)

| ID | Severity | Location | Defect | Resolution |
|:---|:---------|:---------|:-------|:-----------|
| W-01 | CRITICAL | `auth.js:30` | Sign-up accepts arbitrary `role` from request body. Privilege escalation. | Hardcode `role: "CANDIDATE"`. Admin/HR roles assigned by ADMIN only via dedicated endpoint. |
| W-02 | HIGH | `index.js:16,60` | `cors()` and `express.json()` registered twice. | Remove duplicate calls. |
| W-03 | HIGH | `index.js:31` | `require('jsonwebtoken')` inside middleware function body on every request. | Move to module-level import. |
| W-04 | HIGH | `auth.js:6-11` | Second PrismaClient instance. SQLite lock contention. | Singleton via `lib/prisma.js`. |
| W-05 | HIGH | `main.py:68` | `Chroma.from_documents()` overwrites on every upload. | Use persistent collection with `add_documents()`. |
| W-06 | MEDIUM | `main.py` | Chat is stateless. No conversation memory. | Implement `ChatMessageHistory` per session. |
| W-07 | MEDIUM | `main.py` | Uploaded files never cleaned up. Unbounded disk growth. | Delete after vectorization. With Object Storage, use pre-signed URLs + TTL. |
| W-08 | MEDIUM | `index.js` | `/api/hr/chat` has no auth middleware. Candidate data exposed. | Apply `authenticateToken` + `requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER')`. |
| W-09 | LOW | `index.js` | `node-fetch` imported but Node v24 has native `fetch`. | Remove dependency. |
| W-10 | LOW | `.env` | `GEMINI_API_KEY` committed to repository. | Rotate key. Add `.env` to `.gitignore`. Use `GOOGLE_API_KEY` convention. |

---

## 4. Async Job Queue Architecture

### Technology: Redis + BullMQ (Node.js Worker)

```
                       Job Queue Flow

  [Express Route Handler]
        |
        | queue.add('vectorize-cv', { candidateId, fileUrl, companyId })
        |
        v
  [Redis]  <-- BullMQ Queue: "ai-jobs"
        |
        | Worker polls queue
        v
  [Worker Process] (separate Node.js process or thread)
        |
        | 1. Download file from Object Storage
        | 2. Call AI Service endpoint
        | 3. Update PostgreSQL status
        | 4. Delete temp file
        |
        v
  [Done - Candidate.vectorizationStatus = "COMPLETED"]
```

### Job Types

| Job Name | Trigger | Payload | Side Effect |
|:---------|:--------|:--------|:------------|
| `vectorize-cv` | CV upload (B2B) | `{ candidateId, fileUrl, companyId }` | ChromaDB vectors created, status updated |
| `vectorize-profile` | "Publish Profile" (B2C) | `{ candidateId, companyId }` | DB text queried, vectorized, status updated |
| `generate-pdf` | "Download PDF" (B2C) | `{ candidateId }` | PDF streamed (optional queue for heavy load) |

---

## 5. Multi-Tenant Isolation Strategy

Every data query from an HR user must be scoped to their `company_id`:

```javascript
// Example: List candidates for HR user's company only
app.get('/api/hr/candidates', authenticateToken, requireRole('HR_MANAGER', 'RECRUITER'), async (req, res) => {
  const candidates = await prisma.candidate.findMany({
    where: { companyId: req.user.companyId },
    include: { appliedJob: true }
  });
  res.json(candidates);
});
```

ChromaDB queries must include a metadata filter:
```python
retriever = vectorstore.as_retriever(
    search_kwargs={"k": 5, "filter": {"company_id": company_id}}
)
```

---

## 6. Phased Execution Plan

### Phase 1: Architecture Stabilization
**Branch:** `feature/phase-1-architecture`

| Task | Description |
|:-----|:------------|
| 1.1 | Create `backend-node/lib/prisma.js` singleton. Import everywhere. |
| 1.2 | Remove duplicate `cors()`/`express.json()` in `index.js`. |
| 1.3 | Move `require('jsonwebtoken')` to module scope. |
| 1.4 | Remove `node-fetch` dependency. |
| 1.5 | Fix `Chroma.from_documents()` to append pattern in `main.py`. |
| 1.6 | Add file cleanup after vectorization in `main.py`. |
| **Gate** | `node index.js` starts clean. `python main.py` starts clean. Merge to `main`. |

### Phase 2: Database & Security Hardening
**Branch:** `feature/phase-2-database-security`

| Task | Description |
|:-----|:------------|
| 2.1 | Migrate Prisma datasource from SQLite to PostgreSQL. Update `schema.prisma`. |
| 2.2 | Implement full target schema (User, Company, Job, Candidate, Experience, Education, Skill). See `DB-Relations.md`. |
| 2.3 | Run `npx prisma migrate dev --name init-postgres`. |
| 2.4 | Create `prisma/seed.js` with admin user + sample jobs. |
| 2.5 | Extract JWT middleware to `middleware/auth.js`. Add `requireRole()` middleware. |
| 2.6 | Lock sign-up to `CANDIDATE` role only. Create `/api/admin/users/assign-role` for ADMIN. |
| 2.7 | Add input validation (Zod or Joi) on all auth endpoints. |
| 2.8 | Implement refresh token flow. |
| 2.9 | Ensure `JWT_SECRET` is required at startup (fail-fast). |
| **Gate** | `npx prisma migrate deploy` clean. Auth verification tests pass. Merge to `main`. |

### Phase 3: Frontend UI/UX Overhaul
**Branch:** `feature/phase-3-frontend-uiux`

| Task | Description |
|:-----|:------------|
| 3.1 | Implement design system tokens in `index.css` per `UIUX.md`. |
| 3.2 | Refactor all existing components to match design reference. Replace all emojis with `lucide-react`. |
| 3.3 | Implement responsive breakpoints in `mobile.css` per `UIUX.md`. |
| 3.4 | Extract all inline styles to CSS classes (BEM convention). |
| 3.5 | Refactor admin layout (Sidebar, Header, content area). |
| 3.6 | Build candidate portal layout (separate layout for B2C). |
| **Gate** | `npm run build` clean. Visual inspection at 375px, 768px, 1440px. Merge to `main`. |

### Phase 4: Feature Completion
**Branch:** `feature/phase-4-features`

| Task | Description |
|:-----|:------------|
| 4.1 | Build Candidates page (data table, pagination, filters). |
| 4.2 | Build Jobs CRUD page. |
| 4.3 | Build Resume Builder page (structured forms + live preview). |
| 4.4 | Build AI Enhancement endpoint + human-in-the-loop UI. |
| 4.5 | Implement BullMQ queue + worker for async vectorization. |
| 4.6 | Implement database-to-vector pipeline (Pipeline E). |
| 4.7 | Implement on-demand PDF generation (Pipeline F). |
| 4.8 | Add conversation memory to AI chat. |
| 4.9 | Full E2E test: sign up -> build resume -> enhance -> publish -> HR search. |
| **Gate** | E2E pass. Merge to `main`. |

---

## 7. Enterprise Operations & Reliability

### 7.1 Resilience & Fault Tolerance
- **Dead-Letter Queues (DLQ):** Failed BullMQ jobs (e.g., Gemini API timeouts) are routed to a DLQ after 3 exponential backoff retries.
- **Circuit Breakers:** FastAPI AI Service implements a circuit breaker. If Google Gemini API throttles (429), it trips the breaker to prevent cascading failures.

### 7.2 Observability & Logging
- **Centralized Error Tracking:** Sentry SDK integrated across React (Frontend), Express (Gateway), and FastAPI (AI Service).
- **Structured Logging:** `winston` (Node.js) and `loguru` (Python) output JSON logs.
- **APM:** Prometheus metrics exposed on `/metrics` for queue depth, API latency, and LLM token usage.

### 7.3 Caching Strategy
- **Data Caching:** Redis caches frequent, read-heavy DB queries (e.g., `/api/jobs` listings) with a 5-minute TTL.
- **Semantic Caching:** LangChain's Redis Cache stores identical RAG queries and vector results to bypass redundant LLM API calls and reduce costs.

### 7.4 CI/CD & Automated Testing
- **GitHub Actions:** CI pipeline triggers on PR to `main`.
- **Testing Gates:** 
  - Node.js: `npm run test` (Jest unit/integration tests).
  - Python: `pytest` (API tests).
  - Frontend: Cypress (E2E tests).
- **Continuous Deployment:** Merges to `main` auto-deploy via Docker containers if all test gates pass.

---
*© 2026 Djembar Arafat. All Rights Reserved.*
