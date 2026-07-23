# Proof of Concept (PoC) - HR-Genetic-AI

## 1. Objective
To prove that an AI-powered Applicant Tracking System can intelligently assist HR professionals by parsing CVs and answering queries using Retrieval-Augmented Generation (RAG).

## 2. Core Features for PoC
1. **CV Upload & Embedding:** Ability to upload a PDF resume, extract its text, and store it as vector embeddings.
2. **AI HR Assistant:** A chat interface where HR can ask: "Who is the best fit for Frontend?" and the Agent retrieves relevant CVs from the vector database.

## 3. Success Criteria
- The system correctly chunks and embeds at least 3 sample PDFs without crashing.
- The AI Agent successfully retrieves information from the uploaded PDFs rather than hallucinating based on its general knowledge.
- End-to-end latency from frontend request to AI response is under 5 seconds.

## 4. Risks & Mitigations
- **Rate Limits:** Free tier of Gemini API might hit limits. Mitigation: Implement exponential backoff and error handling in the Python service.
- **Hallucinations:** Mitigation: Use strict system prompts for the Langchain Agent to only use context provided by the Vector Store.
