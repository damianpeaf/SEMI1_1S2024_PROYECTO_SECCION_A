from fastapi import APIRouter, Form, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from utils.security import Security

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Description: This endpoint is used to update the user's information.
# TODO: Implement the update user's info logic
@router.put("/info", response_model=dict, status_code=200)
async def info(
    name: str = Form(...),
    nickname: str = Form(...),
    photo: UploadFile = File(...),
    token: str = Depends(oauth2_scheme),
):
    # Validate token
    payload = Security.verify_token({"Authorization": f"Bearer {token}"})

    if payload:
        # Update user's info

        return JSONResponse(
            content={"message": "Info updated!", "status": 200}, status_code=200
        )
    else:
        return JSONResponse(
            content={"message": "No autorizado", "status": 401}, status_code=401
        )


# Description: This endpoint is used to retrieve the user's information.
# TODO: Implement the get user's info logic
@router.get("/info", response_model=dict, status_code=200)
async def get_info(token: str = Depends(oauth2_scheme)):

    return JSONResponse(
        content={"message": "Info retrieved!", "status": 200}, status_code=200
    )
