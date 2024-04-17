from fastapi import APIRouter
from services.cognito import login_user
from pydantic import BaseModel

router = APIRouter()


class LoginData(BaseModel):
    username: str
    password: str


@router.post("/login", response_model=dict, status_code=200)
async def login(data: LoginData):
    # Login user with Cognito
    response = login_user(data.username, data.password)

    return response
