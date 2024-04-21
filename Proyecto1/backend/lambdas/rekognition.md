

### Lambda: Rekognition

Code:

```py
import json
import boto3
import base64
import os

client = boto3.client(
    "rekognition",
    aws_access_key_id=os.getenv("REKOGNITION_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("REKOGNITION_SECRET_KEY"),
    region_name=os.getenv("REKOGNITION_REGION"),
)

def lambda_handler(event, context):
    try:
        # Obtener el body
        bodyRequest = event['body']
        bodyJson = json.loads(bodyRequest)
        
        print(">> Body obtenido: ", bodyJson)
        
        # Obtener la imagen
        image = bodyJson['image']
        
        # Decodificar las imágenes base64
        bytes_img = base64.b64decode(image)
        
        
        print(">> Enviando imagenes a Rekognition")
        
        response = client.detect_text(Image={"Bytes": bytes_img})
        
        # Unir las lineas reconocidas
        detected_text = ""
        for item in response["TextDetections"]:
            if item["Type"] == "LINE":
                detected_text += item["DetectedText"] + "\n"
        
        # Construir la response.
        body_response = {
            "detected_text": detected_text,
            "message": "Texto extraido correctamente",
            "status": 200,
        }
        
    except Exception as e:
        print(">> Error al analizar la imagen: ")
        print(e)
        
        error_response = {
            'statusCode': 500,
            'body': json.dumps({
                "message": "Error al analizar la imagen",
                "error": e,
                "status": 500
            })
        }
        
        return error_response
        
    # Retornar response
    new_response = {
        'statusCode': 200,
        'body': json.dumps(body_response)
    }
    
    return new_response

```