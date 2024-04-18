from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Services
from services.translate import translate_text


class TranslateData(BaseModel):
    text: str
    target_language: str


router = APIRouter()


@router.post("/translate", response_model=dict, status_code=200)
async def translate(data: TranslateData):
    # Translate text
    # This is where you would call the translation service
    # and get the translated text
    translated_text = translate_text(data.text, data.target_language)

    # Return translated text
    response = {
        "translated_text": translated_text,
        "status": 200,
    }

    return JSONResponse(response, 200)

