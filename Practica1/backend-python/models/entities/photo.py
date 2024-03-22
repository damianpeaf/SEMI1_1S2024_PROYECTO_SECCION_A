class Photo:
    def __init__(self, id, name, url, album_id) -> None:
        self.id = id
        self.name = name
        self.url = url
        self.album_id = album_id

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "url": self.url,
            "album": self.album_id,
        }
