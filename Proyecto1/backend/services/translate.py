import boto3
from decouple import config


client = boto3.client(
    "translate",
    region_name=config("TRANSLATE_REGION"),
    aws_access_key_id=config("TRANSLATE_ACCESS_KEY"),
    aws_secret_access_key=config("TRANSLATE_SECRET_KEY"),
)


async def translate_text(text, target_language):
    params = {
        "SourceLanguageCode": "auto",
        "TargetLanguageCode": target_language,
        "Text": text,
    }

    try:
        response = await client.translate_text(**params)
        return response["TranslatedText"]
    except Exception as e:
        raise (e)
