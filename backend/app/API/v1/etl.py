from typing import Union

from fastapi.encoders import jsonable_encoder
from fastapi import APIRouter, Query
from app.Model import *
from app.Model.ETL import ETL
from app.Model.Enums import Source
from starlette.responses import Response

etl_router = APIRouter()


@etl_router.get("/ETLs")
def get_etl_list():
    return jsonable_encoder(etl_building_manager.etl_list)


@etl_router.get("/ETL")
def get_source_schema(url: str):
    return ETL.execute_url_for_schema(url)


@etl_router.post("/ETL")
def post_etl(name: str, db_name: str, table_name: str, source_type: str,
             source_attr_list: list[str] = Query(), table_attr_list: list[str] = Query(), url: Union[str, None] = None):

    new_etl = ETL(max(etl.id for etl in etl_building_manager.etl_list) + 1, name, db_name, table_name,
                  Source.ethernet if source_type == 'ethernet' else Source.local,
                  source_attr_list, table_attr_list, url if isinstance(url, str) else None)
    etl_building_manager.add_etl(new_etl)
    etl_building_manager.serialize()
    return jsonable_encoder(new_etl)


@etl_router.put("/ETL")
def put_etl(id: int, name: str):
    for etl in etl_building_manager.etl_list:
        if etl.id == id:
            etl.name = name
            etl_building_manager.serialize()
            return etl


@etl_router.post("/ETL/execute")
def execute_etl(response: Response, id: int, url_param_list: Union[list[str], str] = None):
    etl = next(i for i in etl_building_manager.etl_list if i.id == id)

    etl.execute_url_etl(query_builder, {}, url_param_list)
    response.status_code = 200
    return {"status": "success"}
    # except:
    #     response.status_code = 400
    #     return {"status": "error"}



@etl_router.delete("/ETL")
def delete_etl(id: int):
    etl_building_manager.etl_list = [etl for etl in etl_building_manager.etl_list if etl.id != id]
    etl_building_manager.serialize()
    return {"status": "success"}


@etl_router.get("/ETL/params")
def get_etl_params(id: int):
    etl = next(i for i in etl_building_manager.etl_list if i.id == id)
    return etl.request_param_list
