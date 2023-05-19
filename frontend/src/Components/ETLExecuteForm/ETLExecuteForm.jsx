import cl from './ETLExecuteForm.module.css'
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import Service from "../../API/Service";
import {DataGrid} from "devextreme-react";
import {Editing, Scrolling} from "devextreme-react/data-grid";
import 'devextreme/dist/css/dx.light.css'


const ETLExecuteForm = ({etl, sentRequest}) => {
    const [parameters, setParameters] = useState([])
    const [clearData, setClearData] = useState(false)
    const [allowNull, setAllowNull] = useState(false)
    const [checkDuplicate, setCheckDuplicate] = useState(false)
    const [disableButton, setDisableButton] = useState(false)
    const [urlParams, setUrlParams] = useState([])

    async function fetchUrlParams()
    {
        const response = Service.getUrlParams(etl.id)
        setUrlParams((await response).data)
    }

    useEffect(() =>
    {
        fetchUrlParams()
    },[])

    function changeClearData()
    {
        setClearData(!clearData)
    }

    function changeAllowNull()
    {
        setAllowNull(!allowNull)
    }

    function changeCheckDuplicate()
    {
        setCheckDuplicate(!checkDuplicate)
    }

    async function startEtl() {
        toast.dismiss()
        setDisableButton(true)

        const popUp = toast.loading("Загрузка", {
            position: "top-center",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

        await Service.putCurrentDatabase(etl.db_name)
        await Service.setTable(etl.table_name)

        do {
            try {
                if(parameters.length === 0)
                {
                    await Service.executeEtl(etl.id, [])
                }else{
                    const obj = parameters[0]
                    delete obj["__KEY__"]
                    console.log(Object.values(obj))

                    await Service.executeEtl(etl.id, Object.values(obj))
                    parameters.shift()
                }

            }catch{
                toast.error("Ошибка", {
                    position: "top-center",
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                })
                parameters.shift()
            }

        } while (parameters.length !== 0)

        toast.update(popUp, {render: "Операция завершена", type: "success", isLoading: false, autoClose: 3000})
        setDisableButton(false)
        setParameters([])
        setAllowNull(false)
        setDisableButton(false)
        setCheckDuplicate(false)

        sentRequest(false)
    }

    return (
        <div className={cl.generalDiv}>
            <div className={cl.inputDiv}>
                <label className={cl.label}>Параметры</label>
                <DataGrid dataSource={parameters}
                          className={cl.input}
                          columns={urlParams}>
                    <Scrolling columnRenderingMode={"virtual"}
                               mode={"virtual"}></Scrolling>
                    <Editing
                        mode="row"
                        allowUpdating={true}
                        allowDeleting={true}
                        allowAdding={true} />

                </DataGrid>
            </div>
            <div className={cl.chbDiv}>
                <div className={cl.chbElemDiv}>
                    <input className={cl.checkBox}
                           type={"checkbox"}
                           value={clearData}
                           onChange={changeClearData}/>
                    <label>Очистить данные</label>
                </div>
                <div className={cl.chbElemDiv}>
                    <input className={cl.checkBox}
                           type={"checkbox"}
                           onChange={changeAllowNull}/>
                    <label>Допускать null</label>
                </div>
                <div className={cl.chbElemDiv}>
                    <input className={cl.checkBox}
                           type={"checkbox"}
                           onChange={changeCheckDuplicate}/>
                    <label>Проверка дубликатов</label>
                </div>
            </div>
            <div className={cl.btnDiv}>
                <button className={cl.btn}
                        onClick={startEtl}
                        disabled={disableButton}>Запустить</button>
            </div>
        </div>
    )
}

export default ETLExecuteForm