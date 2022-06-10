import { Fragment, useEffect, useState } from "react"
import TicketItem from "../components/ticket/TicketItem";

import classes from './Tickets.module.css'; 


const Tickets = () => {
    interface ticketObject {
        id: string;
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
                last_name: string
            }
        }       
    }

    const [activeButtonId, setActiveButtonId] = useState<number>(1);
    const [ticketsHandled, setTicketsHandled] = useState<ticketObject[]>([]); 
    const [ticketsUnderHandling, setTicketsUnderHandling] = useState<ticketObject[]>([]); 
    const [ticketsNotHandled, setTicketsNotHandled] = useState<ticketObject[]>([]);

    // const[tickets, setTickets] = useState<{
    //     ticketsHandled: ticketObject[],
    //     ticketsUnderHandling: ticketObject[],
    //     ticketsNotHandled: ticketObject[],
    // }>()
    
    useEffect(() => { 
        try {
            const fetchTicketsData = async () => {
                console.log('yoo')
                const response = await fetch(`http://localhost:5000/api/tickets`);
                if (!response.ok) {
                    throw new Error('Could not fetch data');
                }
                const responseData = await response.json();
                const ticketsUnderHandling = responseData.tickets.filter((ticket: { TicketPile: any; }) => ticket.TicketPile);
                const ticketsHandled = responseData.tickets.filter((ticket: { is_closed: boolean; }) => ticket.is_closed === true);
                const ticketsNotHandled = responseData.tickets.filter((ticket: { TicketPile: any; is_closed: boolean; }) => !ticket.TicketPile && !ticket.is_closed);
                setTicketsHandled(ticketsHandled);
                setTicketsUnderHandling(ticketsUnderHandling);
                setTicketsNotHandled(ticketsNotHandled);
                // setTickets({
                //     ticketsHandled: ticketsHandled,
                //     ticketsUnderHandling: ticketsUnderHandling,
                //     ticketsNotHandled: ticketsNotHandled,
                // })
                return responseData;     
                
            }
            fetchTicketsData();
        } catch (error) {
            //Handle error
        }       
    }, []);


    let notHandled;
    if (ticketsNotHandled.length > 0) {
        notHandled = ticketsNotHandled.map(ticket => {
            return <TicketItem ticket={ticket} key={ticket.id} status={"notHandled"}/>
        })
    } else {
        notHandled = <h3>Pas de ticket</h3>
    }

    let underHandling;
    if (ticketsUnderHandling.length > 0) {
        underHandling = ticketsUnderHandling.map(ticket => {
            return <TicketItem ticket={ticket} key={ticket.id} status={"underHandling"}/>
        })
    } else {
        underHandling = <h3>Pas de ticket</h3>
    }

    let handled; 
    if (ticketsHandled.length > 0) {
        handled = ticketsHandled.map(ticket => {
            return <TicketItem ticket={ticket} key={ticket.id} status={"handled"}/>
        })
    } else {
        handled = <h3>Pas de ticket</h3>
    }

    return (
        <Fragment>
            <div className={classes.ticket_menu}>
                <h2>Tickets</h2>
                <div className={classes.tickets_menu_buttons}>
                    <button className={`${classes.tickets_menu_button} ${1 === activeButtonId ? classes.active : ''}`} type="button" onClick={() => setActiveButtonId(1)}>En cours ({ticketsUnderHandling.length})</button>
                    <button className={`${classes.tickets_menu_button} ${2 === activeButtonId ? classes.active : ''}`} type="button" onClick={() => setActiveButtonId(2)}>En attente ({ticketsNotHandled.length})</button>
                    <button className={`${classes.tickets_menu_button} ${3 === activeButtonId ? classes.active : ''}`} type="button" onClick={() => setActiveButtonId(3)}>Traités ({ticketsHandled.length})</button>
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
            
        </Fragment>
    )
};

export default Tickets;