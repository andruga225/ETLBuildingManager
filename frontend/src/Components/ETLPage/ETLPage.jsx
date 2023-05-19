import {useEffect, useState} from "react";
import Service from "../../API/Service";
import ETLList from "../ETLList/ETLList";
import cl from './ETLPage.module.css'
import ModalWindow from "../ModalWindow/ModalWindow";
import ETLForm from "../ETLForm/ETLForm";
import {ToastContainer} from "react-toastify";
import ChangeETL from "../ChangeETL/ChangeETL";

const ETLPage = () => {
    const [etls, setEtls] = useState([])
    const [addETLModal, setAddETLModal] = useState(false)

    async function fetchEtl() {
        const response = Service.getEtlList()
        setEtls((await response).data)
    }

    useEffect(() => {
        fetchEtl();

    }, [])

    function addNewEtl() {
        setAddETLModal(true)
    }

    async function newEtl() {
        setAddETLModal(false)
        setEtls([])
        await fetchEtl()
    }

    function updateList()
    {
        setEtls([])
        fetchEtl()
    }

    return (
        <div>
            <button className={cl.btn} onClick={addNewEtl}>Добавить ETL</button>
            <ETLList etls={etls} sentRequest={updateList}></ETLList>
            <ModalWindow active={addETLModal} setActive={setAddETLModal}>
                <ETLForm sentRequest={newEtl}></ETLForm>
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

export default ETLPage;