import React, { Fragment, useEffect, useState, useContext } from "react";

import { Routes, Route, useParams, NavLink } from "react-router-dom";
import Consultations from "../components/consultation/Consultations";

import socket from "../store/socket";

import AuthContext from "../store/auth-context";

import classes from './Patient.module.css';

const MyChart = React.lazy(() => import('../components/patientData/patientData'));
const Treatment = React.lazy(() => import('../components/treatment/Treatment'));
//import openSocket from 'socket.io-client';

const Patient = () => {
    const { id } = useParams();
    const authCtx = useContext(AuthContext);
    // const [patient, setPatient] = useState<PatientModel>();
    interface patientObject {
        id: number;
        first_name: string;
        last_name: string;
        is_man: boolean;
        birth_date: string;
        Consultations: [{
            id: number;
            height: number;
            weight: number;
            initial_report: string;
            created_at: string;
            User: {
                first_name: string;
                last_name: string;
                is_doctor: boolean;
            },
            Ticket: {
                question: string;
                is_closed: boolean;
                Answer: {
                    answer: string;
                    User: {
                      first_name: string;
                      last_name: string;
                      is_doctor: boolean
                    }
                  }
            }
        }]
    }

    const [patient, setPatient] = useState<patientObject>(); 
    const [age, setAge] = useState<number>();
    
    useEffect(() => { 
        try {
            const fetchPatientData = async () => {
                const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/patients/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + authCtx.token
                    } 
                });
                if (!response.ok) {
                    throw new Error('Could not fetch data');
                }
                const responseData = await response.json();
                const calculatedAge= calculateAge(responseData.patient.birth_date);
                console.log(responseData.patient)
                setAge(calculatedAge);
                setPatient(responseData.patient);
                return responseData;     
                
            }
            fetchPatientData();

            socket.on('consultations', data => {
                if (data.action === 'create') {
                    fetchPatientData();
                }
            })

            return () => {
                socket.off('consultations');
            }

        } catch (error) {
            //Handle error
        }       
    }, [id]);

    

    // WARNING put the function in separate file and use useMemo
    const calculateAge = (birth_date: string) => {
        const today = new Date();
        const birthDate = new Date(birth_date);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m<0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age --;
        }
        return age;
    }

    // const refs = list.reduce((acc: any, value) => {
    //     acc[value.id] = React.createRef();
    //     return acc;
    //   }, {});
    
    //   const handleClick = (id: number) =>
    //     refs[id].current.scrollIntoView({
    //       behavior: 'smooth',
    //       block: 'start',
    //     });


    return (
        <Fragment>
            {patient && 
                <div>
                    <div className={classes.bloc_patient}>
                        <h2>{`${patient.first_name} ${patient.last_name}, ${patient.is_man ? 'né' : 'née'} le ${new Date(patient.birth_date).toLocaleDateString("fr-FR")} (${age} ans)`}</h2>
                        <nav className={classes.nav}>
                        <ul>
                            <li><NavLink to={`/patients/${id}/consultations`} className={navData => navData.isActive ? classes.active : '' }>Consultations</NavLink></li>
                            <li><NavLink to={`/patients/${id}/data`} className={navData => navData.isActive ? classes.active : '' }>Data</NavLink></li>
                            <li><NavLink to={`/patients/${id}/traitements`} className={navData => navData.isActive ? classes.active : '' }>Traitements</NavLink></li>
                        </ul>
                    </nav>
                    </div>

                    <Routes>
                        <Route path="consultations" element={<Consultations patient={patient} />} />
                        {/* <Route path="glycemies" element={<h2>Pas de glycémie pour ce patient</h2>} /> */}
                        <Route path="data" element={<MyChart patient={patient}/>} />
                        <Route path="traitements" element={<Treatment/>} />
                 
                    </Routes>
                    
                    {/* <Consultations patient={patient} /> */}
                    {/* <ul>
                        {patient.Consultations.map((consultation) => (
                        <li key={consultation.id}>
                            <button
                            type="button"
                            onClick={() => handleClick(consultation.id)}
                            >
                            {`${new Date(consultation.created_at).getDate()}/${new Date(consultation.created_at).getMonth() + 1}/${new Date(consultation.created_at).getFullYear()}`}
                            </button>
                        </li>
                        ))}
                    </ul>

      <ul>
        {patient.Consultations.map((consultation) => (
          <li
            key={consultation.id}
            ref={refs[consultation.id]}
            style={{ height: '250px', border: '1px solid black' }}
          >
            <div>
                <h2>{consultation.created_at}</h2>
                <h2>{consultation.height}</h2>
            </div>
          </li>
        ))}
      </ul> */}
    
                </div>
            }


            
            
        </Fragment>
    );
};

export default Patient;