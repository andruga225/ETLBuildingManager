from app.Model.Attribute import Attribute
from app.Model.Enums import DataType


class DbTable:

    db_model = None  # DBModel class
    attribute_list = []  # List of Attribute class
    name = ""
    primary_key = None

    def __init__(self, table_name, db_model):
        self.name = table_name
        self.db_model = db_model
        self.load_attributes()

    @classmethod
    def DbTable(self, table_name, db_model, attribute_list):
        self.name = table_name
        self.db_model = db_model
        self.attribute_list = attribute_list
        self.create_table(self)

    def load_attributes(self):
        self.attribute_list = []
        cursor = self.db_model.db.conn.cursor()
        SQL = """SELECT
                                                    pg_attribute.attname AS attribute_name,
                                                    pg_type.typname as type_name
                                                FROM
                                                    pg_catalog.pg_attribute
                                                INNER JOIN
                                                    pg_catalog.pg_class ON pg_class.oid = pg_attribute.attrelid
                                                INNER JOIN
                                                    pg_catalog.pg_namespace ON pg_namespace.oid = pg_class.relnamespace
                                                INNER JOIN
                                                    pg_catalog.pg_type on pg_attribute.atttypid = pg_type.oid
                                                WHERE
                                                    pg_attribute.attnum > 0
                                                    AND NOT pg_attribute.attisdropped
                                                    AND pg_namespace.nspname = 'public'
                                                    AND pg_class.relkind ='r'
                                                    AND pg_class.relname = %s 
                                                ORDER BY
                                                    pg_class.relname ASC,
                                                    attnum ASC;"""
        data = (self.name,)
        cursor.execute(SQL, data)
        attributes = cursor.fetchall()

        for attribute in attributes:
            self.attribute_list.append(Attribute(attribute[0], self.name, attribute[1]))

    def create_table(self):
        attr_string_list = f""
        for attr in self.attribute_list:
                attr_string_list += f"{attr.name} {attr.get_attribute_type()}, "

        attr_string_list = attr_string_list[:-2]

        cursor = self.db_model.db.conn.cursor()
        sql = f"""CREATE TABLE {self.name} (
                    {attr_string_list}  
                  )"""
        cursor.execute(sql)
        self.db_model.db.conn.commit()

    def drop_table(self):
        cursor = self.db_model.db.conn.cursor()
        sql = f"DROP TABLE {self.name}"
        try:
            cursor.execute(sql)
            self.db_model.db.conn.commit()
            return 0
        except:
            return 1
