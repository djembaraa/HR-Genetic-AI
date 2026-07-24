# DB-Relations.md - PostgreSQL Schema, Multi-Tenant Relations & Structured Resume Tables

> **Document Type:** Single Source of Truth (SOT)
> **Version:** 2.0 (Dual-Sided Platform)
> **Last Updated:** 2026-07-24
> **Author:** Principal Architect (Audit Phase)
> **Status:** PLANNING - Awaiting Execution by Gemini Agent

---

## 1. Migration: SQLite to PostgreSQL

### Current State
- SQLite via `@libsql/client` + `@prisma/adapter-libsql`
- Single-file database (`dev.db`)
- No multi-tenancy, no structured resume tables

### Target State
- PostgreSQL (local Docker or managed service like Supabase/Neon)
- Prisma native PostgreSQL provider (no adapter needed)
- Multi-tenant via `companyId` foreign key on all tenant-scoped entities
- Structured resume tables (Experience, Education, Skill)

### Migration Steps
1. Install PostgreSQL locally or provision a managed instance
2. Update `.env` with `DATABASE_URL="postgresql://user:pass@localhost:5432/hr_genetic_ai"`
3. Update `schema.prisma` datasource to `provider = "postgresql"`
4. Remove `@libsql/client` and `@prisma/adapter-libsql` dependencies
5. Revert `lib/prisma.js` to standard `new PrismaClient()` (no adapter)
6. Run `npx prisma migrate dev --name init-postgres`

---

## 2. Entity Relationship Diagram

```mermaid
erDiagram
    Company ||--o{ User : "employs"
    Company ||--o{ Job : "posts"
    Company ||--o{ Candidate : "receives applications from"
    User ||--o| Candidate : "has candidate profile"
    Job ||--o{ Candidate : "receives applications"
    Candidate ||--o{ Experience : "has work history"
    Candidate ||--o{ Education : "has education"
    Candidate ||--o{ Skill : "has skills"

    Company {
        Int id PK
        String name UK
        String slug UK
        DateTime createdAt
        DateTime updatedAt
    }

    User {
        Int id PK
        String email UK
        String password
        String role "ADMIN | HR_MANAGER | RECRUITER | CANDIDATE"
        Int companyId FK "nullable for CANDIDATE"
        DateTime createdAt
        DateTime updatedAt
    }

    Job {
        Int id PK
        Int companyId FK
        String title
        String department
        String description
        String location
        String type "FULL_TIME | PART_TIME | CONTRACT | REMOTE"
        String status "OPEN | CLOSED | DRAFT"
        DateTime createdAt
        DateTime updatedAt
    }

    Candidate {
        Int id PK
        Int userId FK UK
        Int appliedJobId FK "nullable"
        Int companyId FK "nullable - set when applying to a company job"
        String name
        String email UK
        String phone "nullable"
        String location "nullable"
        String summary "nullable - personal statement"
        String cvFileName "nullable - uploaded PDF filename"
        String vectorizationStatus "PENDING | PROCESSING | COMPLETED | FAILED"
        DateTime createdAt
        DateTime updatedAt
    }

    Experience {
        Int id PK
        Int candidateId FK
        String company
        String title
        String description "ATS-optimized text, editable by candidate"
        DateTime startDate
        DateTime endDate "nullable - null means current"
        Int sortOrder
        DateTime createdAt
        DateTime updatedAt
    }

    Education {
        Int id PK
        Int candidateId FK
        String institution
        String degree
        String field
        DateTime startDate
        DateTime endDate "nullable"
        Int sortOrder
        DateTime createdAt
        DateTime updatedAt
    }

    Skill {
        Int id PK
        Int candidateId FK
        String name
        String proficiency "BEGINNER | INTERMEDIATE | ADVANCED | EXPERT"
        DateTime createdAt
    }
```

---

## 3. Target Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --- Multi-Tenant Root ---

