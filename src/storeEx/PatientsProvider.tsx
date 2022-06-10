import { useReducer, useEffect } from "react";
import Patient from "../models/Patient";
import PatientsContext from "./patients-context";


type defaultPatientsState = {
    patients: Patient[],
    filteredName: string
}

const defaultPatientsState = {
    patients: [],
    filteredName: ''
}


type PatientsState = {
    patients: Patient[],
    filteredName: string
}

type PatientsAction = {
    type: string,
    patients: Patient[],
    enteredName: string
}

const patientsReducer = (state: PatientsState, action: PatientsAction) => {
    if (action.type === 'GET_PATIENTS') {
        return { 
            patients: action.patients,
            filteredName: action.enteredName
        };

    }
    return defaultPatientsState;
};

const PatientsProvider = (props: { children: any }) => {

    const [patientsState, dispatchPatientsAction] = useReducer(
        patientsReducer,
        defaultPatientsState
    );

    useEffect(() => {
        const fetchPatients = async () => {
            try {
            const responseData = await fetch(
              `http://localhost:5000/api/patients`
            );
            const response = await responseData.json();
            const patients = response.patients;
            // dispatch({ type: GET_PRODUCTS_SUCCESS, payload: productFamilies })
            // dispatchPatientsAction({ type: 'FETCHED', enteredName: filteredName})
            dispatchPatientsAction({ 
                type: 'GET_PATIENTS', 
                patients: patients,
                enteredName: ''
            }) 
          } catch (err) {}
        };
        fetchPatients();
      }, []);

    const fetchPatientsHandler = async (filteredName: string) => {
        try {
            const responseData = await fetch(
              `http://localhost:5000/api/patients`
            );
            const response = await responseData.json();
            const patients = response.patients;
            dispatchPatientsAction({ 
                type: 'GET_PATIENTS', 
                patients: patients,
                enteredName: filteredName
            }) 
          } catch (err) {}
    };

    const patientsContext = {
        patients: patientsState.patients,
        filteredName: patientsState.filteredName,
        fetchPatients: fetchPatientsHandler,
    }

    return (
        <PatientsContext.Provider value={patientsContext}>
            {props.children}
        </PatientsContext.Provider>
    );
};

export default PatientsProvider;