import boto3
from decouple import config

s3 = boto3.client(
    "s3", 
    region_name=config("S3_REGION"),
    aws_access_key_id=config("S3_ACCESS_KEY"), 
    aws_secret_access_key=config("S3_SECRET_KEY")
)

def upload_photo(file, file_key) -> str:
    try:
        s3.upload_fileobj(file, config("S3_BUCKET"), file_key)
        file_url = file_url = f"https://{config("S3_BUCKET")}.s3.amazonaws.com/{file_key}"       
        return file_url
    except Exception as e:
        raise e