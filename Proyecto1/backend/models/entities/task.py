class Task:
    def __init__(
            self, id=None, project_id=None, state=None, image_url=None, notes=None,
    ):
        self.id = id
        self.project_id = project_id
        self.state = state
        self.image_url = image_url
        self.notes = notes

    def to_json(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'state': self.state,
            'image_url': self.image_url,
            'notes': self.notes
        }