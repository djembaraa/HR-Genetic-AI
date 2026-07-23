# System Workflow - HR-Genetic-AI

## 1. Data Ingestion Flow (Applicant)
1. **Frontend:** Applicant fills out a form and selects a PDF CV.
2. **Gateway (Express):** Receives the `multipart/form-data`.
3. **Gateway (Express):** Saves Candidate metadata to SQLite (Prisma). Generates a `candidate_id`.
4. **Gateway (Express):** Forwards the PDF stream and `candidate_id` to the FastAPI Microservice.
5. **AI Service (FastAPI):** 
   - `PyPDFLoader` extracts text.
   - `RecursiveCharacterTextSplitter` chunks the text.
   - Embeds the chunks using Gemini Embeddings.
   - Saves to ChromaDB with `candidate_id` as metadata.
6. **Frontend:** Receives success notification.

## 2. Agentic Retrieval Flow (HRD)
1. **Frontend:** HRD types a query (e.g., "Find candidates with Node.js experience").
2. **Gateway (Express):** Forwards the query to the FastAPI chat endpoint.
3. **AI Service (FastAPI):**
   - The Langchain Agent receives the query.
   - The Agent decides to use the "Search CVs" tool.
   - The tool performs a Similarity Search in ChromaDB.
   - The Agent synthesizes the retrieved chunks into a natural language response.
4. **Frontend:** Displays the AI's response in the Chat UI.
