import {Link} from 'react-router-dom'
import cl from './NavigationBar.module.css'

const NavigationBar = () =>
{
    return (
        <div className={cl.navigationBar}>
            <Link className={cl.navBarElem} to={'/etls'}>Список ETL</Link>
            <Link className={cl.navBarElem} to={'/tables'}>Список таблиц</Link>
            <Link className={cl.navBarElem} to={'/data'}>Просмотр данных</Link>
        </div>
    )
}

export default NavigationBar;