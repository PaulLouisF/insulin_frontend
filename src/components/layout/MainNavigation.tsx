import { NavLink } from "react-router-dom";

import classes from './MainNavigation.module.css';

const MainNavigation = () => {
    return (
        <header className={classes.header}>
            <h1>_insuline</h1>
            <nav className={classes.nav}>
                <ul>
                    <li><NavLink to='/patients' className={navData => navData.isActive ? classes.active : '' }>Mes patients</NavLink></li>
                    <li><NavLink to='/indicateurs' className={navData => navData.isActive ? classes.active : '' }>Indicateurs</NavLink></li>
                    <li><NavLink to='/tickets' className={navData => navData.isActive ? classes.active : '' }>Mes tickets</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}

export default MainNavigation;