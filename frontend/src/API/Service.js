import axios from "axios"
import qs from "qs";

export default class Service {

    static async getEtlList() {
        const response = axios.get('http://127.0.0.1:5000/api/ETLs');
        return response;
    }

    static async getTableList() {
        const response = axios.get('http://127.0.0.1:5000/api/database/tables');
        return response;
    }

    static async getDatabaseList() {
        const response = axios.get('http://127.0.0.1:5000/api/databases');
        return response;
    }

    static async getCurrentDatabase() {
        const response = axios.get('http://127.0.0.1:5000/api/database/current-database');
        return response;
    }

    static async putCurrentDatabase(databaseName) {
        const response = axios.put('http://127.0.0.1:5000/api/database?name=' + databaseName)
        return response
    }

    static async postDatabase(databaseName) {
        const response = axios.post('http://127.0.0.1:5000/api/database?name=' + databaseName)
        return response
    }

    static async postTable(data) {
        const response = axios.post('http://127.0.0.1:5000/api/database/table?'
            + qs.stringify(data, {indices: false})
        )

        return response
    }

    static async getSourceSchema(url) {
        const response = axios.get('http://127.0.0.1:5000/api/ETL?url=' + encodeURIComponent(url))

        return response
    }

    static async getTableFields(tableName) {
        const response = axios.get('http://127.0.0.1:5000/api/database/table/' + tableName + '/fields')
        return response
    }

    static async postETL(data) {
        const response = axios.post('http://127.0.0.1:5000/api/ETL?'
            + qs.stringify(data, {indices: false})
        )

        return response
    }

    static async putETL(id, etlName) {
        const response = axios.put('http://127.0.0.1:5000/api/ETL?id=' + id + '&name=' + etlName);
        return response
    }

    static async deleteETL(id) {
        const response = axios.delete('http://127.0.0.1:5000/api/ETL?id=' + id)
        return response
    }

    static async deleteTable(tableName) {
        const response = axios.delete('http://127.0.0.1:5000/api/database/table?name=' + tableName)
        return response
    }

    static async executeEtl(id, params) {
        const response = axios.post('http://127.0.0.1:5000/api/ETL/execute?id=' + id, params)

        return response
    }

    static async getUrlParams(id) {
        const response = axios.get('http://127.0.0.1:5000/api/ETL/params?id=' + id)
        return response
    }

    static async setTable(name) {
        const response = axios.put('http://127.0.0.1:5000/api/database/set-table/' + name)
        return response
    }

    static async getCurrentTable() {
        const response = axios.get('http://127.0.0.1:5000/api/database/current-table')
        return response
    }

    static async putCurrentTable(name) {
        const response = axios.put('http://127.0.0.1:5000/api/database/current-table?name=' + name)
        return response
    }

    static async getTableData() {
        const response = axios.get('http://127.0.0.1:5000/api/database/table/data')
        return response
    }

    static async putDataToTable(data) {
        const response = axios.put('http://127.0.0.1:5000/api/database/table/record', data)
        return response
    }

    static async deleteDataFromTable(data) {
        const response = axios.delete('http://127.0.0.1:5000/api/database/table/record', {data: data})
        return response
    }
}