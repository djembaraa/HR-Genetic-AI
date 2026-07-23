from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil

app = FastAPI(title="AI ATS Service")

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "AI ATS Service is running!"}

@app.post("/api/process-cv")
async def process_cv(candidate_id: str = Form(...), file: UploadFile = File(...)):
    """
    Receives a CV PDF from the Node backend, chunks it, and saves embeddings to ChromaDB.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    file_path = os.path.join(UPLOAD_DIR, f"{candidate_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # TODO: Add LangChain DocumentLoader, TextSplitter, and ChromaDB insertion here
    
    return {"status": "success", "message": "CV processed and embedded successfully", "candidate_id": candidate_id}

@app.post("/api/chat")
async def chat_with_agent(query: str = Form(...)):
    """
    Chat endpoint for HR to ask questions about the candidates using RAG agent.
    """
    # TODO: Add LangChain Agent Logic here
    
    return {"reply": f"ECHO: I will eventually answer '{query}' using RAG."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
