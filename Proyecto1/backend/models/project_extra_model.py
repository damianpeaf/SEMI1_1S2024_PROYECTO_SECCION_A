from database.db import get_connection

class ProjectExtraModel:
    @classmethod
    def get_project_extra(self, project_id):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """SELECT * FROM project_extra WHERE project_id = %s""",
                    (project_id),
                )

                result = cursor.fetchone()
                connection.close()

            return result
        except Exception as e:
            raise e
        
    @classmethod
    def put_project_extra(self, project_id, description=None, image_url=None):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                query = "UPDATE project_extra SET "
                params = []
                
                if description is not None:
                    query += "description = %s, "
                    params.append(description)
                    
                if image_url is not None:
                    query += "image_url = %s, "
                    params.append(image_url)
                
                query = query[:-2] + " WHERE project_id = %s"
                params.append(project_id)
                
                cursor.execute(query, params)
                    
                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return {"affected_rows": affected_rows}
        except Exception as e:
            raise e
        
    @classmethod
    def delete_project_extra(self, project_id):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """DELETE FROM project_extra WHERE project_id = %s""",
                    (project_id,),
                )

                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return {"affected_rows": affected_rows}
        except Exception as e:
            raise e
        
    @classmethod
    def post_project_extra(self, project_id, description, image_url):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """INSERT INTO project_extra (project_id, description, image_url) VALUES (%s, %s, %s)""",
                    (project_id, description, image_url),
                )

                connection.commit()
                connection.close()
        except Exception as e:
            raise e
            