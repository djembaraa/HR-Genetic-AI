# SECURITY.md - JWT Auth, RBAC, Input Validation & OWASP Mitigation

> **Document Type:** Single Source of Truth (SOT)
> **Version:** 2.0 (Dual-Sided Platform)
> **Last Updated:** 2026-07-24
> **Author:** Principal Security Engineer (Audit Phase)
> **Status:** PLANNING - Awaiting Execution by Gemini Agent

---

## 1. Vulnerability Audit (Current Codebase)

| ID | OWASP Category | Severity | Location | Description | Remediation |
|:---|:---------------|:---------|:---------|:------------|:------------|
| S-01 | A01:2021 Broken Access Control | CRITICAL | `routes/auth.js:30` | Sign-up accepts `role` from request body. Any user can register as `ADMIN`. | Strip `role` from input. Hardcode `CANDIDATE`. Admin assignment via ADMIN-only endpoint. |
| S-02 | A07:2021 Identification Failures | CRITICAL | `index.js:31` | JWT secret defaults to guessable string `'super-secret-jwt-key'`. | Require `JWT_SECRET` env var at startup. Exit with error if missing. Generate with `openssl rand -base64 64`. |
| S-03 | A02:2021 Cryptographic Failures | HIGH | `ai-service/.env` | API key committed to repository in plaintext. | Rotate key. Add all `.env` files to `.gitignore`. |
| S-04 | A03:2021 Injection | HIGH | `routes/auth.js` | No input validation on email format or password strength. | Validate with Zod/Joi: email regex, password min 8 chars, 1 uppercase, 1 number. |
| S-05 | A01:2021 Broken Access Control | HIGH | `index.js` | `/api/hr/chat` has no auth middleware. Candidate data exposed to unauthenticated users. | Apply `authenticateToken` + `requireRole('ADMIN', 'HR_MANAGER', 'RECRUITER')`. |
| S-06 | A05:2021 Security Misconfiguration | MEDIUM | `index.js` | `cors()` called with no origin restriction. Open to cross-origin abuse. | Configure `cors({ origin: [process.env.FRONTEND_URL] })`. |
| S-07 | A04:2021 Insecure Design | MEDIUM | `auth.js:6-11` | Duplicate PrismaClient. SQLite lock contention risk. | Singleton pattern via `lib/prisma.js`. |
| S-08 | A08:2021 Software Integrity | MEDIUM | `Candidate.cvUrl` | Full filesystem path stored and potentially returned in API. Server directory structure exposed. | Store only filename. Construct path at runtime. |
| S-09 | A07:2021 Identification Failures | LOW | All endpoints | No rate limiting on auth endpoints. Brute-force viable. | Implement `express-rate-limit`: 5 attempts per 15 min on `/api/auth/*`. |

---

## 2. Role-Based Access Control (RBAC)

### Role Definitions

| Role | Scope | Description |
|:-----|:------|:------------|
| `ADMIN` | Platform-wide | Full system access. User management. Company configuration. Can assign roles to other users. |
| `HR_MANAGER` | Company-scoped | Can create/edit jobs, view all candidates for their company, use AI chat. Cannot manage users or system settings. |
| `RECRUITER` | Company-scoped | Can view candidates and jobs for their company, use AI chat. Cannot create/edit jobs. |
| `CANDIDATE` | Self-scoped | Can manage own profile, build resume, apply to jobs. Cannot access admin dashboard or other candidates' data. |

### Access Control Matrix

| Endpoint Pattern | Method | ADMIN | HR_MANAGER | RECRUITER | CANDIDATE | Unauthenticated |
|:-----------------|:-------|:------|:-----------|:----------|:----------|:----------------|
| `/api/auth/signup` | POST | Y | Y | Y | Y | Y |
| `/api/auth/login` | POST | Y | Y | Y | Y | Y |
| `/api/auth/refresh` | POST | Y | Y | Y | Y | N |
| `/api/jobs` (public listing) | GET | Y | Y | Y | Y | Y |
| `/api/admin/users` | ALL | Y | N | N | N | N |
| `/api/admin/dashboard` | GET | Y | N | N | N | N |
| `/api/hr/candidates` | GET | Y | Y | Y | N | N |
| `/api/hr/chat` | POST | Y | Y | Y | N | N |
| `/api/hr/jobs` | ALL | Y | Y | N | N | N |
| `/api/candidate/profile` | ALL | N | N | N | Y (self) | N |
| `/api/candidate/experience` | ALL | N | N | N | Y (self) | N |
| `/api/candidate/education` | ALL | N | N | N | Y (self) | N |
| `/api/candidate/skills` | ALL | N | N | N | Y (self) | N |
| `/api/candidate/enhance-resume` | POST | N | N | N | Y | N |
| `/api/candidate/vectorize-profile` | POST | N | N | N | Y (self) | N |
| `/api/candidate/resume/pdf` | GET | N | N | N | Y (self) | N |

### Middleware Implementation

```
authenticateToken        -> Validates JWT, populates req.user
  |
  +-> requireRole(...roles) -> Checks req.user.role against allowed roles
  |
  +-> requireSelf           -> For candidate routes: ensures req.user.id === resource owner
  |
  +-> requireCompany        -> For HR routes: ensures req.user.companyId matches resource
```

