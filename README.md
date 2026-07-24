# HR-Genetic-AI

HR-Genetic-AI is a Next-Generation Applicant Tracking System (ATS) powered by Generative AI. This platform autonomously screens, summarizes, and retrieves ideal candidates based on their CVs using Retrieval-Augmented Generation (RAG) and Agentic Tool Calling.

## System Architecture

The application is built using a Microservices architecture to ensure scalability and separation of concerns:

- **Frontend:** React (Vite) - Handles the user interface, CV uploads, and the HR Chatbot UI.
- **API Gateway:** Node.js (Express) & Prisma ORM (SQLite) - Acts as the primary backend for data management and file routing.
- **AI Microservice:** Python (FastAPI) & Langchain - Handles PDF extraction, vector embeddings (ChromaDB), and Agentic LLM interactions via Google Gemini API.

## Technical Specifications

- **Frontend:** React, Vite, Vanilla CSS
- **Backend:** Node.js, Express, Prisma, Multer
- **AI Service:** Python, FastAPI, Langchain, ChromaDB, Google Gemini API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (3.9 or higher)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/djembaraa/HR-Genetic-AI.git
   cd HR-Genetic-AI
   ```

2. **Setup AI Microservice (Python):**
   ```bash
   cd ai-service
   pip install fastapi uvicorn python-multipart langchain langchain-community langchain-chroma chromadb langchain-google-genai pypdf python-dotenv
   ```
   Create a `.env` file in the `ai-service/` directory and add your API key:
   `GEMINI_API_KEY="your_google_gemini_api_key"`

3. **Setup API Gateway (Node.js):**
   ```bash
   cd ../backend-node
   npm install
   npx prisma migrate dev --name init
   ```

4. **Setup Frontend (React):**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

To run the application locally, you will need to start all three services in separate terminal instances.

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
