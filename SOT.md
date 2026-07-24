# Single Source of Truth (SOT) - Master Index

> **Version:** 2.0 (Dual-Sided Enterprise Platform)
> **Last Updated:** 2026-07-24
> **Copyright:** © 2026 Djembar Arafat. All Rights Reserved.

---

## 1. Introduction
This document serves as the **Master Index** for all *Single Source of Truth* (SOT) documentation for the **HR Genetic AI** project. This project is a dual-sided platform: a B2B SaaS for HR/Recruiters and a B2C Portal for Job Seekers.

All development, architectural changes, and codebase implementations **must** refer to the documents below to ensure system consistency and adherence to industry standards.

## 2. Core SOT Documents

### 📘 [WORKFLOW.md](./WORKFLOW.md)
Contains the overall system architecture (Node.js & Python topology), 6 core data pipelines (from CV upload to RAG Chat), and the 4-phase execution roadmap. It also outlines Enterprise operations standards (DLQ, Redis, CI/CD, Sentry).

### 📘 [DB-Relations.md](./DB-Relations.md)
Contains the relational database schema (PostgreSQL) using Prisma ORM. It covers the implementation of Multi-Tenant isolation (`companyId`), structured resume tables (Experience, Education, Skills), and data integrity rules (Cascade rules).

### 📘 [SECURITY.md](./SECURITY.md)
Contains strict security protocols, including JWT management (Access & Refresh Tokens), Role-Based Access Control (ADMIN, HR_MANAGER, RECRUITER, CANDIDATE), input validation via Zod, and standard OWASP vulnerability mitigations.

### 📘 [UIUX.md](./UIUX.md)
Contains the design system (colors, typography, spacing) extracted from high-quality visual references. It includes guidelines for responsive layout slicing, icon standardization (`lucide-react`), and CSS architecture (BEM).

---

## 3. Golden Rules of Development
1. **No Emojis:** The user interface must strictly avoid emoji characters. Always use the `lucide-react` icon library.
2. **Strict Security:** All sensitive routes (`/api/admin`, `/api/hr`) must be protected by JWT middleware and role verification.
3. **Data Isolation (Multi-Tenant):** Candidate and job data must never leak across companies. All queries must include a `companyId` filter.
4. **AI Resilience:** Vectorization processes and Gemini LLM API calls must be wrapped with error handling and queued (via BullMQ) to prevent blocking the main server responses.

---
*© 2026 Djembar Arafat. All Rights Reserved.*
