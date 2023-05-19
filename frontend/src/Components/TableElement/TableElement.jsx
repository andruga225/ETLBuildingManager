import cl from './TableElement.module.css'
import {toast} from "react-toastify";
import Service from "../../API/Service";
import {redirect, useNavigate} from "react-router-dom";

const TableElement = ({table, sentRequest}) => {
    const navigate = useNavigate()


    async function deleteTable() {
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
            await Service.deleteTable(table.name)

            toast.update(popUp, {render: "Успешно", type: "success", isLoading: false, autoClose: 3000})

            sentRequest()
        } catch {
            toast.update(popUp, {render: "Не успешно", type: "error", isLoading: false, autoClose: 3000})
        }
    }

    async function viewData(){
        await Service.putCurrentTable(table.name)
        navigate("/data")
    }

    return (
        <div className={cl.generalDiv}>
            <div className={cl.tableDataDiv}>
                <div className={cl.tableInfDiv}>
                    <h1 className={cl.h1}>{table.name}</h1>
                </div>
                <div className={cl.tableAttrData}>
                    <ul className={cl.ul}>
                        {table.attributes.map((attr) =>
                            <li className={cl.li} key={attr.name}>{attr.name}: {attr.type}</li>
                        )}
                    </ul>
                </div>
            </div>
            <div className={cl.btnDiv}>
                <button className={cl.btn} onClick={viewData}>Просмотреть данные</button>
                <button className={cl.btn} onClick={deleteTable}>Удалить</button>
            </div>
        </div>


    )
}

export default TableElement;
