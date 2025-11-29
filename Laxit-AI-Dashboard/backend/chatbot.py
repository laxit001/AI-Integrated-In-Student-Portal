from fastapi import APIRouter
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"

class Chat(BaseModel):
    prompt: str

@router.post("/")
def chat(data: Chat):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "FastAPI Chat"
    }

    body = {
    "model": "openai/gpt-4o-mini",
    "messages": [
        {"role": "system", "content": "You are an AI Student Dashboard Assistant. You must answer all questions asked by students clearly and helpfully."},
        {"role": "user", "content": data.prompt}
    ]
}


    response = requests.post(ENDPOINT, headers=headers, json=body)
    reply = response.json()["choices"][0]["message"]["content"]
    
    return {"reply": reply}
