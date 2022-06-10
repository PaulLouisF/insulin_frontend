import React, { Fragment, useRef, useState } from "react";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current!.value;
        const enteredPassword = passwordInputRef.current!.value;
        
        //Add validation

        setIsLoading(true);
        let url;
        if (isLogin) { 
            url = `http://localhost:5000/api/auth/login`
        } else {
            url = `http://localhost:5000/api/auth/signup`
        }

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: enteredEmail,
                password: enteredPassword
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setIsLoading(true);
        if (!response.ok) {
            //handle error
        }
        const responseData = await response.json();
        const expirationTime = new Date(new Date().getTime() + +responseData.expiresIn * 1000);
        //



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
                <div>
                    <button type="submit">{isLogin ? 'Se connecter' : 'Créer un compte'}</button>
                    <button type="button" onClick={switchAuthModeHandler}>{isLogin ? 'Créer un compte' : 'Se connecter'}</button>
                </div>
            </form>
        </Fragment>
    );
};

export default AuthPage;