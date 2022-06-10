import MainNavigation from "./MainNavigation";

import classes from './Layout.module.css';

const Layout = (props: any) => {
    return (
        <div>
            <MainNavigation />
            <div className={classes.layout_container}>
                {props.children}
            </div>
        </div>
    );
}

export default Layout;