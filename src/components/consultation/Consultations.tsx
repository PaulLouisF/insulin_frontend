import React, { Fragment, useContext, useEffect, useLayoutEffect, useState } from "react";

import ConsultationBox from "./ConsultationBox";
import NewConsultation from "./NewConsultation";
import NewTicket from "../ticket/NewTicket";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import { transformDateLong } from "../../util/function";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro' 
import AuthContext from "../../store/auth-context";

import classes from './Consultations.module.css';
import { useLocation } from "react-router-dom";


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
    const [isCreateTicket, setIsCreateTicket] = useState<{openModal: boolean, consultationId: null | number}>({openModal: false, consultationId: null });
    // const [consultationId, setConsultationId] = useState<number>();
    const authCtx = useContext(AuthContext);
    //const [activeButtonId, setActiveButtonId] = useState<number>(-1);
    const [error, setError] = useState<any>();
    
    const consultations = props.patient.Consultations.sort(function(a, b) {return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();});


    interface stateType {
      state: { consultationId: number } 
   }
    let location = useLocation() as unknown as stateType; //WARNING  
    
    
    const [activeButtonId, setActiveButtonId] = useState<null | number>(null);

    useEffect(() => {
      
      if(consultations.length > 0) {
        const lastConsultationId = consultations[0]!.id;
        let selectedConsultationId = location.state?.consultationId || lastConsultationId; 
        setActiveButtonId(selectedConsultationId);
        handleClick(selectedConsultationId)
      } 
    }, [props])


    let lastConsultation;
    if (consultations.length > 0) {
      const timeLastConsultation = (new Date(Date.now()).setHours(0, 0, 0, 0) - new Date(consultations[0].created_at).setHours(0, 0, 0, 0))/(1000* 60 * 60*24)
      lastConsultation = <h3>La dernière consultation a eu lieu il y a {timeLastConsultation} jours</h3>
    } else {
      lastConsultation = <h3>Aucune consultation pour ce patient</h3>
    }
   
 
    const createConsultationHandler = () => {
        setIsCreateConsultation(true);
    };

    const closeConsultationHandler = () => {
        setIsCreateConsultation(false);
    };

    const createTicketHandler = (consultationId: number) => { 
      setIsCreateTicket({openModal: true, consultationId: consultationId}); 
    };

    const closeTicketHandler = () => {
        setIsCreateTicket({openModal: false, consultationId: null});
    };

    const onAddConsultationHandler = async (height: number, weight: number, report: string, patientId: number) => {

        //event.preventDefault(); //WARNING 
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/consultations', { 
          method: 'POST',
          body: JSON.stringify({
            height: height,
            weight: weight,
            report: report,
            patient_id: patientId
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + authCtx.token
          }
        });

        const responseData = await response.json();
            
        if (!response.ok) {;
            throw new Error(responseData.message);
        }
        setIsCreateConsultation(false);
      } catch (err:any) {
        // throw err;
        setError(err.message)
      }
    };



    const onAddTicketHandler = async (enteredQuestion: string, consultationId: number) => {
      //WARNING Set Parameter assignee in Ticket
      try {
          const response = await fetch(process.env.REACT_APP_BACKEND_URL +`/tickets`, {
              method: 'POST',
              body: JSON.stringify({
                question: enteredQuestion,
                consultation_id: consultationId,
              }),
              headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + authCtx.token
              }
          });

          if (!response.ok) {
              throw new Error('Something went wrong');
          }
          setIsCreateTicket({openModal: false, consultationId: null});
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
        console.log(refs[id])
        refs[id].current.scrollIntoView({
          behavior: 'smooth',
          block: 'start' ,
        });
        console.log(refs[id])
        //    refs[id].current.scroll({
        //   behavior: 'smooth',
        //   block: 'start' ,
        //   //top: 1000
        // });

        // refs[id].current.scrollIntoView({
        //   behavior: 'smooth',
        //   block: 'start' ,
        // });

        
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
        // console.log(arrayConsultationId)
        // console.log(activeButtonId)
        // console.log(window.scrollY)
        // console.log(window.innerHeight)
        // console.log(refs[2].current)
        // for(var i=0; i<consultations.length; i++) {
        //   console.log(refs[consultations[i].id].current.offsetTop)
          // if (window.scrollY < refs[consultations[i].id].current.offsetTop) {
          // if (activeButtonId>=0) { 
          if (activeButtonId) { 
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
          {error && <Modal onClose={() => {setError(null)}}>{error}</Modal>}
          {isCreateConsultation === true && <Modal onClose={closeConsultationHandler}><NewConsultation onAddConsultation={onAddConsultationHandler} onClose={closeConsultationHandler} patientId={props.patient.id}/></Modal>}
          {isCreateTicket.openModal && isCreateTicket.consultationId && <Modal onClose={closeTicketHandler}>
            <NewTicket onAddTicket={onAddTicketHandler} onClose={closeTicketHandler} consultationId={isCreateTicket.consultationId}/>
          </Modal>}
          <div className={classes.consultation_create}>
            {/* <h3>La dernière consultation a eu lieu il y a {timeLastConsultation} jours</h3> */}
            {lastConsultation}
            {/* {consultations.length > 0 ? <h3>La dernière consultation a eu lieu il y a {timeLastConsultation} jours</h3> : <h3>Aucune consultation pour ce patient</h3> }
        */}


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
                    <p><FontAwesomeIcon icon={solid('question')} /> Question : {consultation.Ticket.question}</p>
                    {consultation.Ticket.Answer &&
                      <p><FontAwesomeIcon icon={solid('reply')} /> Réponse par {consultation.Ticket.Answer.User.first_name} {consultation.Ticket.Answer.User.last_name} : {consultation.Ticket.Answer.answer}</p>
                    }
                    </ConsultationBox>
                }
                {
                  !consultation.Ticket && 
                  <div className={classes.bloc_button}>
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