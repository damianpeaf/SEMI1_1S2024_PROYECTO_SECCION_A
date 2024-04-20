import boto3
from decouple import config

# Configurar el cliente de Polly
polly_client = boto3.client(
    "polly",
    region_name=config("POLLY_REGION"),
    aws_access_key_id=config("POLLY_ACCESS_KEY"),
    aws_secret_access_key=config("POLLY_SECRET_KEY"),
) 

# Texto que deseas convertir en voz
texto = (
    "Hola, este es un ejemplo de texto que será convertido en voz usando Amazon Polly."
)

# Llamar al servicio de Polly para sintetizar el texto en voz
response = polly_client.synthesize_speech(
    Text=texto,
    OutputFormat="mp3",
    VoiceId="Mia",
) 

# Guardar el audio sintetizado en un archivo
with open("output.mp3", "wb") as file:
    file.write(response["AudioStream"].read())
