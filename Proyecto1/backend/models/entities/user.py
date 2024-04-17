class User:
    def __init__(
            self, id=None, username=None, name=None, password=None,
    ):
        self.id = id
        self.username = username
        self.name = name
        self.password = password
    
    def to_json(self):
        return {
            'id': self.id,
            'username': self.username,
            'name': self.name,
            'password': self.password
        }