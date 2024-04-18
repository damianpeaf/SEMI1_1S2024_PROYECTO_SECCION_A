from models.entities.user import User
from database.db import get_connection
from utils.encrypt import Encrypt


class UserModel:

    @classmethod
    def add_user(self, user: User) -> dict:
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """INSERT INTO \"user\" (id, username, \"name\", \"password\")
                               VALUES (%s, %s, %s, %s)
                               RETURNING id;""",
                    (user.id, user.username, user.name, Encrypt.md5_encrypt(user.password)),
                )

                affected_rows = cursor.rowcount
                user_id = cursor.fetchone()[0]
                connection.commit()

            connection.close()
            return {"affected_rows": affected_rows, "user_id": user_id}

        except Exception as e:
            raise e


    @classmethod
    def get_user(self, user_id: None):
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
            raise e
        
    @classmethod
    def get_auth_user(self, username, password):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """SELECT * FROM \"user\" WHERE username = %s AND \"password\" = %s""",
                    (username, Encrypt.md5_encrypt(password)),
                )
                    
                result = cursor.fetchone()
                connection.close()

            return result
        except Exception as e:
            raise e