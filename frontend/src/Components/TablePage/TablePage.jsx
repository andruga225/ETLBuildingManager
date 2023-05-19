import {useEffect, useState} from "react";
import Service from "../../API/Service";
import TableList from "../TableList/TableList";
import cl from './TablePage.module.css'
import ModalWindow from "../ModalWindow/ModalWindow";
import DatabaseForm from "../DatabaseForm/DatabaseForm";
import TableForm from "../TableForm/TableForm";
import {ToastContainer} from "react-toastify";

const TablePage = () => {
    const [tables, setTables] = useState([])
    const [databases, setDatabases] = useState([])
    const [currentDatabase, setCurrentDatabase] = useState('')
    const [addDatabaseModal, setAddDatabaseModal] = useState(false)
    const [addTableModal, setAddTableModal] = useState(false)

    async function fetchTable() {
        const response = Service.getTableList()
        setTables((await response).data)
    }

    async function fetchDatabase() {
        const response = Service.getDatabaseList()
        setDatabases((await response).data)
    }

    async function fetchCurrentDatabase() {
        const response = Service.getCurrentDatabase()
        setCurrentDatabase((await response).data)
    }

    const changeCurrentDatabase = async (chosenDatabase) => {
        setCurrentDatabase(chosenDatabase);
        await Service.putCurrentDatabase(chosenDatabase);
        setTables([])
        fetchTable();
    }

    async function newDatabase() {
        setAddDatabaseModal(false)
        setDatabases([])
        setTables([])
        setCurrentDatabase('')
        await fetchDatabase()
        await fetchCurrentDatabase()
        await fetchTable()
    }

    async function newTable() {
        setAddTableModal(false)
        setTables([])
        await fetchTable()
    }

    useEffect(() => {
        fetchTable();
        fetchDatabase();
        fetchCurrentDatabase();
    }, [])

    function updateTableList()
    {
        setTables([])
        fetchTable()
    }

    return (
        <div>
            <div className={cl.buttonsDiv}>
                <div>
                    <button className={cl.btn}
                            onClick={() => setAddTableModal(true)}>
                        Добавить таблицу
                    </button>
                </div>
                <div className={cl.dbButtonsDiv}>
                    <button className={cl.btn}
                            onClick={() => setAddDatabaseModal(true)}>
                        Создать базу данных
                    </button>
                    <select className={cl.slt}
                            value={currentDatabase}
                            onChange={async (e) => changeCurrentDatabase(e.target.value)}>
                        {databases.map((database) =>
                            <option key={database}>{database}</option>
                        )}
                    </select>
                </div>
            </div>
            <TableList tables={tables} request={updateTableList}></TableList>
            <ModalWindow active={addDatabaseModal}
                         setActive={setAddDatabaseModal}>
                <DatabaseForm sentRequest={newDatabase}></DatabaseForm>
            </ModalWindow>
            <ModalWindow active={addTableModal}
                         setActive={setAddTableModal}>
                <TableForm existingTables={tables} sentRequest={newTable}></TableForm>
            </ModalWindow>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="colored"
            />
        </div>
    )
}

export default TablePage;
