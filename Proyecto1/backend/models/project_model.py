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
                    "INSERT INTO project (title, description, date_created, location, category) VALUES (%s, %s, %s, %s, %s) RETURNING id",
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
        
    @classmethod
    def get_project_by_id(self, project_id: int) -> Project:
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT * FROM project WHERE id = %s",
                    (project_id,)
                )
                project = cursor.fetchone()
                connection.close()
                return project

        except Exception as e:
            print(e)
            raise e
        
    @classmethod
    def update_project(self, project_id, title=None, description=None, location=None, category=None):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                query = "UPDATE project SET "
                params = []

                if title is not None:
                    query += "title = %s, "
                    params.append(title)

                if description is not None:
                    query += "description = %s, "
                    params.append(description)

                if location is not None:
                    query += "location = %s, "
                    params.append(location)

                if category is not None:
                    query += "category = %s, "
                    params.append(category)

                # Eliminar la coma y el espacio adicionales al final de la consulta
                query = query[:-2]

                # Agregar la condición WHERE
                query += " WHERE id = %s"
                params.append(project_id)

                cursor.execute(query, params)
                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return {"affected_rows": affected_rows}

        except Exception as e:
            print(e)
            raise e
        
    @classmethod
    def delete_project(self, project_id: int):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    "DELETE FROM project WHERE id = %s",
                    (project_id,)
                )
                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return {"affected_rows": affected_rows}

        except Exception as e:
            print(e)
            raise e