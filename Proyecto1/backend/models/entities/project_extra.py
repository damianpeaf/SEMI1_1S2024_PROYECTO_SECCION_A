class ProjectExtra:
    def __init__(
            self, id=None, project_id=None, notes=None, image_url=None, extra_type=None,
    ):
        self.id = id
        self.project_id = project_id
        self.notes = notes
        self.image_url = image_url
        self.extra_type = extra_type

    def to_json(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'notes': self.notes,
            'image_url': self.image_url,
            'extra_type': self.extra_type
        }