import json
import xmltodict
import requests
import pandas
from urllib.parse import urlparse, parse_qs

from app.Model import TableNormalizer


class ETL:
    id = 0
    name = ""
    db_name = ""
    table_name = ""
    source_type = None
    source_attr_list = []  # string array
    table_attr_list = []  # string array
    url = ""
    request_param_list = []

    def __init__(self, id, name, db_name, table_name, source_type, source_attr_list, table_attr_list, url,
                 param_list=[]):
        self.id = id
        self.name = name
        self.db_name = db_name
        self.table_name = table_name
        self.source_type = source_type
        self.source_attr_list = source_attr_list
        self.table_attr_list = table_attr_list
        self.url = url
        self.request_param_list = param_list

    def __eq__(self, other):
        return self.id == other.id

    @staticmethod
    def execute_url_for_schema(url):
        response = requests.get(f"{url}")
        if response.status_code == 200:
            response = response.text
            if response[0] == '<':
                response = xmltodict.parse(response)
                return ETL.get_keys(response)
            elif response[0] == '{' or response[0] == '[':
                response = json.loads(response)
                return ETL.get_keys(response)

    @staticmethod
    def __generic_items__(dict_or_list):
        if type(dict_or_list) is dict:
            return dict_or_list.items()
        if type(dict_or_list) is list:
            return enumerate(dict_or_list)

    @staticmethod
    def get_keys(dictionary):
        result = []
        for key, value in ETL.__generic_items__(dictionary):
            if type(value) is dict:
                new_keys = ETL.get_keys(value)
                if not isinstance(key, int):
                    for inner_key in new_keys:
                        if f'{key}/{inner_key}' not in result:
                            result.append(f'{key}/{inner_key}')
                else:
                    for inner_key in new_keys:
                        if f'{inner_key}' not in result:
                            result.append(f'{inner_key}')
            elif type(value) is list:
                new_keys = ETL.get_keys(value)
                for inner_key in new_keys:
                    if f'{key}/{inner_key}' not in result:
                        result.append(f'{key}/{inner_key}')
            else:
                result.append(str(key))
        return result

    def get_url_params(self):
        result = urlparse(self.url)
        self.url = f"{result.scheme}://{result.netloc}{result.path}"
        self.request_param_list = list(parse_qs(result.query).keys())

    def execute_url_etl(self, query_builder, etl_params={}, url_param_list=[]):
        param_str = self.__make_param_string__(url_param_list)
        response = requests.get(f"{self.url}?{param_str}")
        print(response.url)
        if response.status_code == 200:
            response = response.text
            if response[0] == '<':
                response = xmltodict.parse(response)
            elif response[0] == '{' or response[0] == '[':
                response = json.loads(response)

            data = pandas.json_normalize(response, sep='/')
            data = TableNormalizer.normalize(data)

            data = data[self.source_attr_list]
            if data.index.shape[0] != 0:
                query_builder.execute_insert_query(self.table_attr_list, data.loc[0, :].values.flatten().tolist())
                last_add = [data.loc[0, :].values.flatten().tolist()]
                for i in data.index[1:]:
                    if data.loc[i, :].values.flatten().tolist() in last_add:
                        continue
                    else:
                        query_builder.execute_insert_query(self.table_attr_list, data.loc[i, :].values.flatten().tolist())
                        last_add = last_add + [data.loc[i, :].values.flatten().tolist()]

    def __make_param_string__(self, url_param_list):
        result_list = []
        for i in range(len(self.request_param_list)):
            result_list.append(self.request_param_list[i])
            result_list.append(url_param_list[i])
        result_dict = {result_list[i]: result_list[i + 1] for i in range(0, len(result_list), 2)}
        return '&'.join([f"{k}={v}" for k, v in result_dict.items()])
