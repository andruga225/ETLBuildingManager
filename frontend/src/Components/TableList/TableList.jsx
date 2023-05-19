import TableElement from "../TableElement/TableElement";

const TableList = ({tables, request}) => {

    function sentRequest()
    {
        request()
    }

    return (
        <div>
            {tables.map((table) => <TableElement table={table} key={table.name} sentRequest={sentRequest}></TableElement>)}
        </div>
    )
}

export default TableList;