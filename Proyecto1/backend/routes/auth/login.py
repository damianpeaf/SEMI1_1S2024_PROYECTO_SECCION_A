from fastapi import APIRouter
from fastapi.responses import JSONResponse
from services.cognito import login_user
from pydantic import BaseModel

router = APIRouter()


class LoginData(BaseModel):
    username: str
    password: str


@router.post("/login", response_model=dict, status_code=200)
async def login(data: LoginData):
    # Login user with Cognito
    result_cognito = login_user(data.username, data.password)

    # Check if user was logged in
    if "error" in result_cognito:
        return JSONResponse(
            result_cognito,
            result_cognito.get("status") if "status" in result_cognito else 500,
        )    

    # Return token if success
    response = {
        "Token": result_cognito.get("AuthenticationResult").get("AccessToken"),
        "ExpiresIn": result_cognito.get("AuthenticationResult").get("ExpiresIn"),
        "message": "User logged in successfully",
        "status": 200,
    }

    return JSONResponse(response, 200)
