import {useForm} from 'react-hook-form'
import cl from './DatabaseForm.module.css'
import * as yup from 'yup'
import {useEffect, useState} from "react"
import {toast, ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Service from "../../API/Service";

const DatabaseForm = ({sentRequest}) =>
{
    const {register, handleSubmit, reset} = useForm()

    const [schema, setSchema] = useState()

    useEffect(() => {
        setSchema(yup.object().shape({
            name: yup.string()
                     .required("Введите имя базы данных")
                     .matches(/^[0-9a-zA-Z$_]+$/, "Неверное наименование базы данных")
                     }))
    }, [])

    async function addDatabase(data) {
        toast.dismiss()

        try {
            schema.validateSync(data, {abortEarly: true})

            const popUp = toast.loading("Загрузка", {
                                                position: "top-center",
                                                hideProgressBar: true,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                                theme: "colored",
                                            });
            await Service.postDatabase(data.name)

            toast.update(popUp, {render: "Успешно", type: "success", isLoading: false, autoClose: 5000})

            sentRequest()
            reset()

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
            <form className={cl.form}  onSubmit={handleSubmit(addDatabase)}>
                <div className={cl.fieldsDiv}>
                    <label className={cl.label}>Name</label>
                    <input className={cl.input}
                           placeholder={"Name"}
                           {...register("name")}/>
                </div>
                <input className={cl.btn} type={"submit"} value={"Создать"}/>
            </form>
        </div>
    )
}

export default DatabaseForm;