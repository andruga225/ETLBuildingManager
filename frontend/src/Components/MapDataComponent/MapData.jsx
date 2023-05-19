import cl from './MapData.module.css'
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import {useState} from "react";

const MapData = ({sourceSchema, tableSchema, mappedTableFields, setMappedTableFields,
                     index, mappedSourceFields, setMappedSourceFields}) => {
    const [currentSourceField, setCurrentSourceField] = useState(mappedSourceFields[index])
    const [currentTableField, setCurrentTableField] = useState(mappedTableFields[index])


    function removeField()
    {
        let copyMappedSourceFields = [...mappedSourceFields]
        copyMappedSourceFields.splice(index, 1)
        setMappedSourceFields(copyMappedSourceFields)

        let copyMappedTableFields = [...mappedTableFields]
        copyMappedTableFields.splice(index, 1)
        setMappedTableFields(copyMappedTableFields)

    }

    function changeSourceField(value)
    {
        setCurrentSourceField(value)
        let copyMappedSourceFields = [...mappedSourceFields]
        copyMappedSourceFields[index].value = value
        setMappedSourceFields(copyMappedSourceFields)
    }

    function changeTableField(value)
    {
        setCurrentTableField(value)
        let copyMappedTableFields = [...mappedTableFields]
        copyMappedTableFields[index] = value.split(':')[0]
        setMappedTableFields(copyMappedTableFields)
    }

    return (
        <div className={cl.generalDiv}>
            <select className={cl.slt}
                    onChange={e => changeSourceField(e.target.value)}>
                {sourceSchema.map(field =>  <option>{field}</option>)}
            </select>
            <select className={cl.slt}
                    onChange={e => changeTableField(e.target.value)}>
                {tableSchema.map(field =>  <option>{field.name}:{field.type}</option>)}
            </select>
            <IconButton size="small" onClick={removeField}>
                <ClearIcon></ClearIcon>
            </IconButton>
        </div>
    )
}

export default MapData;