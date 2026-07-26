from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_core.tools import create_retriever_tool
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage
from langchain_core.documents import Document
from loguru import logger
from tenacity import retry, stop_after_attempt, wait_exponential
import logging
import redis
from langchain_core.globals import set_llm_cache
from langchain_community.cache import RedisCache

class InterceptHandler(logging.Handler):
    def emit(self, record):
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())

load_dotenv()

# Setup Semantic Caching with Redis
try:
    redis_client = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))
    set_llm_cache(RedisCache(redis_client))
    logger.info("Semantic Cache (Redis) initialized successfully.")
except Exception as e:
    logger.warning(f"Failed to initialize Redis Cache: {e}")

# Retry wrappers for Circuit Breaker / Resilience
@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10), reraise=True)
def invoke_llm_with_retry(llm, prompt):
    return llm.invoke(prompt)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10), reraise=True)
def invoke_agent_with_retry(agent, payload, config):
    return agent.invoke(payload, config=config)

# Global memory for the agent (in-memory, resets on server restart)
memory = MemorySaver()

app = FastAPI(title="AI ATS Service")

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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
def process_cv(candidate_id: str = Form(...), company_id: str = Form(...), file: UploadFile = File(...)):
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
            split.metadata["company_id"] = company_id
            
        # 3. Create Embeddings and Store in ChromaDB
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
        vectorstore.add_documents(documents=splits)
        logger.info(f"CV for candidate {candidate_id} embedded successfully.")
    except Exception as e:
        logger.error(f"Error processing CV: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
    
    return {"status": "success", "message": "CV processed and embedded successfully", "candidate_id": candidate_id}

@app.post("/api/vectorize-profile")
def vectorize_profile(candidate_id: str = Form(...), company_id: str = Form(...), profile_text: str = Form(...)):
    """
    Receives structured profile text from Node, chunks it, and saves to ChromaDB.
    """
    try:
        # Create a document from the structured text
        docs = [Document(page_content=profile_text, metadata={"candidate_id": candidate_id, "company_id": company_id})]
        
        # Chunk text
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(docs)
        
        # Store in ChromaDB
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
        vectorstore.add_documents(documents=splits)
        
        logger.info(f"Profile for candidate {candidate_id} vectorized successfully.")
        return {"status": "success", "message": "Profile vectorized successfully", "candidate_id": candidate_id}
    except Exception as e:
        logger.error(f"Error vectorizing profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/enhance-resume")
def enhance_resume(text: str = Form(...)):
    """
    Takes raw resume text and rewrites it into a professional, ATS-friendly format
    using active verbs and emphasizing metrics.
    """
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.7)
        prompt = (
            "You are an expert Resume Writer and ATS Optimizer. "
            "Rewrite the following text into professional, impactful bullet points. "
            "Use strong action verbs, quantify achievements where possible, and remove fluff. "
            "Return ONLY the rewritten text, without any conversational preamble or markdown headers. "
            "Keep it concise and punchy.\n\n"
            f"Original text:\n{text}"
        )
        response = invoke_llm_with_retry(llm, prompt)
        logger.info("Resume text enhanced successfully.")
        return {"enhanced_text": response.content}
    except Exception as e:
        logger.error(f"Error enhancing resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def chat_with_agent(query: str = Form(...), company_id: str = Form(...), thread_id: str = Form("default")):
    """
    Chat endpoint for HR to ask questions about the candidates using RAG agent with memory.
    """
    try:
        # 1. Setup LLM and Vector Store
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        
        # Check if DB exists
        if not os.path.exists("./chroma_db"):
             return {"reply": "Sorry, the CV database is empty. Please upload a CV or publish a profile first."}
             
        vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)
        retriever = vectorstore.as_retriever(search_kwargs={"k": 5, "filter": {"company_id": company_id}})
        
        # 2. Create Retriever Tool
        tool = create_retriever_tool(
            retriever,
            "search_candidate_cv",
            "Searches and returns excerpts from candidate CVs. Always use this tool when asked about candidates, their skills, or experiences."
        )
        tools = [tool]
        
        # 3. Setup system prompt
        system_prompt = "You are an intelligent HR Assistant. Your job is to help HR professionals find the best candidates based on the uploaded CVs. Always use the 'search_candidate_cv' tool to search for candidate information before answering. Be professional and objective. Answer in English."
        
        # 4. Create and run Agent with Memory
        agent = create_react_agent(llm, tools, prompt=system_prompt, checkpointer=memory)
        
        config = {"configurable": {"thread_id": thread_id}}
        response = invoke_agent_with_retry(agent, {"messages": [HumanMessage(content=query)]}, config)
        
        content = response["messages"][-1].content
        if isinstance(content, list):
            # Extract text from blocks if it's a list of dicts
            text_reply = " ".join([block.get("text", "") for block in content if isinstance(block, dict) and block.get("type") == "text"])
        else:
            text_reply = content
            
        logger.info(f"Chat agent processed query in thread {thread_id}.")
        return {"reply": text_reply}
    except Exception as e:
        logger.error(f"Agent Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    
    # Configure loguru to intercept uvicorn logs
    logging.getLogger("uvicorn.access").handlers = [InterceptHandler()]
    logging.getLogger("uvicorn.error").handlers = [InterceptHandler()]
    logging.getLogger("uvicorn").handlers = [InterceptHandler()]
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
