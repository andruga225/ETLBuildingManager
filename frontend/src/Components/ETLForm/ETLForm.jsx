import cl from './ETLForm.module.css'
import MapData from "../MapDataComponent/MapData";
import {useEffect, useState} from "react";
import Service from "../../API/Service";
import * as yup from 'yup'
import {toast} from "react-toastify"

const ETLForm = ({sentRequest}) => {
    const [etlName, setEtlName] = useState('')
    const [sourceType, setSourceType] = useState("ethernet")
    const [tables, setTables] = useState([])
    const [currentTable, setCurrentTable] = useState('')
    const [databases, setDatabases] = useState([])
    const [currentDatabase, setCurrentDatabase] = useState('')
    const [sourceSchema, setSourceSchema] = useState([])
    const [url, setUrl] = useState("")
    const [tableFields, setTableFields] = useState([])
    const [mappedTableFields, setMappedTableFields] = useState([])
    const [mappedSourceFields, setMappedSourceFields] = useState([])
    const [schema, setSchema] = useState()

    yup.addMethod(yup.array, 'unique', function(message, mapper = a => a) {
        return this.test('unique', message, function(list) {
            return list.length  === new Set(list.map(mapper)).size;
        });
    });

    useEffect(() => {
        if(sourceType === "ethernet")
            setSchema(yup.object().shape({
                name: yup.string().required("Укажите название для ETL"),
                db_name: yup.string(),
                table_name: yup.string(),
                source_type: yup.string(),
                source_attr_list: yup.array(yup.string())
                    .min(1, "Добавьте хотя бы одну связь источника с выбранной таблицей"),
                table_attr_list: yup.array(yup.string())
                    .unique("Поля таблицы в связях должны быть уникальны")
                    .min(1, "Добавьте хотя бы одну связь источника с выбранной таблицей"),
                url: yup.string().required("Укажите адрес источника")
            }))
        else
            setSchema(yup.object().shape({
                name: yup.string().required("Укажите название для ETL"),
                db_name: yup.string(),
                table_name: yup.string(),
                source_type: yup.string(),
                source_attr_list: yup.array(yup.string())
                    .min(1, "Добавьте хотя бы одну связь источника с выбранной таблицей"),
                table_attr_list: yup.array(yup.string())
                    .unique("Поля таблицы в связях должны быть уникальны")
                    .min(1, "Добавьте хотя бы одну связь источника с выбранной таблицей"),
                file_name: yup.string().required("Загрузите файл")
            }))
    }, [sourceType])

    async function fetchTables() {
        console.log("fetchTables")
        const response = Service.getTableList()
        const res = (await response).data
        setTables(res)
        if(res.length > 0)
            setCurrentTable(res[0].name)
    }

    async function fetchDatabase() {
        const response = Service.getDatabaseList()
        setDatabases((await response).data)
    }

    async function fetchCurrentDatabase() {
        const response = Service.getCurrentDatabase()
        setCurrentDatabase((await response).data)
    }

    async function fetchTableFields() {
        if(currentTable !== '') {
            const response = Service.getTableFields(currentTable)
            setTableFields([...(await response).data])
        }
    }

    function changeSourceType(value) {
        setSourceType(value)
    }

    function changeUrl(value) {
        setUrl(value)
    }

    async function getSourceSchema() {
        if (sourceType === "ethernet") {
            const response = Service.getSourceSchema(url)
            setSourceSchema((await response).data)
        }

        await fetchDatabase();
        await fetchCurrentDatabase();
        await fetchTables();
    }

    async function changeCurrentDatabase(chosenDatabase) {
        setCurrentDatabase(chosenDatabase);
        await Service.putCurrentDatabase(chosenDatabase);
        setTables([])
        setTableFields([])
        setMappedTableFields([])
        setMappedSourceFields([])
        await fetchTables();
    }

    async function changeCurrentTable(chosenTable) {
        console.log("test")
        setCurrentTable(chosenTable)
        setMappedTableFields([])
        setMappedSourceFields([])
    }

    function changeEtlName(etlName) {
        setEtlName(etlName)
    }

    useEffect(() => {
        fetchTableFields()
    }, [currentTable])

    function addMapFields() {
        if(tableFields.length === 0)
        {
            toast.error("У таблицы не найдены поля", {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            return;
        }

        if(sourceSchema === null || sourceSchema.length === 0)
        {
            toast.error("У источника не найдены поля", {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            })
            return;
        }

        const maxId = Math.max(...mappedSourceFields.map(field => field.id))
        const obj = {id: maxId === -Infinity ? 0 : maxId + 1, value: sourceSchema[0]}
        setMappedSourceFields([...mappedSourceFields, obj])
        setMappedTableFields([...mappedTableFields, tableFields[0].name])

    }

    async function postETL() {
        toast.dismiss()

        const data = {
            name: etlName,
            db_name: currentDatabase,
            table_name: currentTable,
            source_type: sourceType,
            source_attr_list: [...mappedSourceFields.map(field => field.value)],
            table_attr_list: [...mappedTableFields],
        }

        sourceType === "ethernet" ? data["url"] = url : data["file_name"] = "test"

        try {
            schema.validateSync(data)

            const popUp = toast.loading("Загрузка", {
                position: "top-center",
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            await Service.postETL(data)

            toast.update(popUp, {render: "Успешно", type: "success", isLoading: false, autoClose: 3000})

            setEtlName("")
            setTables([])
            setTableFields([])
            setMappedSourceFields([])
            setMappedTableFields([])
            setDatabases([])
            setSourceSchema([])
            setUrl("")
            setCurrentTable("")
            setCurrentDatabase("")

            sentRequest()

        } catch (err) {
            err.errors.forEach(e => {
                toast.error(e, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored"
                })
            })
        }
    }


    return (
        <div className={cl.generalDiv}>
            <div>
                <form className={cl.form}>
                    <div className={cl.nameTableDiv}>
                        <label className={cl.label}>Название ETL</label>
                        <input className={cl.input} value={etlName} onChange={e => changeEtlName(e.target.value)}/>
                        <div className={cl.radioBtnDiv}>
                            <div>
                                <input className={cl.rbt}
                                       type={"radio"}
                                       name={"sourceType"}
                                       value={"ethernet"}
                                       checked={sourceType === "ethernet"}
                                       onChange={e => changeSourceType(e.target.value)}/>
                                <label className={cl.label}>Интернет-источник</label>
                            </div>
                            <div>
                                <input className={cl.rbt}
                                       type={"radio"}
                                       name={"sourceType"}
                                       value={"local"}
                                       checked={sourceType === "local"}
                                       onChange={e => changeSourceType(e.target.value)}/>
                                <label className={cl.label}>Локальный источник</label>
                            </div>
                        </div>
                        {sourceType === "ethernet" ?
                            <>
                                <label className={cl.label}>URL</label>
                                <input className={cl.input} value={url} onChange={e => changeUrl(e.target.value)}/>
                            </>
                            : <>
                                <label className={cl.label}>Файл</label>
                                <input className={cl.input} type="file"/>
                            </>
                            }
                    </div>
                </form>
            </div>
            <div className={cl.btnDiv}>
                <button className={cl.btn} onClick={getSourceSchema}>Получить данные</button>
            </div>
            <div className={cl.chooseTableDiv} >
                <div className={cl.tableDiv}>
                    <label className={cl.label}>База данных</label>
                    <select className={cl.slt}
                            value={currentDatabase} onChange={e => changeCurrentDatabase(e.target.value)}>
                        {databases.map(database => <option key={database.name}>{database}</option>)}
                    </select>
                </div>
                <div className={cl.tableDiv}>
                    <label className={cl.label}>Таблица</label>
                    <select className={cl.slt} onChange={e => changeCurrentTable(e.target.value)} defaultValue={''}>
                        {tables.map(table => <option key={table.name}>{table.name}</option>)}
                    </select>
                </div>
            </div>
            <div className={cl.fieldsDiv}>
                {mappedSourceFields.map((field, i) =>
                    <MapData sourceSchema={sourceSchema}
                             tableSchema={tableFields}
                             mappedSourceFields={mappedSourceFields}
                             setMappedSourceFields={setMappedSourceFields}
                             mappedTableFields={mappedTableFields}
                             setMappedTableFields={setMappedTableFields}
                             index={i}
                             key={field.id}/>)}
            </div>
            <div className={cl.btnDiv}>
                <button className={cl.btn} onClick={addMapFields}>Добавить связь</button>
            </div>
            <div className={cl.btnDiv}>
                <button className={cl.btn} onClick={postETL}>Сохранить</button>
            </div>
        </div>
    )
}

export default ETLForm;