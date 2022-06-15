import React, { Fragment, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../store/auth-context";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const firstNameInputRef = useRef<HTMLInputElement>(null);
    const lastNameInputRef = useRef<HTMLInputElement>(null);
    const [isDoctor, setIsDoctor] = useState(true);
    const authCtx = useContext(AuthContext);
    let navigate = useNavigate();

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
            if (!response.ok) {
                throw new Error('Something went wrong');
            }
            const responseData = await response.json();
            const expirationTime = new Date(new Date().getTime() + +responseData.expiresIn * 1000 ); //WARNING
            authCtx.login(responseData.token, expirationTime.toISOString(), responseData.user_id);
            navigate(`/patients`);
        } catch (err) {
            alert(err)
        }
    }; 

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    }; 

    return(
        <Fragment>
            <h1>{isLogin ? 'Login': 'Sign Up'}</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" required ref={emailInputRef} />
                </div>
                <div>
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password" id="password" required ref={passwordInputRef} />
                </div>
                {!isLogin && (
                    <div>
                        <label htmlFor="firstName">Prénom</label>
                        <input type="text" id="firstName" required ref={firstNameInputRef} />
                    </div>
                )}
                {!isLogin && (
                    <div>
                        <label htmlFor="lastName">Nom</label>
                        <input type="text" id="lastName" required ref={lastNameInputRef} />
                    </div>
                )}
                {!isLogin && (
                    <div>
                        <label htmlFor="isDoctor">Fonction</label>
                        <h3>
                        <input type="checkbox" checked={isDoctor} name="controlled" onChange={isDoctorChangeHandler}/>
                        Medecin
                    </h3>
                    <h3>
                        <input type="checkbox" checked={!isDoctor} name="controlled" onChange={isDoctorChangeHandler}/>
                        Autre professionnel de santé
                    </h3>
                        
                    </div>
                )}
                <div>
                    <button type="submit">{isLogin ? 'Se connecter' : 'Créer un compte'}</button>
                    <button type="button" onClick={switchAuthModeHandler}>{isLogin ? 'Créer un compte' : 'Se connecter'}</button>
                </div>
                
            </form>
        </Fragment>
    );
};

export default AuthPage;