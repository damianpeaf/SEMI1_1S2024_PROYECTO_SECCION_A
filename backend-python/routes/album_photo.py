from fastapi import APIRouter, Form, UploadFile, File

router = APIRouter()


@router.post("/album/{album_id}/photo", response_model=dict, status_code=200)
async def upload_photo(
    album_id: int,
    image: UploadFile = File(...),
    photoName: str = Form(...),
):
    print(f"Album ID: {album_id}")
    return {
        "message": "Photo uploaded!",
        "status": 200,
    }


# TODO: Get Method
