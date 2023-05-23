import ChooseData from "../ChooseDataComponent/ChooseData";
import {useEffect, useState} from "react";
import cl from './TableForm.module.css'
import * as yup from 'yup'
import {toast} from "react-toastify"
import Service from "../../API/Service";

const TableForm = ({existingTables, sentRequest}) => {
    const allFieldTypes = ['Целое число', 'Вещественное число', 'Текст', 'Дата и время', 'Логическое значение']
    const encodedFieldTypes = ['int', 'float', 'text', 'date', 'boolean']

    const [tableName, setTableName] = useState('')
    const [fieldList, setFieldList] = useState([{id: 0, value: ''}])
    const [fieldTypeList, setFieldTypeList] = useState(['Целое число'])
    const [schema, setSchema] = useState()

    yup.addMethod(yup.array, 'unique', function(message, mapper = a => a) {
        return this.test('unique', message, function(list) {
            return list.length  === new Set(list.map(mapper)).size;
        });
    });

    useEffect(() => {
        setSchema(yup.object().shape({
            name: yup.string()
                        .required("Введите название таблицы")
                        .matches(/^[a-z|_][a-z|_|0-9]{0,62}$/, "Неверное имя для таблицы")
                        .notOneOf([...existingTables.map(table => table.name)], "Таблица с таким именем уже существует"),
            attributes: yup.array(yup.string()
                            .matches(/^[a-z|_][a-z|_|0-9]{0,62}$/, "Неверное имя поля для таблицы"))
                    .unique("Имена полей должны быть уникальны")
                    .min(1, "Укажите поля таблицы"),
            types: yup.array(yup.string()).min(1)
        }))
    }, [])

    function addNewField(){
        const maxId = Math.max(...fieldList.map(field => field.id))
        const obj = {id: maxId === -Infinity ? 0 : maxId + 1, value: ''}
        setFieldList([...fieldList, obj])
        setFieldTypeList([...fieldTypeList, 'Целое число'])
    }

    function changeTableName(value)
    {
        setTableName(value)
    }

    async function postTable() {
        toast.dismiss()
        const data = {
            name: tableName,
            attributes: [...fieldList.map(field => field.value)],
            types: [...fieldTypeList.map((field) => encodedFieldTypes[allFieldTypes.findIndex(type => type == field)])]
        }
        console.log(data)
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

            await Service.postTable(data)

            toast.update(popUp, {render: "Успешно", type: "success", isLoading: false, autoClose: 3000})
            setTableName("")
            const maxId = Math.max(...fieldList.map(field => field.id))
            setFieldList([{id: maxId + 1, value: ''}])
            setFieldTypeList(['Целое число'])
            sentRequest()

        } catch (err) {
            console.log(err.errors)
            err.errors.reverse().forEach(e => {
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
                        <label className={cl.label}>Название таблицы</label>
                        <input className={cl.input} value={tableName} onChange={e => changeTableName(e.target.value)}/>
                    </div>
                </form>
            </div>
            <div className={cl.fieldsDiv}>
                {fieldList.map((field, i) => (
                    <ChooseData optionList={allFieldTypes}
                                fields={fieldList}
                                fieldTypes={fieldTypeList}
                                setFieldTypeList={setFieldTypeList}
                                setFieldList={setFieldList}
                                index={i}
                                key={field.id}
                                ></ChooseData>
                ))}
            </div>
            <div className={cl.submitDiv} onClick={addNewField}>
                <button className={cl.btn}>Добавить поле</button>
            </div>
            <div className={cl.submitDiv}>
                <input className={cl.btn} type={"submit"} value={"Создать таблицу"} onClick={postTable}/>
            </div>
        </div>
    )
}

export default TableForm;