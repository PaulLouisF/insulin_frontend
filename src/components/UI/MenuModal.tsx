import { Fragment } from "react";
import ReactDOM from 'react-dom';

import classes from './MenuModal.module.css';



const MenuModalOverlay = (props: any) => {
    return <div className={classes.modal}>
        <div>{props.children}</div>
    </div>
};

const portalElement = document.getElementById("overlays");

const MenuModal = (props: { onClose: () => void; children: any; }) => {
    return(
        <Fragment>
    
            {portalElement ? ReactDOM.createPortal(<MenuModalOverlay>{props.children}</MenuModalOverlay> , portalElement) : null}
        </Fragment>
    )
}

export default MenuModal;