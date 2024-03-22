from enum import Enum

class AlbumType(Enum):
    PROFILE = 1
    STANDARD = 2

class Album:
    def __init__(self, id, name, userid, album_type):
        self.id = id
        self.name = name
        self.userid = userid
        self.album_type = album_type

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "userid": self.userid,
            "album_type": self.album_type,
        }
