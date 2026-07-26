<div align="center">
  <img src="https://via.placeholder.com/150x150/2563eb/ffffff?text=NexHire+AI" alt="NexHire AI Logo" width="120" height="120" />
  
  # NexHire AI 🤖💼
  **Next-Generation AI Applicant Tracking System (ATS) with Agentic RAG**
  
  [![Build Status](https://github.com/djembar/hr-genetic-ai/actions/workflows/main.yml/badge.svg)](https://github.com/djembar/hr-genetic-ai/actions)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100-teal)](https://fastapi.tiangolo.com/)
  [![LangChain](https://img.shields.io/badge/LangChain-Agentic_RAG-orange)](https://python.langchain.com/)
</div>

<br/>

NexHire AI is an enterprise-grade Applicant Tracking System built to solve the biggest bottleneck in recruitment: **CV Screening & Candidate Matching**. By leveraging Agentic Retrieval-Augmented Generation (RAG) and Semantic Caching, NexHire AI allows HR professionals to chat with their candidate database in natural language and receive highly accurate, hallucination-free insights.

---

## ✨ Key AI Features (Why this project stands out)

### 🧠 1. Agentic RAG (Retrieval-Augmented Generation)
Unlike standard LLM wrappers, this system uses **LangGraph** to create an intelligent agent capable of multi-step reasoning. 
- When an HR manager asks *"Which candidates have React experience?"*, the agent uses a custom `search_candidate_cv` tool to query **ChromaDB**.
- The agent verifies the extracted facts against the PDF vectors, completely eliminating hallucinations.

### ⚡ 2. Semantic Caching with Redis
To ensure lightning-fast API responses and reduce LLM token costs, the Python AI Service utilizes **Redis Semantic Caching**. Repeated HR queries are intercepted and answered from the cache instantly without hitting the Gemini API.

### 🔄 3. Asynchronous CV Vectorization (BullMQ)
Processing large PDF CVs into vector embeddings is computationally heavy. This project uses **BullMQ** and **Redis** to offload CV parsing and vectorization to background workers, ensuring the Express API Gateway remains non-blocking and highly available.

### 🔒 4. Enterprise-Grade Security
- Multi-tenant data isolation (HR from Company A cannot query CVs from Company B).
- Robust Authentication (Short-lived JWTs + HTTPOnly Refresh Tokens).
- Strict API Key validation between microservices (Node.js $\leftrightarrow$ FastAPI).
- Zod schema validation to prevent NoSQL/SQL injection and malformed requests.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[React + Vite Frontend] -->|REST API + JWT| Gateway(Node.js Express Gateway)
    
    subgraph Core Backend
    Gateway <-->|Read/Write| Postgres[(PostgreSQL)]
    Gateway -->|Queue CV Job| Redis[(Redis Queue)]
    Worker[BullMQ Worker] <--|Consume Job| Redis
    end
    
    subgraph AI Microservice
    Worker -->|Send PDF/Text + API Key| FastAPI(Python FastAPI)
    Gateway -->|Chat Query + API Key| FastAPI
    FastAPI <-->|Semantic Cache| Redis
    FastAPI <-->|Store/Search Vectors| ChromaDB[(ChromaDB)]
    FastAPI <-->|Embeddings/LLM| Gemini[Google Gemini 2.5 Flash]
    end
```

---

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, React Query (TanStack), Framer Motion.
- **Backend (API Gateway):** Node.js, Express, Prisma ORM, PostgreSQL, BullMQ, Redis, Zod.
- **AI Service:** Python 3.11, FastAPI, LangChain, LangGraph, ChromaDB, Google Generative AI (Gemini).
- **DevOps:** Docker Compose, GitHub Actions (CI/CD), Winston Logger, Sentry (ready).

---

## 🚀 Quick Start (Local Development)

The entire application is containerized for a seamless developer experience.

### Prerequisites
- Docker & Docker Compose
- Node.js v20+
- Python 3.11+
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hr-genetic-ai.git
   cd hr-genetic-ai
   ```

2. **Environment Variables**
   Duplicate `.env.example` in both `backend-node` and `ai-service` and rename them to `.env`. Fill in your `GOOGLE_API_KEY` in the AI Service.

3. **Start the Infrastructure**
   ```bash
   # Starts Postgres, Redis, Node Backend, Python AI, and React Frontend
   docker-compose up -d --build
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Node API: `http://localhost:3000`
   - Python AI: `http://localhost:8000`

---

## 👤 Author
Developed by a passionate AI Engineer focusing on building scalable, intelligent systems. Open to opportunities in Purwokerto and beyond!
