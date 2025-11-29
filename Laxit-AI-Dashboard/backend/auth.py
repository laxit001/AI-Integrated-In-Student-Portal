from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

fake_users = {
    "student1": "1234",
    "laxit": "pass123",
    "1":"1"
}

class Login(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(data: Login):
    if data.username in fake_users and fake_users[data.username] == data.password:
        return {"success": True}
    raise HTTPException(status_code=401, detail="Invalid username or password")
