from database.db import get_connection
from .entities.user_project import UserProject

class UserProjectModel:

    @classmethod
    def add_user_project(self, user_project: UserProject):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO user_project (user_id, project_id, role_id) VALUES (%s, %s, %s) RETURNING id",
                    (user_project.user_id, user_project.project_id, user_project.role_id)
                )
                affected_rows = cursor.rowcount
                user_project_id = cursor.fetchone()[0]
                connection.commit()

            connection.close()
            return {"affected_rows": affected_rows, "user_project_id": user_project_id}

        except Exception as e:
            print(e)
            raise e

    @classmethod
    def get_projects_by_user(self, user_id):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT p.id, p.name, p.description, p.created_at 
                    r.name as role_name
                    ARRAY(
                        SELECT id, name
                        from privilege
                        where id = ANY(r.privileges)
                    ) as role_privileges
                    FROM projects p
                    JOIN user_projects up ON p.id = up.project_id
                    JOIN role r ON up.role_id = r.id
                    WHERE up.user_id = %s
                    """
                    (user_id,)
                )
                projects = cursor.fetchall()

            connection.close()
            return projects

        except Exception as e:
            print(e)
            raise e
        
    @classmethod
    def get_user_project(self, user_id: int, project_id: int):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT * FROM user_project WHERE user_id = %s AND project_id = %s",
                    (user_id, project_id)
                )
                user_project = cursor.fetchone()
                connection.close()
                return user_project

        except Exception as e:
            print(e)
            raise e
        

    @classmethod
    def get_members_by_project(self, project_id: int):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT u.id, u.name, u.email, r.name as role_name
                    FROM users u
                    JOIN user_project up ON u.id = up.user_id
                    JOIN role r ON up.role_id = r.id
                    WHERE up.project_id = %s
                    """
                    (project_id,)
                )
                members = cursor.fetchall()

            connection.close()
            return members

        except Exception as e:
            print(e)
            raise e