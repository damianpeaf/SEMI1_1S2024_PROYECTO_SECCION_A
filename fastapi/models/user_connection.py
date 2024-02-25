import psycopg
from decouple import config

db_name = config('DATABASE_NAME')
db_user = config('DATABASE_USER')
db_password = config('DATABASE_PASSWORD')
db_host = config('DATABASE_HOST')
db_port = config('DATABASE_PORT')

class UserConnection():
    def __init__(self) -> None:
        try:
            self.conn = psycopg.connect(f"dbname={db_name} user={db_user} password={db_password} host={db_host} port={db_port}") 
        except psycopg.OperationalError as e:
            print(e)
    
    def __def__(self):
        self.conn.close()