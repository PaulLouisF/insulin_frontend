import { Link } from 'react-router-dom';
import Patient from '../../models/Patient';
import { IoMan, IoWoman } from "react-icons/io5";
import { transformDateShort } from '../../util/function';

import classes from './PatientsList.module.css';


const PatientItem = (props: Patient) => {
    console.log(props)
    return (
        <div className={classes.legend}>
            <Link to={`/patients/${props.id}/consultations`} >
                <ul>
                
                    <li>{props.is_man ? <IoMan /> : <IoWoman />}</li>
                    {/* <li>{props.is_man ? 'M' : 'F'}</li> */}
                    <li>{props.last_name}</li>
                    <li>{props.first_name}</li>
                    <li>{transformDateShort(props.birth_date)}</li>
                </ul>
            </Link>
        </div>
    );
}

export default PatientItem;