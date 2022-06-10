import React from "react";
import Patient from "../models/Patient";

type PatientsContextObj = {
    patients: Patient[],
    filteredName: string,
    fetchPatients: (name: string) => void
}

const PatientsContext = React.createContext<PatientsContextObj>({
    patients: [],
    filteredName: '',
    fetchPatients: (name) => {},
});

export default PatientsContext;