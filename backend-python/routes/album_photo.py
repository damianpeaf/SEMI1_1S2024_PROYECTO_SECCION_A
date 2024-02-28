from fastapi import APIRouter, Form, UploadFile, File
from fastapi.responses import JSONResponse

from utils.file_uploader import FileUploader


router = APIRouter()


@router.post("/album/{album_id}/photo", response_model=dict, status_code=200)
async def upload_photo(
    album_id: int,
    photoName: str = Form(...),
    image: UploadFile = File(...),
):
    try:
        # Upload photo to S3 and get the file url
        file_location = f"Fotos_Publicadas/{album_id}/{photoName}"
        file_url = FileUploader.upload_photo(image.file, file_location)
        
        return JSONResponse(content={"message": "Photo uploaded!", "status": 200}, status_code=200)
    
    except Exception as e:
        print(e)
        return JSONResponse(content={"message": "Error uploading photo", "status": 500}, status_code=500)


# TODO: Get Method
