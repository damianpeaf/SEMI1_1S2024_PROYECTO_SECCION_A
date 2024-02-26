from fastapi import APIRouter, Form, UploadFile, File

router = APIRouter()


# Endpoint: /info
# Description: This endpoint is used to update the user's information.
# Body: Form data
# Response: JSON
@router.put("/info", response_model=dict, status_code=200)
async def info(
    name: str = Form(...),
    nickname: str = Form(...),
    photo: UploadFile = File(...),
):
    return {
        "message": "Info updated!",
        "status": 200,
    }

# Endpoint: /info
# Description: This endpoint is used to retrieve the user's information.
# Response: JSON
@router.get("/info", response_model=dict, status_code=200)
async def get_info():
    user_id = 1
    name = "Jane Doe"
    nickname = "Jane"
    photo_url = "https://example.com/photo.jpg"
    return {
        "message": "Info retrieved!",
        "status": 200,
        "data": {
            "userid": user_id,
            "name": name,
            "nickname": nickname,
            "photo": photo_url,
        },
    }