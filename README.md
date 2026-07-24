# HR Genetic AI

HR Genetic AI is an enterprise-grade, dual-sided Applicant Tracking System (ATS) and Career Portal powered by Retrieval-Augmented Generation (RAG) and Agentic Workflow algorithms. The platform autonomously screens resumes, optimizes candidate profiles, and provides a conversational AI assistant for Human Resources professionals to query applicant data with precision.

## Core Capabilities

- **B2B HR Dashboard:** Multi-tenant isolated workspace for recruiters to manage job postings, parse applicant data, and consult a contextual AI Assistant to identify the best candidates.
- **B2C Candidate Portal:** A structured resume builder that allows job seekers to input their experience and utilize a "Human-in-the-Loop" AI to enhance their profiles for ATS compatibility.
- **Agentic RAG Engine:** Leverages Google Gemini and ChromaDB to extract, embed, and semantically search unstructured CV data, entirely preventing AI hallucinations through strict contextual bounds.

## System Architecture

The application implements a distributed microservices architecture to ensure high availability, data isolation, and separation of concerns:

- **Frontend Application (React / Vite):** Handles the user interface, incorporating strict responsive design systems and dual-portal layouts (Candidate vs. HR).
- **API Gateway (Node.js / Express):** Acts as the primary orchestrator, managing Role-Based Access Control (RBAC), JWT authentication, PostgreSQL relational data (via Prisma ORM), and asynchronous task queues (BullMQ).
- **AI Microservice (Python / FastAPI):** Dedicated intelligence layer running LangGraph. Manages vectorization, semantic caching, and Large Language Model (LLM) invocations.

## Technical Stack

- **Client:** React 18, Vite, Lucide React, Vanilla CSS (BEM Architecture)
- **Gateway:** Node.js v24, Express, Prisma ORM, PostgreSQL, Zod, Redis (BullMQ)
- **Intelligence:** Python 3.9+, FastAPI, LangChain, LangGraph, ChromaDB, Google Gemini API

## Getting Started

### Prerequisites

- Node.js (v24 or higher)
- Python (3.9 or higher)
- PostgreSQL (or Supabase instance)
- Redis (Optional for local MVP)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/djembaraa/HR-Genetic-AI.git
   cd HR-Genetic-AI
   ```

2. **Configure the AI Microservice (Python):**
   ```bash
   cd ai-service
   python -m venv venv
   source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
   pip install -r requirements.txt
   ```
   Create a `.env` file in the `ai-service/` directory:
   ```env
   GOOGLE_API_KEY="your_google_gemini_api_key"
   ```

3. **Configure the API Gateway (Node.js):**
   ```bash
   cd ../backend-node
   npm install
   ```
   Create a `.env` file in the `backend-node/` directory:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/hr_genetic_ai"
   JWT_SECRET="your_secure_random_string"
   AI_SERVICE_URL="http://localhost:8000"
   ```
   Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Configure the Frontend (React):**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

To run the application locally, start all three services in separate terminal instances.

**Terminal 1 (AI Service):**
```bash
cd ai-service
python main.py
```

**Terminal 2 (API Gateway):**
```bash
cd backend-node
node index.js
```

**Terminal 3 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---
*© 2026 Djembar Arafat. All Rights Reserved.*
