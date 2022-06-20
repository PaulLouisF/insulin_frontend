import { Fragment, useRef, useState } from "react";

import Button from "../UI/Button";
import classes from "../dashboard/NewPatient.module.css"; //WARNING to be changed

type NewConsultationProps = {
    onAddConsultation: (
        height: number,
        weight: number,
        report: string,
        patientId: number
    ) => void;
    patientId: number;
    onClose: () => void
};

const NewConsultation =(props: NewConsultationProps) => {
    const heightInputRef = useRef<HTMLInputElement>(null);
    const weightInputRef = useRef<HTMLInputElement>(null);
    const reportInputRef = useRef<HTMLTextAreaElement>(null);
    
    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        const enteredHeight = +heightInputRef.current!.value;
        const enteredWeight = +weightInputRef.current!.value;
        const enteredReport = reportInputRef.current!.value;
        

        //Add validation if null 
        // if (enteredFirstName.trim().length === 0) {
        //     trhow an error
        //     return;            
        // }
        console.log(enteredHeight)
        console.log(enteredWeight)
        console.log(enteredReport)
        props.onAddConsultation(enteredHeight, enteredWeight, enteredReport, props.patientId);
    }

    const closeConsultationForm = () => {
        props.onClose();
    }

    return(
        <Fragment>
            <h2>Créer une nouvelle consultation</h2>
            <form className={classes.form} onSubmit={submitHandler} >
                <div className={classes.bloc_label_input}>
                    <label htmlFor='height'>Taille</label>
                    <input type='number' id='height' ref={heightInputRef}/>
                </div>
                <div className={classes.bloc_label_input}>
                    <label htmlFor='weight'>Poids</label>
                    <input type='number' id='weight' ref={weightInputRef}/>
                </div>
                <div className={classes.bloc_label_input}>
                    <label htmlFor='report'>Compte rendu</label>
                    <textarea rows={3} id='report' ref={reportInputRef}/>
                </div>
                <div className={classes.bloc_button}>
                    <Button type="submit">Valider</Button>  
                    <Button type="button" onClick={closeConsultationForm}>Annuler</Button>
                </div>
            </form>
        </Fragment>

        )};

export default NewConsultation;