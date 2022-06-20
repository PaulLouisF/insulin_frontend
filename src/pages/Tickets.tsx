import { useEffect, useState, useContext, Fragment } from "react"

import AuthContext from "../store/auth-context";
import TicketItem from "../components/ticket/TicketItem";

import socket from "../store/socket";


import classes from './Tickets.module.css'; 
import Modal from "../components/UI/Modal";
import { IoNotificationsCircleOutline } from "react-icons/io5";

const Tickets = () => {
    interface ticketObject {
        id: number;
        question: string;
        is_closed: boolean;
        created_at: string;
        user_id: number;
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
            user_id: number;
            User: {
                first_name: string;
                last_name: string
            }
        };
        Answer: {
            answer: string;
            user_id: number;
            User: {
                first_name: string;
                last_name: string
            }
        }       
    }

    const authCtx = useContext(AuthContext);
    const [error, setError] = useState<any>();
    const [activeButtonId, setActiveButtonId] = useState<number>(1);
    const [activeButton, setActiveButton] = useState<number>(1);
    const [tickets, setTickets] = useState<ticketObject[]>([]);

    useEffect(() => { 
        try {
            const fetchTicketsData = async () => {
                const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/tickets`, {
                    headers: {
                        Authorization: 'Bearer ' + authCtx.token
                    } 
                });

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error('Impossible de charger les tickets');
                }
                
                const loadedTickets = responseData.tickets;
                setTickets(loadedTickets);
            
                // setTickets(() => {
                //     return loadedTickets.filter((ticket: { user_id: number }) => ticket.user_id === authCtx.userId)
                // });
            }
            fetchTicketsData(); 

            const socketTicket = (data: any)  => {
                if (data.action === 'create') {
                    fetchTicketsData();
                }
                if (data.action === 'take') {
                    fetchTicketsData();
                }
                if (data.action === 'cancel') {
                    fetchTicketsData();
                }
                if (data.action === 'answer') {
                    fetchTicketsData();
                }
            }

            socket.on('tickets', socketTicket)

            return () => {
                socket.off('tickets');
            }
         
        } catch (err: any) {
            console.log(err)
            setError(err)  
        }       
    }, [authCtx.token, authCtx.userId]);

 
    //let myTickets: any[]= [];
    let ticketsUnderHandling: any[]= [];
    let ticketsHandled: any[]= [];
    let ticketsNotHandled: any[]= [];
    let noTicketsUnderHandlingMessage;
    let noTicketsHandledMessage;
    let noTicketsNotHandledMessage;


    if (activeButton === 1) {
        //myTickets = tickets.filter((ticket: { user_id: number }) => ticket.user_id === authCtx.userId)
        ticketsUnderHandling = tickets.filter((ticket: { TicketPile: { user_id: number }; user_id: number}) => ticket.TicketPile && ticket.TicketPile.user_id === authCtx.userId && ticket.user_id != authCtx.userId);
        ticketsHandled = tickets.filter((ticket: { is_closed: boolean; Answer: { user_id: number} }) => ticket.is_closed === true && ticket.Answer && ticket.Answer.user_id === authCtx.userId);
        ticketsNotHandled =  tickets.filter((ticket: { TicketPile: any; Answer: any; user_id: number }) => !ticket.TicketPile && !ticket.Answer && ticket.user_id != authCtx.userId);
        noTicketsUnderHandlingMessage = <h2>Vous n'avez aucun ticket en cours</h2>;
        // noTicketsHandledMessage;
        // noTicketsNotHandledMessage;
    
    }
    if (activeButton === 2) {
        //myTickets = tickets.filter((ticket: { user_id: number }) => ticket.user_id === authCtx.userId)
        ticketsUnderHandling = tickets.filter((ticket: { TicketPile: { user_id: number }; user_id: number}) => ticket.TicketPile && ticket.user_id === authCtx.userId);
        ticketsHandled = tickets.filter((ticket: { Answer: any; user_id: number }) => ticket.user_id === authCtx.userId && ticket.Answer);
        ticketsNotHandled =  tickets.filter((ticket: { TicketPile: any; Answer: any; user_id: number }) => !ticket.TicketPile && !ticket.Answer && ticket.user_id === authCtx.userId);
        noTicketsUnderHandlingMessage = <h2>Vous n'avez aucun question non répondue en cours de traitement</h2>;
    }


    // const myTickets = tickets.filter((ticket: { user_id: number }) => ticket.user_id === authCtx.userId)
    // const ticketsUnderHandling = tickets.filter((ticket: { TicketPile: { user_id: number }; user_id: number}) => ticket.TicketPile && ticket.TicketPile.user_id === authCtx.userId && ticket.user_id != authCtx.userId);
    // const ticketsHandled = tickets.filter((ticket: { is_closed: boolean; Answer: { user_id: number} }) => ticket.is_closed === true && ticket.Answer && ticket.Answer.user_id === authCtx.userId);
    // const ticketsNotHandled =  tickets.filter((ticket: { TicketPile: any; is_closed: boolean; user_id: number }) => !ticket.TicketPile && !ticket.is_closed && ticket.user_id != authCtx.userId);
    
                

    return (

        <Fragment>
            {error && <Modal onClose={() => {setError(null)}}>{error}</Modal>} 
            
            <div className={classes.ticket_menu}>
                {/* <h2>Tickets</h2> */}
                <div>
                <button className={`${classes.tickets_menu_button} ${1 === activeButton ? classes.active : ''}`} type="button" onClick={() => setActiveButton(1)}>Mes tickets</button>
                <button className={`${classes.tickets_menu_button} ${2 === activeButton ? classes.active : ''}`} type="button" onClick={() => setActiveButton(2)}>Mes questions</button>

                </div>
                <div className={classes.tickets_menu_buttons}>
                    <button className={`${classes.tickets_menu_button} ${1 === activeButtonId ? classes.active : ''}`} type="button" onClick={() => setActiveButtonId(1)}>En cours ({ticketsUnderHandling.length})</button>
                    <button className={`${classes.tickets_menu_button} ${2 === activeButtonId ? classes.active : ''}`} type="button" onClick={() => setActiveButtonId(2)}>En attente ({ticketsNotHandled.length})</button>
                    <button className={`${classes.tickets_menu_button} ${3 === activeButtonId ? classes.active : ''}`} type="button" onClick={() => setActiveButtonId(3)}>{activeButton === 1 ? "Traités": "Traitées" }({ticketsHandled.length})</button>
                    {/* <button className={`${classes.tickets_menu_button} ${4 === activeButtonId ? classes.active : ''}`} type="button" onClick={() => setActiveButtonId(4)}>Mes questions ({myTickets.length})</button> */}
                </div>
            </div>

            { activeButtonId === 1 && 
                <div>
                    {ticketsUnderHandling.length > 0 ? ticketsUnderHandling.map(ticket => {
                    return <TicketItem ticket={ticket} key={ticket.id} status={"underHandling"} /> 
                })
                    : noTicketsUnderHandlingMessage}
                    {/* <h2>Vous n'avez aucun ticket en cours</h2>} */}
                </div>
            }           


            { activeButtonId === 2 && 
                <div>
                    
                {ticketsNotHandled.length > 0 ? ticketsNotHandled.map(ticket => {
                return <TicketItem ticket={ticket} key={ticket.id} status={"notHandled"} /> 
            })
                : <h2>Il n'y a pas de ticket en attente</h2>}
            </div>
            }       
    
            

            { activeButtonId === 3 && 
                <div>
                    {ticketsHandled.length > 0 ? ticketsHandled.map(ticket => {
                    return <TicketItem ticket={ticket} key={ticket.id} status={"handled"} /> 
                })
                    : <h2>Vous n'avez répondu à aucun ticket</h2>}
                </div>
            }   


            {/* { activeButtonId === 4 && 
                <div>
                    {myTickets.length > 0 ? myTickets.map(ticket => {
                    return <TicketItem ticket={ticket} key={ticket.id} status={"myOwnTickets"} /> 
                })
                    : <h2>Vous n'avez créé aucun ticket</h2>}
                </div>
                
            } */}



        </Fragment>


   
    )
}

export default Tickets