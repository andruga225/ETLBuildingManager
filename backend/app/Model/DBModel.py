from psycopg2 import sql

from app.Model.Attribute import Attribute
from app.Model.Condition import Condition
from app.Model.Enums import DataType
from app.Model.QueryBuilder import QueryBuilder
from app.Model.DBTable import DbTable
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT


class DbModel:
    name = ""
    table_list = []  # DBTable class
    db = None  # Database class. Global variable
    cursor = None  # Cursor for execute query

    def __init__(self, db):
        self.db = db
        self.cursor = db.conn.cursor()
        self.load_tables()

    def change_db(self, db):
        self.db = db
        self.cursor = db.conn.cursor()
        self.table_list = []
        self.load_tables()

    def load_tables(self):
        self.cursor.execute("""SELECT
                                        table_name
                                    FROM information_schema.tables
                                    WHERE table_schema='public'""")
        table_list = self.cursor.fetchall()
        self.table_list = [DbTable(table[0], self) for table in table_list]

    def create_table(self, attributes, table_name):
        self.table_list.append(DbTable.DbTable(table_name, self, attributes))

    def create_database(self, name):
        self.db.conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        self.cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(name)))
        self.db.conn.commit()

    def create_type(self):
        try:
            sql = """CREATE TYPE coordinates AS (lat float, lon float)"""
            self.cursor.execute(sql)
            self.db.conn.commit()
        finally:
            return


# test = DbModel(db)
# query = QueryBuilder(test)
# query.set_table(next(table for table in test.table_list if table.name == "book"))
# query.add_fields(["name", "year"])
# query.add_field("id")
# query.add_condition(Condition(query.db_table, "year", ">", 1900))
# query.add_condition(Condition(query.db_table, "year", "<", 2000, "AND"))
# print(query.execute_select_query())
# #query.execute_insert_query([49,"1", "2", "3", "true"])
# #query.execute_delete_query([49])
# #query.execute_update_query(48, {"name" : "hey", "year" : 846})


