import ETLElement from "../ETLElement/ETLElement";

const ETLList = ({etls, sentRequest}) => {

    function update()
    {
        sentRequest()
    }


    return (
        <div>
            {etls.map((etl) => <ETLElement etl={etl} key={etl.id} request={update}></ETLElement>)}
        </div>
    )
}

export default ETLList;