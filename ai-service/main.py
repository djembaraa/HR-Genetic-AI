from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

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
        
    try:
        # 1. Extract text from PDF
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        
        # 2. Chunk text
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        
        # Add candidate_id to metadata
        for split in splits:
            split.metadata["candidate_id"] = candidate_id
            
        # 3. Create Embeddings and Store in ChromaDB
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vectorstore = Chroma.from_documents(
            documents=splits, 
            embedding=embeddings, 
            persist_directory="./chroma_db"
        )
    except Exception as e:
        print(f"Error processing CV: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    
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
