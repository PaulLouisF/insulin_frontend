import { replacePatients } from "./patients-slice";


export const fetchPatientsData = ( enteredName: string, token: string | null | undefined ) => {   
    return async (dispatch: (arg0: any) => void) => {
        const fetchData = async () => {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/patients?myparam=${enteredName}`, { 
                headers: {
                    Authorization: 'Bearer ' + token
                } 
            });
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