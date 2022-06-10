import { useRef } from "react";
// import PatientsContext from '../../storeEx/patients-context';
import classes from './PatientSearchBar.module.css';


import { IoSearchCircle } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchPatientsData } from "../../store/patients-actions";

// const nameReducer = (state, action) => {
//     return { value: '', }
// }

const PatientSearchBar = () => {
    // const patientCtx = useContext(PatientsContext);
    const dispatch = useAppDispatch();
    const patientSearchInputRef = useRef<HTMLInputElement>(null);
    
    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        // patientCtx.fetchPatients(patientSearchInputRef.current!.value)
        dispatch(fetchPatientsData(patientSearchInputRef.current!.value));
    }
    
    return(
        <form className={classes.searchbar_container} onSubmit={submitHandler} >
            <input type='text' placeholder="nom, prénom" id='name' ref={patientSearchInputRef}/>
            <button type="submit"><IoSearchCircle size={52}/></button>  
    
        </form>
        )};

export default PatientSearchBar;