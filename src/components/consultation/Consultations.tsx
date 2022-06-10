import React, { Fragment, useEffect, useState } from "react";

import ConsultationBox from "./ConsultationBox";
import NewConsultation from "./NewConsultation";
import NewTicket from "../ticket/NewTicket";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import { transformDateLong } from "../../util/function";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro' 

import classes from './Consultations.module.css';


interface patientObject {
    patient: {
    id: number;
    first_name: string;
    last_name: string;
    is_man: boolean;
    birth_date: string;
    Consultations: [{
        id: number;
        height: number;
        weight: number;
        initial_report: string;
        created_at: string;
        User: {
            first_name: string;
            last_name: string;
            is_doctor: boolean;
        },
        Ticket: {
          question: string;
          is_closed: boolean;
          Answer: {
            answer: string;
            User: {
              first_name: string;
              last_name: string
            }
          }
        }
    }]
}}

const Consultations = (props: patientObject) => { //WARNING sur any
    const [isCreateConsultation, setIsCreateConsultation] = useState<boolean>(false);
    // const [isCreateTicket, setIsCreateTicket] = useState<boolean>(false);
    const [isCreateTicket, setIsCreateTicket] = useState<{openModal: boolean, consultationId: number}>({openModal: false, consultationId: 0});
    // const [consultationId, setConsultationId] = useState<number>();
    
    const consultations = props.patient.Consultations.sort(function(a, b) {return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();});

    let lastConsultation = <h3>Aucune consultation pour ce patient</h3>

    if(consultations.length > 0) {
      const timeLastConsultation = (new Date(Date.now()).setHours(0, 0, 0, 0) - new Date(consultations[0].created_at).setHours(0, 0, 0, 0))/(1000* 60 * 60*24)
      lastConsultation = <h3>La dernière consultation a eu lieu il y a {timeLastConsultation} jours</h3>
    } 

    // useEffect(() => {
    //   console.log(consultations)
    //   setActiveButtonId(consultations[0].id)
    //   console.log(activeButtonId)
    // }, [])

    const [activeButtonId, setActiveButtonId] = useState<number>(consultations[0].id);
   

    const createConsultationHandler = () => {
        setIsCreateConsultation(true);
    };

    const closeConsultationHandler = () => {
        setIsCreateConsultation(false);
    };

    const createTicketHandler = (consultationId: number) => { 
      setIsCreateTicket({openModal: true, consultationId: consultationId}); 
      // setConsultationId(consultationId);
    };

    const closeTicketHandler = () => {
        setIsCreateTicket({openModal: false, consultationId: 0});
    };

    // const transformDate = (date: string) => {
    //   const formatedDate = new Date(date);
    //   return formatedDate.toLocaleDateString("fr-FR", { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
    // };

    const onAddConsultationHandler = (
      height: number, 
      weight: number, 
      report: string,
      patientId: number) => {

        fetch(`http://localhost:5000/api/consultations`, {
          method: 'POST',
          body: JSON.stringify({
            height: height,
            weight: weight,
            report: report,
            patient_id: patientId
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setIsCreateConsultation(false); //WARNING UNHANDLE if error
    };



    const onAddTicketHandler = async (enteredQuestion: string, consultationId: number) => {
      //WARNING Set Parameter assignee in Ticket
      try {
          const response = await fetch(`http://localhost:5000/api/tickets`, {
              method: 'POST',
              body: JSON.stringify({
                question: enteredQuestion,
                consultation_id: consultationId,
                user_id: 2, //WARNING AUTH
              }),
              headers: {
              'Content-Type': 'application/json'
              }
          });
          //WARNING no real management of error
          if (!response.ok) {
              // console.log(responseData)
              throw new Error('Something went wrong');
          }
          // navigate(`/patients/${ticket.Consultation.patient_id}}/consultations`, { replace: true });
      } catch (err:any) {
          // throw err;
          // setError(err.message)
      }
  };
    
    const refs = props.patient.Consultations.reduce((acc: any, value) => {
        acc[value.id] = React.createRef();
        return acc;
      }, {});

      const arrayConsultationId = consultations.map(consultation => consultation.id)

      const handleClick = (id: number) => {
        refs[id].current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        // console.log(refs[id].current.offsetTop)
        setActiveButtonId((prevState) => {return id});
        console.log(activeButtonId)
      }

      // let arrayRefs: number[] = [];
      // if (consultations.length > 0 ) {
      //   consultations.map(consultation => {
      //     console.log(refs[consultation.id])
      //     arrayRefs.push(refs[consultation.id].current.offsetTop)
      //   })
      // }     
      

      // console.log(arrayRefs)

      // const refsmenu = props.patient.Consultations.reduce((acc: any, value) => {
      //   acc[value.id] = React.createRef();
      //   return acc;
      // }, {});

      // const onView = (id: number) => {

      //   setActiveButtonId(id);
      // }
      const handleClickOnConsultation= (id: number) => {
        setActiveButtonId((prevState) => {return id});
      }

      // const [offset, setOffset] = useState(0);

    // useEffect(() => {
    //     const onScroll = () => setOffset(window.pageYOffset);
    //     // clean up code
    //     window.removeEventListener('scroll', onScroll);
    //     window.addEventListener('scroll', onScroll, { passive: true });
    //     return () => window.removeEventListener('scroll', onScroll);
    // }, []);

    // const hiddenRef = useRef();
    
    // useEffect(() => {
    //     window.addEventListener('scroll', scrollHandler);
    //     return () => window.removeEventListener('scroll', scrollHandler); 
    // }, []);
    
    const scrollHandler = () => {
        console.log(arrayConsultationId)
        console.log(activeButtonId)
        console.log(window.scrollY)
        console.log(window.innerHeight)
        // console.log(refs[2].current)
        // for(var i=0; i<consultations.length; i++) {
        //   console.log(refs[consultations[i].id].current.offsetTop)
          // if (window.scrollY < refs[consultations[i].id].current.offsetTop) {
          if (activeButtonId>=0) { 
            const index = arrayConsultationId.findIndex((element) => element = activeButtonId);
            console.log(index)
            if (window.scrollY < refs[activeButtonId].current.offsetTop) {
              if (index === 0 ) {
                setActiveButtonId(prevState => arrayConsultationId[0])
              } else {
                setActiveButtonId(prevState => arrayConsultationId[index-1])
              }
              
              //setActiveButtonId(Math.max(0, activeButtonId-1))
              //setActiveButtonId((prevState) => { return Math.max(0, prevState-1)})
            }
            if (window.scrollY > refs[activeButtonId].current.offsetTop) {
              //setActiveButtonId(Math.min(consultations.length-1, activeButtonId+1))
              if (index === arrayConsultationId.length - 1) {
                setActiveButtonId(prevState => arrayConsultationId[arrayConsultationId.length-1])
              } else {
                setActiveButtonId(prevState => arrayConsultationId[index+1])
              }
              // setActiveButtonId((prevState) => { return Math.min(consultations.length-1, prevState+1)})
             
            }
        }
        // }

        // if(window.pageYOffset + window.innerHeight >= refs.current.offsetTop)
        //     console.log(`Hidden element is now visible`);
        
    }


    return (
        <Fragment>
          {isCreateConsultation && <Modal onClose={closeConsultationHandler}><NewConsultation onAddConsultation={onAddConsultationHandler} patientId={props.patient.id}/></Modal>}
          {isCreateTicket.openModal && <Modal onClose={closeTicketHandler}>
            <NewTicket onAddTicket={onAddTicketHandler} consultationId={isCreateTicket.consultationId}/>
          </Modal>}
          <div className={classes.consultation_create}>
            {/* <h3>La dernière consultation a eu lieu il y a {timeLastConsultation} jours</h3> */}
            {lastConsultation}
            <Button onClick={createConsultationHandler}>Nouvelle consultation</Button>
          </div>
          <div className={classes.consultations_container}>
            <div>
            <ul className={classes.consultation_container_index}>
                {/* {props.patient.Consultations.map((consultation) => ( */}
                {consultations.map((consultation) => (
                <li 
                  key={consultation.id}
                 
                  // ref={refsmenu[consultation.id]}
                  >
                    {/* <button className={classes.button_consultations } type="button" onClick={() => handleClick(consultation.id)}> */}
                    {/* <button className={`${classes.button_consultations} ${consultation.id === activeButtonId ? classes.active : ''}`} type="button" onClick={() => handleClick(consultation.id)}> */}
                    <button className={`${classes.button_consultations} ${consultation.id  === activeButtonId ? classes.active : ''}`} type="button" onClick={() => handleClick(consultation.id)}>
                        {/* {`${new Date(consultation.created_at).getDate()}/${new Date(consultation.created_at).getMonth() + 1}/${new Date(consultation.created_at).getFullYear()}`} */}
                        {transformDateLong(consultation.created_at)}
                    </button>
                </li>
                ))}
            </ul>
            </div>
          

      <ul>
        {/* {props.patient.Consultations.map((consultation) => ( */}
        {consultations.map((consultation) => (
          <li
            key={consultation.id}
            // ref={refs[consultation.id]}
            ref={refs[consultation.id]}
            // style={{ height: '250px', border: '1px solid black' }}
          >
            <div  className={classes.consultation_container} onFocus ={() =>handleClickOnConsultation(consultation.id)}>
                <div className={classes.consultation_container_banner}>
                    <p>{`Consultation réalisée par ${consultation.User.is_doctor ? 'Dr' : ''} ${consultation.User.first_name} ${consultation.User.last_name}`}</p>
                    <p>{transformDateLong(consultation.created_at)}</p>
                </div>
                <ConsultationBox title='POIDS ET MESURES'>
                    <div className={classes.consultation_box_data}>
                        <p><FontAwesomeIcon icon={solid('ruler')} /> {consultation.height} cm</p>
                        <p><FontAwesomeIcon icon={solid('weight-scale')} /> {consultation.weight} kg</p>
                    </div>
                </ConsultationBox>
                <ConsultationBox title='COMPTE RENDU DE CONSULTATION'>
                    <p>{consultation.initial_report}</p>
                </ConsultationBox>
                {consultation.Ticket &&
                  <ConsultationBox title='AVIS D UN SPECIALISTE'>
                    <p>Question : {consultation.Ticket.question}</p>
                    {consultation.Ticket.Answer &&
                      <p>Réponse par {consultation.Ticket.Answer.User.first_name} {consultation.Ticket.Answer.User.last_name} : {consultation.Ticket.Answer.answer}</p>
                    }
                    </ConsultationBox>
                }
                {
                  !consultation.Ticket && 
                  <div>
                    <Button type="button" onClick={() => createTicketHandler(consultation.id)}>Demander l'avis d un specialiste</Button>
                  </div> 
                }
                
                
            </div>
          </li>
        ))}
      </ul>
      </div>
      </Fragment>
    );
}

export default Consultations;