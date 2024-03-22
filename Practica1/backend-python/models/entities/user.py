class User:
    def __init__(
        self, id=None, username=None, name=None, password=None, photo_url=None
    ):
        self.id = id
        self.username = username
        self.name = name
        self.password = password
        self.photo_url = photo_url

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "password": self.password,
            "photo_url": self.photo_url,
        }
