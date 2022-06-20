import { Fragment, useState, useContext } from "react";
import Modal from "../components/UI/Modal";
import AuthPage from "./AuthPage";
import AuthContext from "../store/auth-context";
import ReactLogo from '../assets/Banner.svg';
import classes from './HomePage.module.css'
import MenuModal from "../components/UI/MenuModal";
import { useLocation } from "react-router-dom";

const HomePage = () => {
    interface stateType {
        state: { from: { pathname: string } } 
     }

    const authCtx = useContext(AuthContext); 
    let location = useLocation() as unknown as stateType; //WARNING
    console.log(location)
    let from = location.state?.from?.pathname || "/";
    //let from = location.state.from.pathname

    return (

        <div className={classes.container}>
            {authCtx.isWantAuth && <Modal onClose={authCtx.hideConnectForm}><AuthPage from={from} /></Modal>}
            {/* <MenuModal onClose={() => {}}>toto</MenuModal> */}

            <img className={classes.image} src={ReactLogo} alt="React Logo" />
            <div className={classes.center_text}>
            <h1>_insuline vous permet de suivre des patients où qu'ils soient</h1>
            </div>
        </div>
        

    );
}

export default HomePage;