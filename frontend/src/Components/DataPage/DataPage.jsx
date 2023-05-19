import cl from './DataPage.module.css';
import {DataGrid} from "devextreme-react";
import {
    Column,
    Editing,
    Lookup,
    Scrolling,
    Toolbar,
    Item,
    RequiredRule,
    FilterPanel,
    SearchPanel, FilterBuilder, ColumnChooser
} from "devextreme-react/data-grid";
import {useEffect, useState} from "react";
import Service from "../../API/Service";

const DataPage = () => {
    const [tables, setTables] = useState([])
    const [databases, setDatabases] = useState([])
    const [currentDatabase, setCurrentDatabase] = useState('')
    const [currentTable, setCurrentTable] = useState(fetchCurrentTable)
    const [conditions, setConditions] = useState([])
    const [tableFields, setTableFields] = useState([])
    const [tableFieldTypes, setTableFieldTypes] = useState([])
    const [data, setData] = useState([])
    const [isNeedUpdate, setIsNeedUpdate] = useState(false)
    const mappedDateTypes = {
        "int": "number",
        "float": "number",
        "text": "string",
        "date": "date",
        "bool": "boolean"
    }


    async function fetchTable() {
        const response = Service.getTableList()
        const res = (await response).data
        setTables(res)
        if(res.length !== 0 && currentTable === '')
        {
            setCurrentTable(res[0].name)
            await Service.putCurrentTable(res[0].name)
            fetchTableFields(res[0].name)
            fetchData()
        }

    }

    async function fetchDatabase() {
        const response = Service.getDatabaseList()
        setDatabases((await response).data)
    }

    async function fetchCurrentDatabase() {
        const response = Service.getCurrentDatabase()
        setCurrentDatabase((await response).data)
    }

    async function fetchCurrentTable() {
        const response = Service.getCurrentTable()
        const curTable = (await response).data
        if(curTable != null) {
            setCurrentTable(curTable)
            fetchData()
        }
    }

    async function fetchTableFields(table) {
        const response = Service.getTableFields(table)
        const res = (await response).data
        setTableFields(res.map(field => field.name))
        setTableFieldTypes(res.map(field => field.type))
    }

    async function fetchData()
    {
        const response = Service.getTableData()
        setData((await response).data)
    }

    async function fetchAll()
    {
        await fetchDatabase()
        await fetchCurrentDatabase()
        await fetchTable()
    }

    useEffect(   () => {
        fetchAll()
    }, [])

    useEffect(() => {
        fetchTable()
    },[isNeedUpdate])


    async function changeCurrentTable(table) {
        setCurrentTable(table.target.value)
        await Service.putCurrentTable(table.target.value)
        fetchTableFields(table.target.value)
        fetchData()
    }

    async function changeCurrentDatabase(database) {
        setCurrentTable('')
        setCurrentDatabase(database.target.value)
        await Service.putCurrentDatabase(database.target.value)
        setIsNeedUpdate((prev) => !prev)
    }

    function updateRow(e) {
        const data = {
            "old_values": e.oldData,
            "new_values": e.newData
        }
        Service.putDataToTable(data)
    }

    function deleteRow(e) {
        Service.deleteDataFromTable(e.data)
    }


    return (
        <div>
            <div className={cl.dbButtonsDiv}>
                <select className={cl.slt}
                        value={currentDatabase}
                        onChange={changeCurrentDatabase}>
                    {databases.map(database => <option>{database}</option>)}
                </select>
                <select className={cl.slt}
                        value={currentTable}
                        onChange={changeCurrentTable}>
                    {tables.map(table => <option>{table.name}</option>)}
                </select>
            </div>
            <div className={cl.dataDiv}>
                {/*Data*/}
                <DataGrid dataSource={data} className={cl.dataGrid}
                          allowColumnResizing={true}
                          columnAutoWidth={true}
                          wordWrapEnabled={true}
                          onRowUpdating={updateRow}
                          onRowRemoving={deleteRow}>
                    {tableFields.map((field, i) => <Column dataField={field}
                                                           key={field}
                                                           dataType={mappedDateTypes[tableFieldTypes[i]]}/>)}
                    <SearchPanel visible={true}/>
                    <FilterPanel visible={true}/>
                    <ColumnChooser enabled={true} mode="select"/>
                    <Scrolling columnRenderingMode={"virtual"}
                               mode={"infinity"}></Scrolling>
                    <Editing
                        mode="row"
                        allowUpdating={true}
                        allowDeleting={true}
                        allowAdding={false} />
                </DataGrid>
            </div>
        </div>
    )
}

export default DataPage;