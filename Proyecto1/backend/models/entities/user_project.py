class UserProject:
    def __init__(
            self, id=None, project_id=None, user_id=None, role_id=None,
    ):
        self.id = id
        self.project_id = project_id
        self.user_id = user_id
        self.role_id = role_id

    def to_json(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'user_id': self.user_id,
            'role_id': self.role_id
        }