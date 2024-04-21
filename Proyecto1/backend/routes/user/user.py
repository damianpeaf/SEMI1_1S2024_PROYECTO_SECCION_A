from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from models.user_model import UserModel

from utils.security import Security

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()

@router.get("/getIdByUsername/{username}", response_model=dict, status_code=200)
async def getIdByUsername(username: str, token: str = Depends(oauth2_scheme)):
    try:
        payload = Security.check_token(token)

        if payload is None:
            return JSONResponse(
                {
                    "message": "Invalid token",
                    "status": 401,
                },
                401,
            )
        
        response = UserModel.get_user_id_by_username(username)

        if response is None:
            return JSONResponse(
                {
                    "message": "User not found",
                    "status": 404,
                },
                404,
            )
        
        return JSONResponse(
            {
                "user_id": response["user_id"],
                "message": "User id found",
                "status": 200,
            },
            200,
        )


    except Exception as e:
        print(e)

    return JSONResponse(
        {
            "message": "Error getting user id by username",
            "status": 500,
        },
        500,
    )
