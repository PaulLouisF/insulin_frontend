import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";

import PatientSearchBar from "../components/dashboard/PatientSearchBar";
import PatientsList from "../components/dashboard/PatientsList";


import classes from './Dashboard.module.css';
import NewPatient from "../components/dashboard/NewPatient";
import Modal from "../components/UI/Modal";
import AuthContext from "../store/auth-context";
import { useAppDispatch } from "../store/hooks";
import { fetchPatientsData } from "../store/patients-actions";
import { addPatient } from "../store/patients-slice";


//import classes from './Dashboard.module.css';

const Dashboard = () => {
    //const [loadedPatients, setLoadedPatients] = useState<Patient[]>([]);
    const dispatch = useAppDispatch();
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const authCtx = useContext(AuthContext);
    let navigate = useNavigate();


    console.log('test0')
    const createPatientHandler = () => {
        setIsCreate(true);
    };

    const closePatientHandler = () => {
        setIsCreate(false);
    };

    const reinitialiseFilterHandler = () => {
      dispatch(fetchPatientsData('', authCtx.token));
    }

    const onAddPatientHandler = async (
      firstName: string, 
      lastName: string, 
      isMan: boolean,
      birthDate: Date,
      event: React.FormEvent) => {
        event.preventDefault();
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/patients', { 
          method: 'POST',
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            is_man: isMan,
            birth_date: birthDate
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + authCtx.token
          }
        });
        const responseData = await response.json();
        //dispatch(addPatient({patient: responseData.patient}));
        setIsCreate(false); //WARNING UNHANDLE if error  
        navigate(`/patients/${responseData.patient.id}}/consultations`, { replace: true });
    };


    return (
        <React.Fragment>
            {isCreate && <Modal onClose={closePatientHandler}><NewPatient onAddPatient={onAddPatientHandler} onClose={closePatientHandler}/></Modal>}
            <div className={classes.dashboard_actionbar}>
              <div className={classes.dashboard_search}>
                <PatientSearchBar />
                <Button onClick={reinitialiseFilterHandler}>Effacer le filtre</Button>
              </div>
      
                <Button onClick={createPatientHandler}>Créer un patient</Button>
            </div>
            {/* <PatientsList patients={loadedPatients}/> */}
            <PatientsList />
        </React.Fragment>
    );
}

export default Dashboard;