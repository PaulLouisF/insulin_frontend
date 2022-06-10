import classes from './ConsultationBox.module.css';

const ConsultationBox = (props:any) => {
    return(
        <div className={classes.consultation_box_container}>
            <div className={classes.consultation_box_container_title}>
                <p>{props.title}</p>
            </div>
            {props.children}
        </div>
    );
}

export default ConsultationBox;