import React, { useContext } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import AuthContext from '../../store/auth-context';



import classes from './MainNavigation.module.css';


const MainNavigation = () => {
    const authCtx = useContext(AuthContext); 
    let navigate = useNavigate();

    const logoutHandler = () => {
        authCtx.logout();
        navigate('', { replace: true });
    };

    return (
        <header className={classes.header}>
            <h1>_insuline</h1>
            <nav className={classes.nav}>
                <ul>
                    {authCtx.isLoggedIn && (
                        <React.Fragment>
                            <li><NavLink to='/' className={navData => navData.isActive ? classes.active : '' }>Mes patients</NavLink></li>
                            <li><NavLink to='/indicateurs' className={navData => navData.isActive ? classes.active : '' }>Indicateurs</NavLink></li>
                            <li><NavLink to='/tickets' className={navData => navData.isActive ? classes.active : '' }>Mes tickets</NavLink></li>
                            <li><button onClick={logoutHandler}>Se deconnecter</button></li>
                            {/* <MenuButton /> */}
                        </React.Fragment>
                   
                    )}
                    {!authCtx.isLoggedIn && (
                        <React.Fragment>
                            {/* <MenuButton />
                            <MenuModal onClose={() => {}}>Se connecter</MenuModal> */}
                            <Button onClick={authCtx.showConnectForm}>Se connecter</Button> 
                        </React.Fragment>
                    )}
                </ul>
            </nav>
        </header>
    )
}

export default MainNavigation;