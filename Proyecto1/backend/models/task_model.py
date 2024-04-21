from database.db import get_connection
from models.entities.task import Task

class TaskModel:
    @classmethod
    def get_tasks(self, project_id):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """SELECT * FROM task WHERE project_id = %s""",
                    (project_id),
                )

                result = cursor.fetchall()
                connection.close()

            return result
        except Exception as e:
            raise e
        
    @classmethod
    def put_task(self, task: Task):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """UPDATE task SET state = %s, image_url = %s, notes = %s WHERE id = %s""",
                    (task.state, task.image_url, task.notes, task.id),
                )
                
                affected_rows = cursor.rowcount
                connection.close()

            return {"affected_rows": affected_rows}
        except Exception as e:
            raise e
        

    @classmethod
    def delete_task(self, task_id):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """DELETE FROM task WHERE id = %s""",
                    (task_id),
                )
                
                affected_rows = cursor.rowcount
                connection.close()

            return {"affected_rows": affected_rows}
        except Exception as e:
            raise e
        
    @classmethod
    def post_task(self, task: Task):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """INSERT INTO task (project_id, state, image_url, notes) VALUES (%s, %s, %s, %s)""",
                    (task.project_id, task.state, task.image_url, task.notes),
                )
                
                affected_rows = cursor.rowcount
                connection.close()

            return {"affected_rows": affected_rows}
        except Exception as e:
            raise e
