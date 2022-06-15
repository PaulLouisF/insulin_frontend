import { Fragment, useEffect, useState, useContext } from "react"
import TicketItem from "../components/ticket/TicketItem";
import AuthContext from "../store/auth-context";
import openSocket from 'socket.io-client';

import classes from './Tickets.module.css'; 


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
            User: {
                first_name: string;
                last_name: string
            }
        }       
    }

    const [activeButtonId, setActiveButtonId] = useState<number>(1);
    const [ticketsHandled, setTicketsHandled] = useState<ticketObject[]>([]); 
    const [ticketsUnderHandling, setTicketsUnderHandling] = useState<ticketObject[]>([]); 
    const [ticketsNotHandled, setTicketsNotHandled] = useState<ticketObject[]>([]);
    const [myTickets, setMyTickets] = useState<ticketObject[]>([]);
    const authCtx = useContext(AuthContext);
    const socket = openSocket(`${process.env.REACT_APP_OPENSOCKET}`);
    // const[tickets, setTickets] = useState<{
    //     ticketsHandled: ticketObject[],
    //     ticketsUnderHandling: ticketObject[],
    //     ticketsNotHandled: ticketObject[],
    // }>()
 
    useEffect(() => { 
        try {
            const fetchTicketsData = async () => {
                const response = await fetch(process.env.REACT_APP_BACKEND_URL + `/tickets`, {
                    headers: {
                        Authorization: 'Bearer ' + authCtx.token
                    } 
                });
                if (!response.ok) {
                    throw new Error('Could not fetch data');
                }
                const responseData = await response.json();
                const myTickets = responseData.tickets.filter((ticket: { user_id: number }) => ticket.user_id === authCtx.userId)
                const ticketsUnderHandling = responseData.tickets.filter((ticket: { TicketPile: { user_id: number }; user_id: number}) => ticket.TicketPile && ticket.TicketPile.user_id === authCtx.userId && ticket.user_id != authCtx.userId);
                const ticketsHandled = responseData.tickets.filter((ticket: { is_closed: boolean; Answer: { user_id: number} }) => ticket.is_closed === true && ticket.Answer.user_id === authCtx.userId);
                const ticketsNotHandled = responseData.tickets.filter((ticket: { TicketPile: any; is_closed: boolean; user_id: number }) => !ticket.TicketPile && !ticket.is_closed && ticket.user_id != authCtx.userId);
                console.log(ticketsUnderHandling)
                console.log(ticketsNotHandled)
                console.log(myTickets)
                
                setTicketsHandled(ticketsHandled);
                setTicketsUnderHandling(ticketsUnderHandling);
                setTicketsNotHandled(ticketsNotHandled);
                setMyTickets(myTickets);
                // setTickets({
                //     ticketsHandled: ticketsHandled,
                //     ticketsUnderHandling: ticketsUnderHandling,
                //     ticketsNotHandled: ticketsNotHandled,
                // })
                return responseData;     
                
            }
            fetchTicketsData();
            
            //const socket = openSocket(`${process.env.REACT_APP_OPENSOCKET}`);
            socket.on('tickets', data => {
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
            })
         
        } catch (error) {
            //Handle error
        }       
    }, []);

    
    

    // const onCancelTicketPileHandler = async (id: number) => {
    //     const ticket = ticketsUnderHandling.filter((ticket) => ticket.id === id)[0];
    //     setTicketsUnderHandling((prevState) => {
    //         return prevState.filter((ticket) => ticket.id != id)
    //     })
    //     setTicketsNotHandled((prevState) => {
    //         const newTicketsNotHandled = [...prevState];
    //         newTicketsNotHandled.push(ticket);
    //         return newTicketsNotHandled
    //     })
    // };


    let notHandled;
    if (ticketsNotHandled.length > 0) {
        console.log(ticketsNotHandled)
        notHandled = ticketsNotHandled.map(ticket => {
            return <TicketItem ticket={ticket} key={ticket.id} status={"notHandled"} /> //onCancel={onCancelTicketPileHandler}
        })
    } else {
        notHandled = <h2>Il n'y a pas de ticket en attente</h2>
    }

    let underHandling;
    if (ticketsUnderHandling.length > 0) {
        underHandling = ticketsUnderHandling.map(ticket => {
            return <TicketItem ticket={ticket} key={ticket.id} status={"underHandling"} /> //onCancel={onCancelTicketPileHandler}
        })
    } else {
        underHandling = <h2>Vous n'avez pas de ticket en cours</h2>
    }

    let handled; 
    if (ticketsHandled.length > 0) {
        handled = ticketsHandled.map(ticket => {
            return <TicketItem ticket={ticket} key={ticket.id} status={"handled"} /> //onCancel={onCancelTicketPileHandler}
        })
    } else {
        handled = <h2>Vous n'avez répondu à aucun ticket</h2>
    }

    let myOwnTickets; 
    if (myTickets.length > 0) {
        myOwnTickets = myTickets.map(ticket => {
            return <TicketItem ticket={ticket} key={ticket.id} status={"myOwnTickets"} /> //onCancel={onCancelTicketPileHandler}
        })
    } else {
        myOwnTickets = <h2>Vous n'avez créé aucun ticket</h2>
    }

    return (
        <Fragment>
            <div className={classes.ticket_menu}>
                <h2>Tickets</h2>
                <div className={classes.tickets_menu_buttons}>
                    <button className={`${classes.tickets_menu_button} ${1 === activeButtonId ? classes.active : ''}`} type="button" onClick={() => setActiveButtonId(1)}>En cours ({ticketsUnderHandling.length})</button>
                    <button className={`${classes.tickets_menu_button} ${2 === activeButtonId ? classes.active : ''}`} type="button" onClick={() => setActiveButtonId(2)}>En attente ({ticketsNotHandled.length})</button>
                    <button className={`${classes.tickets_menu_button} ${3 === activeButtonId ? classes.active : ''}`} type="button" onClick={() => setActiveButtonId(3)}>Traités ({ticketsHandled.length})</button>
                    <button className={`${classes.tickets_menu_button} ${4 === activeButtonId ? classes.active : ''}`} type="button" onClick={() => setActiveButtonId(4)}>Mes questions ({myTickets.length})</button>
                </div>
            </div>
           

            { activeButtonId === 1 && 
                <div>
                    {/* <h1>Tickets en cours de traitement</h1> */}
                    { underHandling }
                </div>
            }           
            {/* {ticketsUnderHandling && ticketsUnderHandling.map(ticket => {
            // {tickets && tickets.ticketsUnderHandling && tickets.ticketsUnderHandling.map(ticket => {
                return <TicketItem ticket={ticket} key={ticket.id} status={"underHandling"}/>
            })} */}
            

            { activeButtonId === 2 && 
                <div>
                    {/* <h1>Tickets en attente</h1> */}
                    { notHandled } 
                </div>
            }       
            {/* {ticketsNotHandled && ticketsNotHandled.map(ticket => {
            // {tickets && tickets.ticketsNotHandled && tickets.ticketsNotHandled.map(ticket => {
                return <TicketItem ticket={ticket} key={ticket.id} status={"notHandled"}/>
            })} */}
            

            { activeButtonId === 3 && 
                <div>
                    {/* <h1>Tickets traités</h1> */}
                    { handled }
                </div>
            }   
            {/* {tickets && tickets.ticketsHandled && tickets.ticketsHandled.map(ticket => { */}
            {/* {ticketsHandled && ticketsHandled.map(ticket => {
                return <TicketItem ticket={ticket} key={ticket.id} status={"handled"}/>
            })} */}

            { activeButtonId === 4 && 
                <div>
                    { myOwnTickets }
                </div>
            }   
            
        </Fragment>
    )
};

export default Tickets;