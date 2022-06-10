import React from 'react';

type AuthContextObj = {
    token: string,
    isLoggedIn: boolean,
    login: (token: string) => void,
    logout: () => void
}

const AuthContext = React.createContext<AuthContextObj>({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

export default AuthContext;