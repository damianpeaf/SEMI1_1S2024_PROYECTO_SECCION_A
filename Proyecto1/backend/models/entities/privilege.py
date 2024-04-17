class Privilege:
    def __init__(
            self, id=None, name=None,
    ):
        self.id = id
        self.name = name

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name
        }