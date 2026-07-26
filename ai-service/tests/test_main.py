from fastapi.testclient import TestClient
import sys
import os

# Ensure the parent directory is in the path to import main
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "AI ATS Service is running!"}

def test_process_cv_missing_file():
    # Sending missing file should raise 422 Unprocessable Entity by FastAPI validation
    response = client.post(
        "/api/process-cv",
        data={"candidate_id": "1", "company_id": "1"}
    )
    assert response.status_code == 422

def test_vectorize_profile_missing_fields():
    response = client.post(
        "/api/vectorize-profile",
        data={"candidate_id": "1"} # missing company_id and profile_text
    )
    assert response.status_code == 422

def test_chat_without_db():
    # Should safely return fallback message if DB doesn't exist
    response = client.post(
        "/api/chat",
        data={"query": "test", "company_id": "1", "thread_id": "test"}
    )
    assert response.status_code == 200
    assert "reply" in response.json()
