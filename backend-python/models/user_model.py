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
                               VALUES (%s, %s, %s, %s)""",
                    (user.username, user.name, user.password, user.photo_url),
                )

                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return affected_rows

        except Exception as e:
            print(e)
