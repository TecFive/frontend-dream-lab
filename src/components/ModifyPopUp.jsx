const ModifyPopUp = (props) => {
    const { isShowing } = props;
    
    const modalStyle = {
        display: isShowing ? 'flex' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'opacity 0.3s ease-in-out'
    };
    
    const modalWindowStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.3)',
        width: '310px',
        textAlign: 'center',
        opacity: isShowing ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
    };

    if (!isShowing) {
        return null;
    }

    return (
        <div style={modalStyle}>
            <div style={modalWindowStyle}>
                <h1>¿Estás seguro de que quieres modificar tu reservación? Se te redirigirá al sitio de reservaciones. </h1>
                <button className="ReservationCardbutton" onClick={props.onCancel} style={{ marginRight: '10px' }}>Cancelar</button>
                <button className="confirmModifyButton" onClick={props.onConfirm}>Confirmar</button>
            </div>
        </div>
    );
};

export default ModifyPopUp;