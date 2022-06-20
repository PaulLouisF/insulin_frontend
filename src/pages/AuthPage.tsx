import React, { Fragment, useRef, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";

import AuthContext from "../store/auth-context";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro' 
import classes from './AuthPage.module.css'

const AuthPage = (props: {from: string}) => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const firstNameInputRef = useRef<HTMLInputElement>(null);
    const lastNameInputRef = useRef<HTMLInputElement>(null);
    const [isDoctor, setIsDoctor] = useState(true);
    const authCtx = useContext(AuthContext);
    let navigate = useNavigate();
    const [error, setError] = useState<any>();

    const isDoctorChangeHandler = () => {
        setIsDoctor((prevState) => { return !prevState }); 
    }

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(isLogin)

        const enteredEmail = emailInputRef.current!.value;
        const enteredPassword = passwordInputRef.current!.value;
        
        
        //Add validation

        setIsLoading(true);
        let url;
        let userData;
        if (isLogin) { 
            url = process.env.REACT_APP_BACKEND_URL + '/auth/login';
            userData = {
                email: enteredEmail,
                password: enteredPassword
            }
        } else {
            url = process.env.REACT_APP_BACKEND_URL + '/auth/signup';
            const enteredFirstName = firstNameInputRef.current!.value;
            const enteredLastName = lastNameInputRef.current!.value;
            userData = {
                email: enteredEmail,
                password: enteredPassword,
                first_name: enteredFirstName,
                last_name: enteredLastName,
                is_doctor: isDoctor
            }
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                // body: JSON.stringify({
                //     email: enteredEmail,
                //     password: enteredPassword
                // }),
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setIsLoading(true);
            const responseData = await response.json();
            if (!response.ok) {
                // throw new Error('Something went wrong');
                throw new Error(responseData.message);
            }
            
            const expirationTime = new Date(new Date().getTime() + +responseData.expiresIn * 1000 ); //WARNING
            authCtx.login(responseData.token, expirationTime.toISOString(), responseData.user_id);
            
            
            navigate(props.from, { replace: true });
        } catch (err) {
            // alert(err)
            setError(err)
        }
    }; 

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    }; 

    return(
        <Fragment>
            <div  className={classes.center}>
            <h1>{isLogin ? 'Se connecter': 'Créer un compte'}</h1>
            </div>
            <form className={classes.form} onSubmit={submitHandler}>
                {error && <div className={classes.error_container}>
                    <FontAwesomeIcon icon={solid('circle-exclamation')} className={classes.error_icon} />
                    <div>
                        <p><b>Merci de réessayer</b></p>
                        <p>Le mot de passe ou l'adresse email que vous avez saisi est incorrect. Réessayez ou sélectionnez une autre option de connexion.</p>
                    </div>
                </div>}
                {!isLogin && (
                    <div className={classes.group_name}>
                        <div className={classes.bloc_label_input}>
                            <label htmlFor="firstName">Prénom</label>
                            <input type="text" id="firstName" required ref={firstNameInputRef} />
                        </div>
                
            
                        <div className={classes.bloc_label_input}>
                            <label htmlFor="lastName">Nom</label>
                            <input type="text" id="lastName" required ref={lastNameInputRef} />
                        </div>
                    </div>
                )}
                <div  className={classes.bloc_label_input}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email"  required ref={emailInputRef} />
                </div>
                <div className={classes.bloc_label_input}>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id="password" required ref={passwordInputRef} />
                </div>
                
                {!isLogin && (
                    <div >
                        <label htmlFor="isDoctor">Fonction</label>
                        <div className={classes.group_name}>
                        <h3>
                        <input type="checkbox" checked={isDoctor} name="controlled" onChange={isDoctorChangeHandler}/>
                        Medecin
                    </h3>
                    <h3>
                        <input type="checkbox" checked={!isDoctor} name="controlled" onChange={isDoctorChangeHandler}/>
                        Autre professionnel de santé
                    </h3>
                    </div>
                        
                    </div>
                )}
                <div className={classes.container_button}>
                    {/* <div> */}
                    <Button type="submit">{isLogin ? 'Se connecter' : 'Créer un compte'}</Button>
                    {/* </div>
                    <div> */}
                    <div className={classes.container_lign}>
                    {/* <hr style={{
                        background: 'black',
                        color: 'black',
                        //   borderColor: 'lime',
                        height: '0.5px',
                        width: 'calc(100% - 30px)'
                    }}/> */}
                    <hr className={classes.lign}/>
                    <h3>ou</h3>
                    <hr className={classes.lign}/>

                    </div>
                     
                    <Button type="button" onClick={switchAuthModeHandler}>{isLogin ? 'Créer un compte' : 'Se connecter'}</Button>
                    {/* </div> */}
                </div>

            </form>
        </Fragment>
    );
};

export default AuthPage;