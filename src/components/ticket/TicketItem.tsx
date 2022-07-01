import { Fragment, useState, useRef, useContext } from "react";

import { Navigate, useNavigate } from "react-router-dom";

import Button from "../UI/Button";
import { transformDateShortWithTime, calculateTimeInMinutes } from "../../util/function";
import AuthContext from "../../store/auth-context";
import { FaHospitalUser } from "react-icons/fa";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro' 


import classes from './TicketItem.module.css';
import Modal from "../UI/Modal";

interface ticketObject {
    ticket: {
        id: number;
        question: string;
        is_closed: boolean;
        created_at: string;
        // user_id: number;
        consultation_id: number;
        Consultation: {
            patient_id: number;
            Patient: {
                first_name: string;
                last_name: string;
            };
        };
        User: { 
            first_name: string;
            last_name: string
        };
        TicketPile: {
            id: number;
            User: {
                first_name: string;
                last_name: string
            }
        };
        Answer: {
            answer: string;
            User: {
                first_name: string;
                last_name: string;
                is_doctor: boolean;
            }
        }
    },
    status: string,
    isTicketButtonActive: boolean
    //onCancel: (id: number) => void;
}

const TicketItem = (props: ticketObject) => {
    const { ticket, status, isTicketButtonActive } = props;
    const [error, setError] = useState<any>();
    let navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const ticketAnswerRef = useRef<HTMLTextAreaElement>(null);

    const takeTicketHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        //WARNING Set Parameter assignee in Ticket
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/tickets/assigned-ticket`, {
                method: 'POST',
                body: JSON.stringify({
                    ticket_id: ticket.id,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token
                }
            });
            const responseData = await response.json();
            
            if (!response.ok) {
                // throw new Error('Something went wrong');
                throw new Error(responseData.message);
            }
            navigate(`/patients/${ticket.Consultation.patient_id}}/consultations`, {state: { consultationId: ticket.consultation_id }});
            //navigate(`/patients/${ticket.Consultation.patient_id}}/consultations`, { replace: true });
        } catch (err:any) {
            // throw err;
            setError(err.message)
        }
    };

    const viewPatientFile = async (event: React.FormEvent) => {
        event.preventDefault();
        navigate(`/patients/${ticket.Consultation.patient_id}}/consultations`, {state: { consultationId: ticket.consultation_id }});
        //<Navigate to="/patients/${ticket.Consultation.patient_id}}/consultations" state={{ consultationId: ticket.consultation_id }} replace />; 
    };

    const cancelTicketHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        //WARNING Set Parameter assignee in Ticket
        try {
            const response = await fetch(
                process.env.REACT_APP_BACKEND_URL + `/tickets/${ticket.TicketPile.id}`, { 
                  method: 'DELETE',
                  headers: {
                    Authorization: 'Bearer ' + authCtx.token
                  }
                }
            );
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message);
            }  
            //props.onCancel(ticket.id) 
        } catch (err: any) {
            setError(err.message)
        }
    };

    const answerTicketHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        
        //WARNING Set Parameter assignee in Ticket
        
        try {
            if (ticketAnswerRef.current!.value.length < 30) {
                throw new Error("Veuillez répondre à la question avant de valider la réponse au ticket. Vous devez au moins écrire 30 lettres");
            }

            const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/tickets/${ticket.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    answer: ticketAnswerRef.current!.value
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token
                }
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.message);
            }            
        } catch (err:any) {
            setError(err.message)
        }
    };

    return(
        <Fragment>
            {error && <Modal onClose={() => {setError(null)}}>{error}</Modal>}
            
        <div className={classes.ticket_item_container}>
            <div className={classes.ticket_item_header}>
                <h3>#{ticket.id}</h3>
                <h4><FontAwesomeIcon icon={solid('bed')} size={"lg"} /> {ticket.Consultation.Patient.first_name} {ticket.Consultation.Patient.last_name}</h4>
                <div className={classes.ticket_header_hospital}>
                    <FaHospitalUser size={30} className={classes.ticket_header_hospital_icon}/>
                    <h4> Centre hospitalier de Nosy Be</h4>
                </div>
                
                <h4><FontAwesomeIcon icon={solid('clock')} size={"lg"} /> {` le ${transformDateShortWithTime(ticket.created_at)} ${status === "handled" ? "" : `(${calculateTimeInMinutes(ticket.created_at)} min)`}`}</h4>
                {(status === "underHandling" && isTicketButtonActive) && <Button onClick={cancelTicketHandler}>Annuler le ticket</Button>}
                {(status === "handled") && <Button onClick={viewPatientFile}>Voir dossier patient</Button>}
                {(status === "notHandled" && isTicketButtonActive) && <Button onClick={takeTicketHandler}>Prendre le ticket</Button>}
            </div>
            <div className={classes.ticket_question_answer}>
                <p><FontAwesomeIcon icon={solid('question')} /> Question de {ticket.User.first_name} {ticket.User.last_name} : {ticket.question}</p>
            </div>     
            {(status === "handled") && <div className={classes.ticket_question_answer}>
                <p><FontAwesomeIcon icon={solid('user-doctor')} /> {`Réponse de ${ticket.Answer.User.is_doctor ? "Dr" : ""} ${ticket.Answer.User.first_name} ${ticket.Answer.User.last_name} : ${ticket.Answer.answer}`}</p>
            </div>} 
            {/* {(status === "myOwnTickets" && ticket.Answer) && <div className={classes.ticket_answer}>
                <p>{`Reponse par ${ticket.Answer.User.first_name} ${ticket.Answer.User.last_name}: ${ticket.Answer.answer}`}</p>
            </div>}  */}
            {(status === "underHandling") && 
                (isTicketButtonActive? 
                    <div className={classes.ticket_answer}>
                        <form className={classes.ticket_answer_form} onSubmit={answerTicketHandler} >
                            <textarea rows={4} id='reponse' ref={ticketAnswerRef}/>
                            <div className={classes.ticket_answer_form_button}>
                                <Button onClick={viewPatientFile}>Voir dossier patient</Button>
                                <Button type="submit">Repondre</Button>
                            </div>
                        </form>
                    </div> 
                    : 
                    <div className={classes.center}>
                        <p><b>Le ticket est en cours de traitement par {ticket.TicketPile.User.first_name} {ticket.TicketPile.User.last_name}. Vous recevrez prochainement une réponse</b></p>
                    </div> 
                )  
            }    
        </div>
        </Fragment>
    );
}

export default TicketItem;