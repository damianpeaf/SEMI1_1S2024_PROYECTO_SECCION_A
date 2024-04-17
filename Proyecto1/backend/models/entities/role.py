class Role:
    def __init__(
            self, id=None, privilege_id=None, name=None,
    ):
        self.id = id
        self.privilege_id = privilege_id
        self.name = name

    def to_json(self):
        return {
            'id': self.id,
            'privilege_id': self.privilege_id,
            'name': self.name
        }
    
