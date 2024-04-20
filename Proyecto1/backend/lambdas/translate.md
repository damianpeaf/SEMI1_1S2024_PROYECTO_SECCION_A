

### Lambda: Translate

Code:

```py
import json
import boto3
import os

client = boto3.client(
    "translate",
    region_name=os.getenv("TRANSLATE_REGION"),
    aws_access_key_id=os.getenv("TRANSLATE_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("TRANSLATE_SECRET_KEY"),
)

def lambda_handler(event, context):
    try:
        # Obtener el body
        bodyRequest = event['body']
        bodyJson = json.loads(bodyRequest)
        
        # Obtener el texto
        text = bodyJson['text']
        
        # Obtener el target language
        target_language = bodyJson['target_language']
        
        response = client.translate_text(
                Text=text,
                SourceLanguageCode="auto",
                TargetLanguageCode=target_language,  # en, es, fr, de, it, pt, nl, pl, ru, zh, ja, ko, ar
            )
        
        translated_text = response["TranslatedText"]
        
        # Construir la response.
        body_response = {
            "translated_text": translated_text,
            "message": "Texto traducido correctamente",
            "status": 200,
        }
        
        return {
            'statusCode': 200,
            'body': json.dumps(body_response)
        }
   
    except Exception as e:
       print(">> Error al traducir la imagen: ")
       print(e)
       
       error_response = {
           "message": "Error al traducir la imagen",
           "status": 500,
           "errorMessage": e,
       }
       
       return {
            'statusCode': 200,
            'body': json.dumps(error_response)
       }
    

```