from decouple import config
import boto3


class FileUploader:

    acess_key = config("S3_ACCESS_KEY")
    secret_key = config("S3_SECRET_KEY")
    bucket_name = config("S3_BUCKET_NAME")

    @classmethod
    def upload_photo(cls, file, file_key):
        s3 = boto3.client(
            "s3", aws_access_key_id=cls.acess_key, aws_secret_access_key=cls.secret_key
        )

        try:
            s3.upload_fileobj(file, cls.bucket_name, file_key)

            file_url = f"https://{cls.bucket_name}.s3.amazonaws.com/{file_key}"

            return file_url

        except Exception as e:
            print("Something went wrong", e)
            return None
