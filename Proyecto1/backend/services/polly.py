import boto3
from decouple import config

# Configurar el cliente de Polly
polly_client = boto3.client(
    "polly",
    region_name=config("POLLY_REGION"),
    aws_access_key_id=config("POLLY_ACCESS_KEY"),
    aws_secret_access_key=config("POLLY_SECRET_KEY"),
) 

def polly_tts(text: str) -> bytes:
    # Llamar al servicio de Polly para sintetizar el texto en voz
    response = polly_client.synthesize_speech(
        Text=text,
        OutputFormat="mp3",
        VoiceId="Mia",
    )
    return response["AudioStream"].read()
