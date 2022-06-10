import { Fragment, useRef, useState } from "react";
import DatePicker from 'react-date-picker';

import Button from "../UI/Button";
import classes from "./NewPatient.module.css";

type NewPatientProps = {
    onAddPatient: (
        firstName: string,
        lastName: string,
        isMan: boolean,
        birthDate: Date
    ) => void;
};

const NewPatient = (props: NewPatientProps) => {
    const [value, onChange] = useState(new Date());
    const [isMan, setIsMan] = useState(true);

    const firstNameInputRef = useRef<HTMLInputElement>(null);
    const lastNameInputRef = useRef<HTMLInputElement>(null);
    const sexInputRef = useRef<HTMLInputElement>(null);
    const birthDateInputRef = useRef<HTMLInputElement>(null);
    
    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        const enteredFirstName = firstNameInputRef.current!.value;
        const enteredLastName = lastNameInputRef.current!.value;
        //const enteredSex = sexInputRef.current!.value;
        const enteredIsMan = isMan;
        const enteredBirthDate = value;
        

        //Add validation if null 
        // if (enteredFirstName.trim().length === 0) {
        //     trhow an error
        //     return;            
        // }
        console.log('ok');
        console.log(enteredFirstName);
        console.log(enteredLastName);
        console.log(enteredIsMan);
        console.log(enteredBirthDate);
        props.onAddPatient(enteredFirstName, enteredLastName, enteredIsMan, enteredBirthDate);
    }

    const sexChangeHandler = () => {
        setIsMan((prevIsMan) => { return !prevIsMan }); 
    }

    console.log(isMan);
    
    return(
        <Fragment>
            <h2>Créer un nouveau patient</h2>
            <form className={classes.form} onSubmit={submitHandler} >
                <div className={classes.group_name}>
                    <div className={classes.bloc_label_input}>
                        <label htmlFor='firstName'>Prénom</label>
                        <input type='text' id='firstName' ref={firstNameInputRef}/>
                    </div>
                    <div className={classes.bloc_label_input}>
                        <label htmlFor='lastName'>Nom</label>
                        <input type='text' id='lastName' ref={lastNameInputRef}/>
                    </div>
                </div>
                <div className={classes.bloc_label_input}>
                    {/* <label htmlFor='birthDate'>Date de naissance</label> */}
                    <label htmlFor='birthDate'>Date de naissance
                    </label>
                    <DatePicker onChange={onChange} value={value} />
                </div>

                <div className={classes.bloc_label_input}>
                    <label htmlFor='sex'>Sexe</label>
                    <h3>
                        <input type="checkbox" checked={isMan} name="controlled" onChange={sexChangeHandler}/>
                        Homme
                    </h3>
                    <h3>
                        <input type="checkbox" checked={!isMan} name="controlled" onChange={sexChangeHandler}/>
                        Femme
                    </h3>
                </div>
                
                <Button type="submit">Créer</Button>  
            </form>
        </Fragment>

        )};

export default NewPatient;