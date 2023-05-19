import NavigationBar from "./Components/NavigationBar/NavigationBar";
import ETLPage from "./Components/ETLPage/ETLPage";
import TablePage from "./Components/TablePage/TablePage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ETLExecuteForm from "./Components/ETLExecuteForm/ETLExecuteForm";
import DataPage from "./Components/DataPage/DataPage";


function App() {
    return (
        <div>
            <BrowserRouter>
                <NavigationBar/>
                <Routes>
                    <Route path={'/etls'} element={<ETLPage/>}/>
                    <Route path={'/tables'} element={<TablePage/>}/>
                    <Route path={'/data'} element={<DataPage/>}/>
                    <Route path={'/test'} element={<ETLExecuteForm/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App;
