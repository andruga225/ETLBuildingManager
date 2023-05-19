import cl from './ChangeETL.module.css'
import {useState} from "react";
import {toast} from "react-toastify";
import Service from "../../API/Service";

const ChangeETL = ({etl, sentRequest}) => {
    const [name, setName] = useState(etl.name)


    function changeEtlName(value)
    {
        setName(value);
    }

    async function putEtl() {
        toast.dismiss()

        if (name === "") {
            toast.error("Название ETL не должно быть пустым", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            })
        } else {
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
                await Service.putETL(etl.id, name)

                toast.update(popUp, {render: "Успешно", type: "success", isLoading: false, autoClose: 3000})

                sentRequest()
            }catch{
                toast.update(popUp, {render: "Не успешно", type: "error", isLoading: false, autoClose: 3000})
            }
        }
    }


    return (
        <div className={cl.generalDiv}>
            <div className={cl.fieldsDiv}>
                <label className={cl.label}>Название ETL</label>
                <input className={cl.input} onChange={e => changeEtlName(e.target.value)} value={name}/>
            </div>
            <button className={cl.btn} onClick={putEtl}>Сохранить</button>
        </div>
    )
}

export default ChangeETL;