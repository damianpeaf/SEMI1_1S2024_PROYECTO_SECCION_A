import hashlib


class Encrypt:

    @classmethod
    def md5_encrypt(cls, password: str) -> str:
        return hashlib.md5(password.encode("utf-8")).hexdigest()