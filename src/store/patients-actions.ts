import { replacePatients } from "./patients-slice";

export const fetchPatientsData = ( enteredName: string ) => {
    return async (dispatch: (arg0: any) => void) => {
        const fetchData = async () => {
            // const response = await fetch(`http://localhost:5000/api/patients`);
            const response = await fetch(`http://localhost:5000/api/patients?myparam=${enteredName}`);
            if (!response.ok) {
                throw new Error('Could not fetch data');
            }
            const responseData = response.json();
            return responseData;     
        }

        try {
            const responseData = await fetchData();
            dispatch(replacePatients({
                patients: responseData.patients,
                filteredName: enteredName
            }));
        } catch (error) {
            //Handle error
        }    
    }
};