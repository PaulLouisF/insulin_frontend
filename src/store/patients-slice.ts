import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import Patient from "../models/Patient";

interface PatientsState {
    patients: Patient[],
    filteredName: string,
}

const initialState: PatientsState = {
    patients: [],
    filteredName: '',
}

interface ReplacePatientsAction {
    patients: Patient[],
    filteredName: string
}

interface AddPatientAction {
    patient: Patient,
}

const patientsSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        replacePatients: (state, action: PayloadAction<ReplacePatientsAction>) => {
            state.patients = action.payload.patients;
            state.filteredName = action.payload.filteredName;
        },
        addPatient: (state, action: PayloadAction<AddPatientAction>) => {
            const newPatients = [...state.patients];
            newPatients.push(action.payload.patient);
            state.patients = newPatients;
            state.filteredName = '';
        },
        // eraseFilter: (state) => {
        //     state.patients;
        //     state.filteredName = '';
        // }
    }
});

export const { replacePatients, addPatient } = patientsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPatients = (state: RootState) => state.patients.patients

export default patientsSlice.reducer;