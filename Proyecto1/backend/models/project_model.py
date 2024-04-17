import time
from database.db import get_connection
from .entities.project import Project

class ProjectModel:

    @classmethod
    def add_project(self, project: Project):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO projects (title, description, date_created, location, category) VALUES (%s, %s) RETURNING id",
                    (project.title, project.description, time.strftime('%Y-%m-%d %H:%M:%S'), project.location, project.category)
                )
                affected_rows = cursor.rowcount
                project_id = cursor.fetchone()[0]
                connection.commit()

            connection.close()
            return {"affected_rows": affected_rows, "project_id": project_id}

        except Exception as e:
            print(e)
            raise e