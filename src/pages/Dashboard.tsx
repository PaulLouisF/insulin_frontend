import React, { useEffect, useState, useContext } from "react";
import Button from "../components/UI/Button";

import PatientSearchBar from "../components/dashboard/PatientSearchBar";
import PatientsList from "../components/dashboard/PatientsList";


import classes from './Dashboard.module.css';
import NewPatient from "../components/dashboard/NewPatient";
import Modal from "../components/UI/Modal";


//import classes from './Dashboard.module.css';

const Dashboard = () => {
    //const [loadedPatients, setLoadedPatients] = useState<Patient[]>([]);
    const [isCreate, setIsCreate] = useState<boolean>(false);


    const createPatientHandler = () => {
        setIsCreate(true);
    };

    const closePatientHandler = () => {
        setIsCreate(false);
    };


    // useEffect(() => {
    //     const fetchPatients = async () => {
    //       try {
    //         const responseData = await fetch(
    //           `http://localhost:5000/api/patients`
    //         );
    //         const response = await responseData.json();
    //         setLoadedPatients(response.patients);  
    //       } catch (err) {}
    //     };
    //     fetchPatients();
    // }, []);

    const onAddPatientHandler = async (
      firstName: string, 
      lastName: string, 
      isMan: boolean,
      birthDate: Date) => {
        await fetch(`http://localhost:5000/api/patients`, {
          method: 'POST',
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            is_man: isMan,
            birth_date: birthDate

          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setIsCreate(false); //WARNING UNHANDLE if error
    };


    return (
        <React.Fragment>
            {isCreate && <Modal onClose={closePatientHandler}><NewPatient onAddPatient={onAddPatientHandler}/></Modal>}
            <div className={classes.dashboard_actionbar}>
                <PatientSearchBar />
                <Button onClick={createPatientHandler}>+Créer un patient</Button>
            </div>
            {/* <PatientsList patients={loadedPatients}/> */}
            <PatientsList />
        </React.Fragment>);
}

export default Dashboard;