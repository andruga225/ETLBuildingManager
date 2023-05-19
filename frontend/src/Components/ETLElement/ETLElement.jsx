import cl from './ETLElement.module.css';
import ModalWindow from "../ModalWindow/ModalWindow";
import ChangeETL from "../ChangeETL/ChangeETL";
import {useState} from "react";
import {toast} from "react-toastify";
import Service from "../../API/Service";
import ETLExecuteForm from "../ETLExecuteForm/ETLExecuteForm";

const ETLElement = ({etl, request}) => {
    const mappedData = []
    const [changeEtlModal, setChangeETLModal] = useState(false)
    const [executeEtlModal, setExecuteEtlModal] = useState(false)


    for (let i in etl.source_attr_list)
    {
        mappedData.push(<li className={cl.li}>{etl.source_attr_list[i]} - {etl.table_attr_list[i]}</li>)
    }

    function changeEtl()
    {
        setChangeETLModal(true)
    }

    function executeEtl()
    {
        setExecuteEtlModal(true)
    }

    function sentRequest()
    {
        request()
    }

    async function deleteEtl() {
        toast.dismiss()

        const popUp = toast.loading("Загрузка", {
            position: "top-center",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

        try {
            await Service.deleteETL(etl.id)

            toast.update(popUp, {render: "Успешно", type: "success", isLoading: false, autoClose: 3000})

            request()
        } catch {
            toast.update(popUp, {render: "Не успешно", type: "error", isLoading: false, autoClose: 3000})
        }
    }

    return (
        <div className={cl.generalDiv}>
            <div className={cl.etlDataDiv}>
                <div className={cl.etlInfDiv}>
                    <h1 className={cl.h1}>{etl.name}</h1>
                    <label>{etl.url}</label>
                    <label>{etl.table_name}</label>
                </div>
                <div className={cl.etlMapData}>
                    <ul className={cl.ul}>
                        {mappedData}
                    </ul>
                </div>
            </div>
            <div className={cl.btnDiv}>
                <button className={cl.btn} onClick={executeEtl}>Запустить</button>
                <button className={cl.btn} onClick={changeEtl}>Изменить</button>
                <button className={cl.btn} onClick={deleteEtl}>Удалить</button>
            </div>
            <ModalWindow active={changeEtlModal} setActive={setChangeETLModal}>
                <ChangeETL etl={etl} sentRequest={sentRequest}></ChangeETL>
            </ModalWindow>
            <ModalWindow active={executeEtlModal} setActive={setExecuteEtlModal}>
                <ETLExecuteForm etl={etl} sentRequest={setExecuteEtlModal}></ETLExecuteForm>
            </ModalWindow>
        </div>
    );
}

export default ETLElement;