model Company {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  slug      String   @unique
  users     User[]
  jobs      Job[]
  candidates Candidate[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// --- Authentication & Authorization ---

model User {
  id        Int        @id @default(autoincrement())
  email     String     @unique
  password  String
  role      String     @default("CANDIDATE") // ADMIN, HR_MANAGER, RECRUITER, CANDIDATE
  companyId Int?
  company   Company?   @relation(fields: [companyId], references: [id])
  candidate Candidate?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@index([companyId])
  @@index([role])
}

// --- Job Postings ---

model Job {
  id          Int         @id @default(autoincrement())
  companyId   Int
  company     Company     @relation(fields: [companyId], references: [id])
  title       String
  department  String
  description String
  location    String      @default("")
  type        String      @default("FULL_TIME") // FULL_TIME, PART_TIME, CONTRACT, REMOTE
  status      String      @default("OPEN")      // OPEN, CLOSED, DRAFT
  candidates  Candidate[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([companyId])
  @@index([status])
  @@index([companyId, status])
}

// --- Candidate Profile ---

model Candidate {
  id                   Int          @id @default(autoincrement())
  userId               Int          @unique
  user                 User         @relation(fields: [userId], references: [id])
  appliedJobId         Int?
  appliedJob           Job?         @relation(fields: [appliedJobId], references: [id])
  companyId            Int?
  company              Company?     @relation(fields: [companyId], references: [id])
  name                 String
  email                String       @unique
  phone                String?
  location             String?
  summary              String?
  cvFileName           String?
  vectorizationStatus  String       @default("PENDING") // PENDING, PROCESSING, COMPLETED, FAILED
  experiences          Experience[]
  educations           Education[]
  skills               Skill[]
  createdAt            DateTime     @default(now())
  updatedAt            DateTime     @updatedAt

  @@index([companyId])
  @@index([appliedJobId])
  @@index([vectorizationStatus])
}

// --- Structured Resume: Work Experience ---

model Experience {
  id          Int       @id @default(autoincrement())
  candidateId Int
  candidate   Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  company     String
  title       String
  description String    @default("")
  startDate   DateTime
  endDate     DateTime?
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([candidateId])
}

// --- Structured Resume: Education ---

model Education {
  id          Int       @id @default(autoincrement())
  candidateId Int
  candidate   Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  institution String
  degree      String
  field       String
  startDate   DateTime
  endDate     DateTime?
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([candidateId])
}

// --- Structured Resume: Skills ---

model Skill {
  id          Int       @id @default(autoincrement())
  candidateId Int
  candidate   Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  name        String
  proficiency String    @default("INTERMEDIATE") // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
  createdAt   DateTime  @default(now())

  @@index([candidateId])
}
```

---

## 4. Indexing Strategy

| Table | Index | Purpose |
|:------|:------|:--------|
| `User` | `email` (unique) | Login lookup |
| `User` | `companyId` | Tenant-scoped user listing |
| `User` | `role` | Role-filtered queries |
| `Job` | `companyId` | Tenant-scoped job listing |
| `Job` | `companyId, status` | Composite: active jobs per tenant |
| `Candidate` | `companyId` | Tenant-scoped candidate listing |
| `Candidate` | `appliedJobId` | Join optimization: candidates per job |
| `Candidate` | `vectorizationStatus` | Queue worker status polling |
| `Experience` | `candidateId` | Resume section loading |
| `Education` | `candidateId` | Resume section loading |
| `Skill` | `candidateId` | Resume section loading |

---

## 5. Cascade Rules

| Relation | On Delete | Rationale |
|:---------|:----------|:----------|
| `Candidate.experiences` | CASCADE | Deleting a candidate removes all their work history. |
| `Candidate.educations` | CASCADE | Deleting a candidate removes all their education records. |
| `Candidate.skills` | CASCADE | Deleting a candidate removes all their skills. |
| `Job.candidates` | SET NULL | Deleting a job does NOT delete candidates. `appliedJobId` becomes `null`. |
| `Company.users` | RESTRICT | Cannot delete a company that has active users. |
| `Company.jobs` | CASCADE | Deleting a company removes all its job postings. |

---

## 6. Data Integrity Rules

| Rule | Layer | Description |
|:-----|:------|:------------|
| Email uniqueness | DB (`@unique`) | Enforced at database level for both `User` and `Candidate`. |
| Role constraint | Application | Sign-up hardcodes `CANDIDATE`. HR roles assigned via `ADMIN`-only endpoint with validation against allowed values. |
| Company isolation | Application | All HR queries include `WHERE companyId = req.user.companyId`. Never trust client-supplied `companyId`. |
| Password hashing | Application | Bcrypt, minimum 10 salt rounds. |
| CV filename sanitization | Application | Timestamp-prefixed. Only basename stored, never absolute path. |
| Vectorization status | Application | State machine: `PENDING -> PROCESSING -> COMPLETED` or `PENDING -> PROCESSING -> FAILED`. No backwards transitions except retry (`FAILED -> PENDING`). |
| Sort order | Application | `Experience` and `Education` entries respect `sortOrder` for display. Client can reorder via PATCH. |

---

## 7. Seed Script Specification

File: `backend-node/prisma/seed.js`

```javascript
// Pseudocode - to be implemented by executing AI
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Create default company
  const company = await prisma.company.upsert({
    where: { slug: 'wiratek' },
    update: {},
    create: { name: 'Wiratek AI', slug: 'wiratek' }
  });

  // 2. Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@wiratek.ai' },
    update: {},
    create: {
      email: 'admin@wiratek.ai',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: company.id
    }
  });

  // 3. Create sample jobs
  await prisma.job.createMany({
    data: [
      { companyId: company.id, title: 'Frontend Engineer', department: 'Engineering', description: 'React, TypeScript, CSS' },
      { companyId: company.id, title: 'AI Engineer', department: 'AI/ML', description: 'Python, LangChain, RAG' },
      { companyId: company.id, title: 'Product Manager', department: 'Product', description: 'Roadmap, stakeholders' }
    ],
    skipDuplicates: true
  });
}

main();
```

### Prisma Config Addition (package.json)
```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

Run: `npx prisma db seed`

---
*© 2026 Djembar Arafat. All Rights Reserved.*
