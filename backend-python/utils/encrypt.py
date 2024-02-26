import hashlib

class Encrypt:
    
    @classmethod
    def md5_encrypt(password: str) -> str:
        return hashlib.md5(password.encode('utf-8')).hexdigest()