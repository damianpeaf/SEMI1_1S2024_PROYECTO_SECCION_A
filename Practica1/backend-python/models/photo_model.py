from database.db import get_connection
from .entities.photo import Photo


class PhotoModel:

    @classmethod
    def add_photo(cls, photo: Photo):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """INSERT INTO photo (\"name\", url, album)
                               VALUES (%s, %s, %s)
                               RETURNING id;""",
                    (str(photo.name), str(photo.url), int(photo.album_id)),
                )

                affected_rows = cursor.rowcount
                photo_id = cursor.fetchone()[0]
                connection.commit()

            connection.close()
            return {"affected_rows": affected_rows, "photo_id": photo_id}
        except Exception as e:
            print(e)
            raise e

    @classmethod
    def get_all_photos(cls, album_id: int):
        try:
            connection = get_connection()

            with connection.cursor() as cursor:
                cursor.execute(
                    """SELECT id, name, url FROM photo WHERE album = %s""",
                    (int(album_id),),
                )

                rows = cursor.fetchall()

            photos = []
            for row in rows:
                photo = Photo(row[0], row[1], row[2], album_id)
                photos.append(photo.to_json())

            connection.close()
            return photos
        except Exception as e:
            print(e)
            raise e
