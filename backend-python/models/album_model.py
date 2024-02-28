from database.db import get_connection
from .entities.album import Album


class AlbumModel:

    @classmethod
    def add_album(cls, album: Album):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """INSERT INTO album (\"name\", \"user\", album_type)
                               VALUES (%s, %s, %s)""",
                    (str(album.name), int(album.userid), album.album_type),
                )

                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return affected_rows
        except Exception as e:
            print(e)
            raise e

    @classmethod
    def get_album(cls, album: Album):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """SELECT * FROM album WHERE id = %s AND \"user\" = %s""",
                    (int(album.id), int(album.userid)),
                )

                result = cursor.fetchone()
                connection.commit()

            connection.close()
            return result
        except Exception as e:
            print(e)
            raise e

    @classmethod
    def get_all_albums(cls, userid: int):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """SELECT * FROM album WHERE \"user\" = %s""",
                    (int(userid),),
                )

                result = cursor.fetchall()
                connection.commit()

            albums = []
            for album in result:
                albums.append(
                    {
                        "id": album[0],
                        "name": album[1],
                    }
                )

            connection.close()
            return albums
        except Exception as e:
            print(e)
            raise e

    @classmethod
    def update_album(cls, album: Album):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """UPDATE album SET \"name\" = %s
                               WHERE id = %s AND \"user\" = %s""",
                    (str(album.name), int(album.id), int(album.userid)),
                )

                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return affected_rows
        except Exception as e:
            print(e)
            raise e

    @classmethod
    def delete_album(cls, album: Album):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """DELETE FROM album WHERE id = %s AND \"user\" = %s""",
                    (int(album.id), int(album.userid)),
                )

                affected_rows = cursor.rowcount
                connection.commit()

            connection.close()
            return affected_rows
        except Exception as e:
            print(e)
            raise e
