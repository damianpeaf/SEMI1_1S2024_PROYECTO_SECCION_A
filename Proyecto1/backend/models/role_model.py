# Enum with the roles of the users
from enum import Enum
class Role(Enum):
    OWNER = 1
    COLLABORATOR = 2
    VIEWER = 3

class RoleModel:
    def __init__(self, id, name):
        self.id = id
        self.name = name

    @staticmethod
    def get_role_by_name(id):
        if id == Role.OWNER:
            return RoleModel(Role.OWNER.value, Role.OWNER.name)
        elif id == Role.COLLABORATOR:
            return RoleModel(Role.COLLABORATOR.value, Role.COLLABORATOR.name)
        elif id == Role.VIEWER:
            return RoleModel(Role.VIEWER.value, Role.VIEWER.name)
        else:
            return None