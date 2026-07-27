# Proof of Concept (PoC) - HR Genetic AI v2.0

> **Version:** 2.0 (Dual-Sided Enterprise Platform)
> **Last Updated:** 2026-07-24
> **Copyright:** © 2026 Djembar Arafat. All Rights Reserved.

---

## 1. Primary Objective
To prove that an Enterprise-scale system architecture utilizing PostgreSQL (Prisma) can handle two isolated user domains simultaneously (B2B HR and B2C Candidates), while demonstrating the Gemini AI's ability to accurately read, optimize, and search candidates without hallucinations.

## 2. Core Features for PoC

### A. B2B Side (HR & Recruiters)
1. **Security & Multi-Tenancy:** HR users can only view data belonging to their own company (`companyId`).
2. **AI RAG Assistant (Chatbot):** HR users can query the chatbot (e.g., *"Who is the best fit for Frontend?"*), and the AI will respond with relevant candidate data retrieved from the Vector Database (ChromaDB), maintaining conversational memory.

### B. B2C Side (Job Seekers)
1. **Structured Resume Builder:** Candidates can create structured profiles (Experience, Education, Skills) stored in PostgreSQL.
2. **AI ATS Enhancement:** Candidates can request the AI to refine their work experience text into formal, ATS-compliant bullet points (Human-in-the-Loop feature).
3. **Database-to-Vector Pipeline:** When a candidate publishes their profile, the system extracts text directly from the database (bypassing PDF parsing) and sends it to ChromaDB asynchronously.

## 3. Success Criteria
- **Data Integrity:** PostgreSQL successfully segregates data across companies (zero applicant data leakage between tenants).
- **Security:** Login and registration are protected by JWT (Access & Refresh tokens). Account creation cannot be exploited to gain ADMIN privileges via HTTP Request manipulation.
- **AI Accuracy:** The AI Chatbot only answers based on data within the vector database, and the ATS Enhancement returns clean, bulleted formatting.
- **Latency & Reliability:** Uploads and vectorization processes do not freeze the main application (Non-blocking I/O).

## 4. Risks & Mitigations
- **Gemini API Token Limits:** To prevent hitting free-tier limits, background job queues (Redis/BullMQ) will be implemented with retry and exponential backoff strategies.
- **Relational Schema Overhead:** To maintain fast query speeds in PostgreSQL, indexing (`@@index`) is applied to frequently queried columns such as `companyId` and `status`.

---
*© 2026 Djembar Arafat. All Rights Reserved.*
