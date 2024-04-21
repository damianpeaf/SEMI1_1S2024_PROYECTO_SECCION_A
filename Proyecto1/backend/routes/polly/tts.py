from fastapi import APIRouter, Response, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Services
from services.polly import polly_tts


router = APIRouter()


class TTSData(BaseModel):
    text: str


@router.post("/tts", status_code=200, response_model=bytes)
async def image_ocr(data: TTSData):
    polly_response = polly_tts(data.text)

    return Response(polly_response, media_type="audio/mpeg")
