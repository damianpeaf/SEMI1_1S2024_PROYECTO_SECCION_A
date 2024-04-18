import boto3
from decouple import config


client = boto3.client(
    "translate",
    region_name=config("TRANSLATE_REGION"),
    aws_access_key_id=config("TRANSLATE_ACCESS_KEY"),
    aws_secret_access_key=config("TRANSLATE_SECRET_KEY"),
)


async def translate_text(text: str, target_language: str):
    try:
        response = client.translate_text(
            Text=text,
            SourceLanguageCode="auto",
            TargetLanguageCode=target_language,  # en, es, fr, de, it, pt, nl, pl, ru, zh, ja, ko, ar
        )
        return response["TranslatedText"]
    except Exception as e:
        raise (e)
