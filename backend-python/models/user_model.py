from database.db import get_connection
from .entities.user import User


class UserModel:

    @classmethod
    def add_user(self, user: User):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """INSERT INTO \"user\" (username, \"name\", \"password\", photo_url)
                               VALUES (%s, %s, %s, %s)
                               RETURNING id;""",
                    (user.username, user.name, user.password, user.photo_url),
                )

                affected_rows = cursor.rowcount
                user_id = cursor.fetchone()[0]
                connection.commit()

            connection.close()
            return {"affected_rows": affected_rows, "user_id": user_id}

        except Exception as e:
            print(e)
            raise e

    # Return the user if it exists, otherwise return None
    @classmethod
    def login_user(self, user: User):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """SELECT * FROM \"user\" WHERE username = %s AND \"password\" = %s""",
                    (user.username, user.password),
                )

                result = cursor.fetchone()
                connection.close()

            return result

        except Exception as e:
            print(e)
            raise e

    @classmethod
    def update_user(self, user_id, name=None, username=None, photo_url=None):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                query = "UPDATE \"user\" SET "
                params = []
                if name:
                    query += "\"name\" = %s, "
                    params.append(name)
                if username:
                    query += "username = %s, "
                    params.append(username)
                if photo_url:
                    query += "photo_url = %s, "
                    params.append(photo_url)
                
                query = query[:-2] + " WHERE id = %s"
                params.append(user_id)
                
                cursor.execute(query, params)
                    
                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)

    @classmethod
    def get_user(self, user_id):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """SELECT * FROM \"user\" WHERE id = %s""",
                    (user_id,),
                )

                result = cursor.fetchone()
                connection.close()

            return result
        except Exception as e:
            print(e)
            raise e