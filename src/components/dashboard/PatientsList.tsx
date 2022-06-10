import React, { useEffect } from 'react';

import PatientItem from './PatientItem';
// import PatientsContext from '../../storeEx/patients-context';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import classes from './PatientsList.module.css';
import { fetchPatientsData } from '../../store/patients-actions';
import { selectPatients } from '../../store/patients-slice';

const PatientsList = () => {
    // const patientCtx = useContext(PatientsContext);
    const dispatch = useAppDispatch();
    const patients = useAppSelector(selectPatients)

    useEffect(() => {
      dispatch(fetchPatientsData(''));
    },[dispatch]);

    return (
        <React.Fragment>    
            <div className={`${classes.legend} ${classes.pink}`}>
                <ul>
                    <li>Sexe</li>
                    <li>Nom</li>
                    <li>Prenom</li>
                    <li>Date de naissance</li>
                </ul>
            </div>
            <div className={classes.table}>    
                {/* {props.patients && props.patients.map((patient) => { */}
                {/* {patientCtx.patients && patientCtx.patients.map((patient) => { */}
                {patients && patients.map((patient) => {
                    return (
                        <PatientItem 
                            key={patient.id}
                            id={patient.id}
                            first_name={patient.first_name} 
                            last_name={patient.last_name} 
                            is_man={patient.is_man} 
                            birth_date={patient.birth_date}
                        />
                    )
                })}
            </div> 
        </React.Fragment>
        
    )
};

export default PatientsList;