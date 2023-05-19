import psycopg2.sql


class QueryBuilder:
    db_model = None  # DBModel class
    db_table = None  # DBTable class
    field_list = []  # string, not is Attribute class
    condition_list = []  # Condition class
    statement = ""  # string, like Select, Update

    def __init__(self, db_model):
        self.db_model = db_model
        self.clear_field_list()
        self.clear_condition_list()

    def set_table(self, table):
        self.db_table = table

    def add_field(self, field):
        self.field_list.append(field)

    def add_fields(self, fields):
        for field in fields:
            self.field_list.append(field)

    def delete_field(self, field):
        self.field_list.remove(field)

    def add_condition(self, condition):
        self.condition_list.append(condition)

    def delete_condition(self, condition):
        self.condition_list.remove(condition)

    def clear_condition_list(self):
        self.condition_list = []

    def clear_field_list(self):
        self.field_list = []

    def execute_select_query(self):
        cursor = self.db_model.db.conn.cursor()
        sql = ""
        if len(self.field_list) != 0:
            sql = f"SELECT {','.join(self.field_list)} FROM {self.db_table.name}"
        else:
            sql = f"SELECT * FROM {self.db_table.name}"
        condition_values = []

        if len(self.condition_list) != 0:
            sql += f" WHERE {' '.join([str(condition) for condition in self.condition_list])}"
            condition_values = [condition.value for condition in self.condition_list]

        data = condition_values

        cursor.execute(sql, data)
        data = []
        result = cursor.fetchall()
        for row in result:
            res_dictionary = {}
            for i in range(len(self.db_table.attribute_list)):
                res_dictionary[self.db_table.attribute_list[i].name] = row[i]
            data.append(res_dictionary)
        return data

    def execute_update_query(self, old_values, new_values):
        cursor = self.db_model.db.conn.cursor()
        set_params = ""
        for key in new_values.keys():
            set_params += f"{key} = %s, "

        set_params = set_params[:-2]

        where_params = ""
        for key in old_values.keys():
            where_params += f"{key} = %s AND "
        where_params = where_params[:-4]

        sql = f"UPDATE {self.db_table.name} SET {set_params} WHERE {where_params}"
        data = tuple(new_values.values()) + tuple(old_values.values())
        cursor.execute(sql, data)
        self.db_model.db.conn.commit()

    def execute_insert_query(self, attributes, values, table_name=None):
        cursor = self.db_model.db.conn.cursor()
        params = ""
        for val in values:
            params += "%s, "
        params = params[:-2]
        sql = f"INSERT INTO {self.db_table.name if table_name is None else table_name} ({','.join(attributes)}) VALUES ({params})"
        cursor.execute(sql, values)

        self.db_model.db.conn.commit()

    def execute_delete_query(self, values):
        cursor = self.db_model.db.conn.cursor()
        params = ""
        for k in values.keys():
            params += f"{k} = %s AND "

        params = params[:-4]

        sql = f"DELETE FROM {self.db_table.name} WHERE {params}"
        data = tuple(values.values())
        cursor.execute(sql, data)
        self.db_model.db.conn.commit()

