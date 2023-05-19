import sys
import psycopg2
import configparser
from pathlib import Path

config = configparser.ConfigParser()
config.read(str(Path(__file__).parent.parent) + "\config.ini")


class Database:
    name = ""

    def __init__(self):
        self.conn = self.connect()

    def connect(self):
        """
        Connect to database and return connection
        """
        print("Connecting to PostgreSQL Database...")
        try:
            conn = psycopg2.connect(
                host=config['DATABASE']['Host'],
                dbname=config['DATABASE']['Db'],
                user=config['DATABASE']['User'],
                password=config['DATABASE']['Password'],
                port=config['DATABASE']['Port']
            )
            self.name = config['DATABASE']['Db']
        except psycopg2.OperationalError as e:
            print(f"Could not connect to Database: {e}")
            sys.exit(1)

        return conn

    def reconnect(self, dbname):
        """
        Connect to database and return connection
        """
        print("Connecting to PostgreSQL Database...")
        try:
            conn = psycopg2.connect(
                host=config['DATABASE']['Host'],
                dbname=dbname,
                user=config['DATABASE']['User'],
                password=config['DATABASE']['Password'],
                port=config['DATABASE']['Port']
            )
            self.name = dbname
            self.conn = conn
        except psycopg2.OperationalError as e:
            print(f"Could not connect to Database: {e}")
            sys.exit(1)


    @staticmethod
    def connect_to_main_database():
        """
        Connect to database and return connection
        """
        print("Connecting to PostgreSQL Database...")
        try:
            conn = psycopg2.connect(
                host=config['DATABASE']['Host'],
                dbname='postgres',
                user=config['DATABASE']['User'],
                password=config['DATABASE']['Password'],
                port=config['DATABASE']['Port']
            )
        except psycopg2.OperationalError as e:
            print(f"Could not connect to Database: {e}")
            sys.exit(1)

        return conn

