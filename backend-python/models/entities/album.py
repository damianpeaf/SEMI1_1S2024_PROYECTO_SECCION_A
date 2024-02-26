class EAlbumType:
    STANDARD = 1
    PROFILE = 2


class AlbumType:
    def __init__(self, id, name):
        self.id = id
        self.name = name

    def to_json(self):
        return {"id": self.id, "name": self.name}


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
