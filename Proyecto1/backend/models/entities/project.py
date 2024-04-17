class Project:
    def __init__(
            self, id=None, title=None, description=None, date_created=None, location=None, category=None,
    ):
        self.id = id
        self.title = title
        self.description = description
        self.date_created = date_created
        self.location = location
        self.category = category

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date_created': self.date_created,
            'location': self.location,
            'category': self.category
        }