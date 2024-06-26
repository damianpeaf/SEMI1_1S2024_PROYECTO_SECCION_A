import psycopg
from psycopg import DatabaseError
from decouple import config


def get_connection():
    try:
        return psycopg.connect(
            host=config("PGSQL_HOST"),
            user=config("PGSQL_USER"),
            password=config("PGSQL_PASSWORD"),
            port=config("PGSQL_PORT"),
            dbname=config("PGSQL_DATABASE"),
        )
    except DatabaseError as e:
        print(f"Error DB: {e}")
        raise e
    except Exception as e:
        print(f"Error DB Connection: {e}")
        raise e
