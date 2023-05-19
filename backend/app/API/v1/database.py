import json
import urllib.parse
from typing import Union

from fastapi.encoders import jsonable_encoder
from fastapi import APIRouter, Query, Body
from starlette.responses import Response

from app.Model import *
from app.Model.Attribute import Attribute
from app.Model.Condition import Condition
from app.Model.DBTable import DbTable
from app.Model.ETL import ETL
from app.Model.Enums import Source

db_router = APIRouter()


@db_router.get("/databases")
def get_database_list():
    return jsonable_encoder(etl_building_manager.dbmodel_list)


@db_router.post("/database")
def post_database(name: str):
    db_model.create_database(name)
    db.reconnect(name)
    db_model.change_db(db)
    db_model.create_type()
    etl_building_manager.dbmodel_list.append(db.name)
    print(db.name)
    return jsonable_encoder(db.name)


@db_router.put("/database")
def change_current_database(name: str):
    db.reconnect(name)
    db_model.change_db(db)
    return jsonable_encoder(db.name)

@db_router.get("/database/current-database")
def get_current_database():
    return jsonable_encoder(db.name)


@db_router.get("/database/tables")
def get_tables():
    print(jsonable_encoder([table.name for table in db_model.table_list]))
    return [
        {
            "name": table.name,
            "attributes": [
                {
                    "name": attr.name,
                    "type": attr.type.name
                } for attr in table.attribute_list
            ]
        }for table in db_model.table_list
    ]


@db_router.get("/database/table/")
def get_table(name: str):
    return [
        {
            "name": table.name,
            "attributes": [
                {
                    "name": attr.name,
                    "type": attr.type.name
                } for attr in table.attribute_list
            ]
        }for table in db_model.table_list if table.name == name
    ]


@db_router.get("/database/table/{name}/fields")
def get_table_fields(name: str):
    table = next(table for table in db_model.table_list if table.name == name)
    return [
                {
                    "name": attr.name,
                    "type": attr.type.name
                } for attr in table.attribute_list
            ]

@db_router.post("/database/table/")
def post_table(name: str, attributes: list[str] = Query(), types: list[str] = Query()):
    DbTable.DbTable(name, db_model, [Attribute(attributes[i], name, types[i]) for i in range(len(attributes))])
    db_model.load_tables()
    return [
        {
            "name": table.name,
            "attributes": [
                {
                    "name": attr.name,
                    "type": attr.type.name
                } for attr in table.attribute_list
            ]
        }for table in db_model.table_list if table.name == name
    ]


@db_router.put("/database/set-table/{name}")
def set_table_to_query(name: str):
    query_builder.set_table(next(table for table in db_model.table_list if table.name == name))
    query_builder.clear_field_list()
    query_builder.clear_condition_list()
    return [
        {
            "name": table.name,
            "attributes": [
                {
                    "name": attr.name,
                    "type": attr.type.name
                } for attr in table.attribute_list
            ]
        }for table in db_model.table_list if table.name == name
    ]


@db_router.put("/database/table/record")
def put_data_in_table(new_values: dict = Body(), old_values: dict = Body()):
    print(old_values)
    print(new_values)
    query_builder.execute_update_query(old_values, new_values)
    return [{
        "status": "success",
    }]


@db_router.delete("/database/table/record")
def delete_data_from_table(values: dict = Body()):
    print(values)
    #query_builder.execute_delete_query(values)
    return [{
        "status": "success",
    }]


@db_router.post("/database/table/field")
def put_fields(fields: list[str] = Query()):
    query_builder.add_fields(fields)
    return jsonable_encoder(query_builder.field_list)


@db_router.delete("/database/table/field")
def delete_condition(field: str):
    query_builder.delete_field(field)
    return jsonable_encoder(query_builder.field_list)


@db_router.post("/database/table/condition")
def post_condition(field: str, operator: str, value: str, logic_operator: Union[str, None] = None):
    operator = urllib.parse.unquote(operator)
    new_condition = Condition(len(query_builder.condition_list) + 1, query_builder.db_table,
                                field, operator, value, "" if logic_operator is None else logic_operator)
    query_builder.add_condition(new_condition)
    return [
        {
            "id": condition.id,
            "field": condition.attribute,
            "operator": condition.operator,
            "value": condition.value,
            "logic_operator": condition.logic_operator
        }for condition in query_builder.condition_list if condition.id == new_condition.id
    ]


@db_router.put("database/table/condition")
def put_condition(id: int, param: dict = Body()):
    condition = next(cond for cond in query_builder.condition_list if cond.id == id)
    index = query_builder.condition_list.index(condition)
    for k, v in json.loads(param):
        if k == "field":
            query_builder.condition_list[index].attribute = v
        if k == "operator":
            query_builder.condition_list[index].operator = v
        if k == "value":
            query_builder.condition_list[index].value = v
        if k == "logic_operator":
            query_builder.condition_list[index].logic_operator = v

    return [
        {
            "id": condition.id,
            "field": condition.attribute,
            "operator": condition.operator,
            "value": condition.value,
            "logic_operator": condition.logic_operator
        }for condition in query_builder.condition_list if condition.id == id
    ]


@db_router.delete("/database/table/condition")
def delete_condition(id: int):
    condition = next(cond for cond in query_builder.condition_list if cond.id == id)
    query_builder.delete_condition(condition)


@db_router.get("/database/table/data")
def get_table_data():
    return jsonable_encoder(query_builder.execute_select_query())


@db_router.delete("/database/table")
def delete_table(name: str, response: Response):
    table = next(table for table in db_model.table_list if table.name == name)
    db_model.table_list = [table for table in db_model.table_list if table.name != name]
    status = table.drop_table()
    if status == 0:
        response.status_code = 200
        return {"status": "success"}
    else:
        response.status_code = 400
        return {"status": "error"}


@db_router.get("/database/current-table")
def get_current_table():
    current_tabel = query_builder.db_table
    if isinstance(current_tabel, DbTable):
        return jsonable_encoder(current_tabel.name)
    else:
        return None


@db_router.put("/database/current-table")
def put_current_table(name: str, response: Response):
    table = next(table for table in db_model.table_list if table.name == name)
    query_builder.set_table(table)
    response.status_code = 200
    return {"status": "success"}