---

## 3. Authentication Flow (JWT + Refresh Tokens)

### Token Pair Strategy

| Token | Storage | Lifetime | Purpose |
|:------|:--------|:---------|:--------|
| Access Token | `localStorage` (MVP) / `httpOnly` cookie (production) | 15 minutes | API authentication |
| Refresh Token | `httpOnly` cookie | 7 days | Silent access token renewal |

### Sign-Up Flow
```
1. Client: POST /api/auth/signup { email, password }
2. Server validates:
   a. email matches /^[^\s@]+@[^\s@]+\.[^\s@]+$/ (Zod)
   b. password.length >= 8, contains uppercase + digit (Zod)
   c. No existing user with same email
3. Server: bcrypt.hash(password, 10)
4. Server: prisma.user.create({ email, password: hash, role: "CANDIDATE" })
   - role is HARDCODED. Input role is IGNORED.
5. Server returns 201 { message, userId }
```

### Login Flow
```
1. Client: POST /api/auth/login { email, password }
2. Server: prisma.user.findUnique({ where: { email } })
3. Server: bcrypt.compare(password, user.password)
4. On match:
   a. accessToken = jwt.sign({ userId, role, email, companyId }, JWT_SECRET, { expiresIn: '15m' })
   b. refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' })
   c. Set refreshToken as httpOnly cookie
5. Server returns { accessToken, user: { id, email, role, companyId } }
```

### Refresh Flow
```
1. Client: POST /api/auth/refresh (cookie contains refreshToken)
2. Server: jwt.verify(refreshToken, JWT_REFRESH_SECRET)
3. Server: Look up user, generate new accessToken
4. Server returns { accessToken }
```

### Logout Flow
```
1. Client: POST /api/auth/logout
2. Server: Clear refreshToken cookie
3. Client: Remove accessToken from localStorage
```

---

## 4. Input Validation (Zod Schema Examples)

```javascript
// Pseudocode - to be implemented by executing AI
const { z } = require('zod');

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required')
});

const experienceSchema = z.object({
  company: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  description: z.string().max(5000).default(''),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  sortOrder: z.number().int().min(0).default(0)
});
```

### Validation Middleware Pattern
```javascript
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: result.error.flatten().fieldErrors 
    });
  }
  req.body = result.data; // Use parsed/cleaned data
  next();
};

// Usage:
router.post('/signup', validate(signupSchema), signupHandler);
```

---

## 5. Object Storage Security

### Policy for S3/Supabase Storage

| Rule | Implementation |
|:-----|:---------------|
| Upload authorization | Only authenticated users can upload. Multer + auth middleware. |
| File type restriction | Server-side MIME check: `application/pdf` only. Do not trust client `Content-Type`. |
| File size limit | 5MB maximum enforced by Multer and storage bucket policy. |
| Filename sanitization | Replace original filename with `{timestamp}-{uuid}.pdf`. |
| Access control | Files are private by default. Generate pre-signed URLs with 1-hour TTL for downloads. |
| Bucket isolation | Separate buckets/folders per company: `uploads/{companyId}/{filename}`. |

---

## 6. Environment Variables (Required)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hr_genetic_ai"

# Authentication (REQUIRED - app must fail-fast if missing)
JWT_SECRET="<openssl rand -base64 64>"
JWT_REFRESH_SECRET="<openssl rand -base64 64>"

# AI Service
AI_SERVICE_URL="http://localhost:8000"
GOOGLE_API_KEY="<rotated-api-key>"

# Frontend
FRONTEND_URL="http://localhost:5173"

# Redis (for BullMQ)
REDIS_URL="redis://localhost:6379"

# Object Storage (optional for MVP, required for production)
STORAGE_BUCKET="hr-genetic-ai"
STORAGE_REGION="ap-southeast-1"
```

### Startup Validation
```javascript
const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'DATABASE_URL'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
}
```

---

## 7. Security Verification Checklist

The executing AI must verify each item after implementation:

- [ ] `POST /api/auth/signup` with `{ role: "ADMIN" }` creates a `CANDIDATE`.
- [ ] `POST /api/auth/signup` with `{ email: "x", password: "1" }` returns 400 validation error.
- [ ] `GET /api/admin/dashboard` without token returns 401.
- [ ] `GET /api/admin/dashboard` with CANDIDATE token returns 403.
- [ ] `GET /api/admin/dashboard` with ADMIN token returns 200.
- [ ] `POST /api/hr/chat` without token returns 401.
- [ ] `POST /api/hr/chat` with CANDIDATE token returns 403.
- [ ] `GET /api/hr/candidates` with HR_MANAGER token returns only candidates with matching `companyId`.
- [ ] `GET /api/candidate/profile` returns only the authenticated candidate's own data.
- [ ] Application refuses to start if `JWT_SECRET` is not set.
- [ ] `.env` files are in `.gitignore` and not tracked.
- [ ] API error responses contain no stack traces, file paths, or internal details.
- [ ] Uploaded files are restricted to PDF MIME type and 5MB max.
- [ ] Refresh token is stored in httpOnly cookie, not in response body or localStorage.

---
*© 2026 Djembar Arafat. All Rights Reserved.*
