import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import cl from './ChooseData.module.css'
import {useState} from "react";

const ChooseData = ({optionList, index, setFieldList, setFieldTypeList, fields, fieldTypes}) => {
    const [currentOption, setCurrentOption] = useState(fields[index].value)
    const [currentField, setCurrentField] = useState(fieldTypes[index])

    function removeField()
    {
        let copyFields = [...fields]
        copyFields.splice(index, 1)
        setFieldList(copyFields)

        let copyTypes = [...fieldTypes]
        copyTypes.splice(index, 1)
        setFieldTypeList(copyTypes)

    }

    function changeFieldName(value)
    {
        setCurrentField(value)
        let copyFields = [...fields]
        copyFields[index].value = value
        setFieldList(copyFields)
    }

    function changeFieldType(value)
    {
        setCurrentOption(value)
        let copyTypes = [...fieldTypes]
        copyTypes[index] = value
        setFieldTypeList(copyTypes)
    }

    return (
        <div className={cl.generalDiv}>
            <input className={cl.input} onChange={e => changeFieldName(e.target.value)}/>
            <select className={cl.slt}
                    onChange={(e) => changeFieldType(e.target.value)}
                    defaultValue={'Целое число'}>
                {optionList.map((option) => <option key={option}>{option}</option>)}
            </select>
            <IconButton size="small" onClick={removeField}>
                <ClearIcon />
            </IconButton>
        </div>
    )
}

export default ChooseData;