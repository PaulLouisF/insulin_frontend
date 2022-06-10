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

interface PatientsAction {
    patients: Patient[],
    filteredName: string
}

const patientsSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        replacePatients: (state, action: PayloadAction<PatientsAction>) => {
            state.patients = action.payload.patients;
            state.filteredName = action.payload.filteredName;
        },
    }
});

export const { replacePatients } = patientsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPatients = (state: RootState) => state.patients.patients

export default patientsSlice.reducer;