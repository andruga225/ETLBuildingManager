import json
from json import JSONEncoder
from pathlib import Path


from app.Model.ETL import ETL
from app.Model.Enums import Source
from app.common.db import Database


class Encoder(JSONEncoder):
    def default(self, o):
        if not isinstance(o, Source):
            return o.__dict__
        else:
            return o.name

class ETLBuildingSystem:
    etl_list = []  # List of ETL class
    dbmodel_list = []  # List of string

    def __init__(self):
        self.etl_list = []
        self.dbmodel_list = []
        self.desirialize()
        self.load_db_list()

    def add_etl(self, new_etl):
        self.etl_list.append(new_etl)

    def remove_etl(self, etl):
        self.etl_list.remove(etl)

    def load_db_list(self):
        db = Database.connect_to_main_database()
        cursor = db.cursor()

        sql = """select datname 
                        from pg_catalog.pg_database
                        where datistemplate=false
                        order by datname;"""

        cursor.execute(sql)
        result = cursor.fetchall()
        for res in result:
            self.dbmodel_list.append(res[0])

    def __toJson__(self):
        return json.dumps(self, default=lambda o: o.__dict__, indent=4)

    def serialize(self):
        with open(str(Path(__file__).parent.parent) + '\Data\data.json', "w") as write:
            json.dump(self, write, cls=Encoder)

    def desirialize(self):
        try:
            with open(str(Path(__file__).parent.parent) + '\Data\data.json', "r") as read:
                a = json.load(read)
                for i in a['etl_list']:
                    self.add_etl(
                        ETL(int(i['id']), i['name'], i['db_name'], i['table_name'],
                            Source.local if i['source_type'] == "local" else Source.ethernet, i['source_attr_list'],
                            i['table_attr_list'], i['url'], i['request_param_list']))
        finally:
            return
