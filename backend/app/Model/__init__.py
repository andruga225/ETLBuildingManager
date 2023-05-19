from app.Model.DBModel import DbModel
from app.Model.ETLBuilidngSystem import ETLBuildingSystem
from app.Model.QueryBuilder import QueryBuilder
from app.common.db import Database

etl_building_manager = ETLBuildingSystem()
db = Database()
db_model = DbModel(db)
query_builder = QueryBuilder(db_model)

