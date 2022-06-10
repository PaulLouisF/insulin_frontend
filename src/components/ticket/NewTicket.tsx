import { Fragment, useRef } from "react";

import Button from "../UI/Button";
import classes from "../dashboard/NewPatient.module.css"; //WARNING to be changed

type NewTicketProps = {
    onAddTicket: (
        question: string,
        consultationId: number
    ) => void;
    consultationId: number;
};

const NewTicket =(props: NewTicketProps) => {
    const questionInputRef = useRef<HTMLTextAreaElement>(null);
    
    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        const enteredQuestion = questionInputRef.current!.value;
        props.onAddTicket(enteredQuestion, props.consultationId);
    }
    
    return(
        <Fragment>
            <h2>Poser une question à un spécialiste</h2>
            <form className={classes.form} onSubmit={submitHandler} >
                <div className={classes.bloc_label_input}>
                    <label htmlFor='question'>Question</label>
                    <textarea rows={3} id='question' ref={questionInputRef}/>
                </div>                
                <Button type="submit">Créer</Button>  
            </form>
        </Fragment>

        )};

export default NewTicket;