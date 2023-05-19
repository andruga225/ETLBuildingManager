import cl from './ModalWindow.module.css'

const ModalWindow = ({active, setActive, children}) => {
    return (
        <div className={active ? cl.active : cl.modal} onClick={() => setActive(false)}>
            <div className={cl.modalContent} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default ModalWindow;