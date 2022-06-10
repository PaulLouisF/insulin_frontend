import { Fragment } from "react";
import ReactDOM from 'react-dom';

import classes from './Modal.module.css';

const BackDrop = (props: {onClose: () => void}) => {
    return <div className={classes.backdrop} onClick={props.onClose}></div>
};

const ModalOverlay = (props: any) => {
    return <div className={classes.modal}>
        <div>{props.children}</div>
    </div>
};

const portalElement = document.getElementById("overlays");

const Modal = (props: { onClose: () => void; children: any; }) => {
    return(
        <Fragment>
            {portalElement ? ReactDOM.createPortal(<BackDrop onClose={props.onClose}/>, portalElement) : null}
            {portalElement ? ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay> , portalElement) : null}
        </Fragment>
    )
}

export default Modal;