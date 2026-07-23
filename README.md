# HR-Genetic-AI 🚀

Next-Generation Applicant Tracking System (ATS) powered by Generative AI. 
This platform autonomously screens, summarizes, and retrieves ideal candidates based on their CVs using RAG (Retrieval-Augmented Generation) and Agentic Tool Calling.

## 🌟 Key Features
- **AI-Powered CV Screening:** Extracts text from uploaded PDF resumes.
- **RAG Architecture:** Uses Langchain, Google Gemini Embeddings, and ChromaDB to perform semantic search over applicant data.
- **HR Assistant Chatbot:** Agentic workflow allowing HR professionals to interactively ask questions about candidates (e.g., "Who has React experience?") with zero hallucination.
- **Modern UI:** Sleek, glassmorphism-inspired React frontend built on Gestalt principles.
- **Microservices Architecture:** 
  - Frontend: React (Vite)
  - API Gateway: Node.js (Express) & Prisma ORM (SQLite)
  - AI Microservice: Python (FastAPI) & Langchain

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Vanilla CSS
- **Backend:** Node.js, Express, Prisma, Multer
- **AI Service:** Python, FastAPI, Langchain, ChromaDB, Google Gemini API

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Google Gemini API Key

### 2. Installation & Setup

**Clone the repository:**
```bash
git clone https://github.com/djembaraa/HR-Genetic-AI.git
cd HR-Genetic-AI
```

**Step 1: Setup AI Microservice (Python)**
```bash
cd ai-service
pip install fastapi uvicorn python-multipart langchain langchain-community langchain-chroma chromadb langchain-google-genai pypdf python-dotenv
```
*Create a `.env` file in `ai-service/` and add:*
`GEMINI_API_KEY="your_google_gemini_api_key"`

**Step 2: Setup API Gateway (Node.js)**
```bash
cd backend-node
npm install
npx prisma migrate dev --name init
```

**Step 3: Setup Frontend (React)**
```bash
cd frontend
npm install
```

### 3. Running the Application Locally
You will need 3 separate terminal instances.

- **Terminal 1 (AI Service):**
  ```bash
  cd ai-service
  python main.py
  ```
- **Terminal 2 (API Gateway):**
  ```bash
  cd backend-node
  node index.js
  ```
- **Terminal 3 (Frontend):**
  ```bash
  cd frontend
  npm run dev
  ```
Access the application at `http://localhost:5173`.
