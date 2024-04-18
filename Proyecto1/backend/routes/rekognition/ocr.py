from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Services
from services.rekognition import rekognition_ocr


router = APIRouter()


@router.post("/ocr", response_model=dict, status_code=200)
async def image_ocr(
    image: UploadFile = File(None)
):
    # Get image bytes
    image_bytes = await image.read()
    
    # Get text from image
    detected_text = rekognition_ocr(image_bytes)
    
    # Return detected text
    response = {
        "detected_text": detected_text,
        "status": 200,
    }

    return JSONResponse(response, 200)

