import boto3
from decouple import config


client = boto3.client(
    "rekognition",
    region_name=config("REKOGNITION_REGION"),
    aws_access_key_id=config("REKOGNITION_ACCESS_KEY"),
    aws_secret_access_key=config("REKOGNITION_SECRET_KEY"),
)


def rekognition_ocr(image) -> str:
    try:
        response = client.detect_text(Image={"Bytes": image})

        detected_text = ""
        for item in response["TextDetections"]:
            if item["Type"] == "LINE":
                detected_text += item["DetectedText"] + "\n"

        return detected_text

    except Exception as e:
        raise e
