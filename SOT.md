# Source of Truth (SOT) - HR-Genetic-AI

## 1. Project Overview
HR-Genetic-AI is a next-generation Applicant Tracking System (ATS) built with a Microservices architecture, integrating Fullstack web development with Generative AI (Agentic RAG).

## 2. Tech Stack
- **Frontend:** React + Vite (Vanilla CSS for custom glassmorphism)
- **Backend (Gateway):** Node.js + Express.js
- **AI Microservice:** Python + FastAPI
- **Databases:** SQLite (via Prisma ORM) for relational data; ChromaDB for Vector Embeddings.
- **AI Models:** Google Gemini API (via Langchain)

## 3. Modularization & Architecture
- **Separation of Concerns:** The Gateway handles auth, routing, and file uploads. The AI Service handles heavy ML tasks (chunking, embeddings, RAG).
- **API First:** Communication between services is done via RESTful APIs.

## 4. Clean Code Principles
- **DRY (Don't Repeat Yourself):** Reusable React components and utility functions.
- **SOLID Principles:** Interfaces for data access (Prisma), single-responsibility controllers in Express and FastAPI.
- **Naming Conventions:** camelCase for variables/functions, PascalCase for React components, snake_case for Python backend.

## 5. Security Guidelines
- **Environment Variables:** All API keys (Gemini), database URLs, and ports must be in `.env` and never committed to Git.
- **Input Validation:** Backend must validate PDF file types and sanitize chat inputs to prevent injection.
- **CORS Configuration:** Restrict API access to trusted frontend origins only.
