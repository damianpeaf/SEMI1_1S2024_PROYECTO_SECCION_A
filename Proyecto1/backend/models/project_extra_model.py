class ProjectExtraModel:
    @classmethod
    def get_project_extra_by_project_id(cls, project_id: int):
        project_extra = ProjectExtraModel.query.filter_by(project_id=project_id).first()
        return project_extra