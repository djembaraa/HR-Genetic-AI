from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.tools.retriever import create_retriever_tool
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate

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
    try:
        # 1. Setup LLM and Vector Store
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        
        # Check if DB exists
        if not os.path.exists("./chroma_db"):
             return {"reply": "Maaf, database CV masih kosong. Silakan upload CV terlebih dahulu."}
             
        vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
        retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
        
        # 2. Create Retriever Tool
        tool = create_retriever_tool(
            retriever,
            "search_candidate_cv",
            "Searches and returns excerpts from candidate CVs. Always use this tool when asked about candidates, their skills, or experiences."
        )
        tools = [tool]
        
        # 3. Setup Agent Prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an intelligent HR Assistant. Your job is to help HR professionals find the best candidates based on the uploaded CVs. Always use the 'search_candidate_cv' tool to search for candidate information before answering. Be professional and objective. Answer in Indonesian."),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}"),
        ])
        
        # 4. Create and run Agent
        agent = create_tool_calling_agent(llm, tools, prompt)
        agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
        
        response = agent_executor.invoke({"input": query})
        
        return {"reply": response["output"]}
    except Exception as e:
        print(f"Agent Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
