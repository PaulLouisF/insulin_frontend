import React, { useCallback, useEffect, useState } from 'react';

let logoutTimer: NodeJS.Timeout | undefined;

type AuthContextObj = {
    token: string | null | undefined,
    userId: number | null | undefined,
    isLoggedIn: boolean,
    login: (token: string, expirationTime: string, userId: number) => void,
    logout: () => void
}

const AuthContext = React.createContext<AuthContextObj>({
    token: '',
    userId: null,
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

const calculateRemainingTime = (expirationTime: string ) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');
  const userId = localStorage.getItem('userId');

  let remainingTime = 0;
  if (storedExpirationDate) {
    remainingTime = calculateRemainingTime(storedExpirationDate);
  }
  

  if (remainingTime <= 3600) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userId');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
    userId: userId
  };
};

export const AuthContextProvider = (props: { children: any }) => {
  const tokenData = retrieveStoredToken();
  
  let initialToken;
  let initialUserId;
  
  if (tokenData) {
    initialToken = tokenData.token;
  }
  if (tokenData && tokenData.userId) {
    initialUserId = parseInt(tokenData.userId)
  }

  const [token, setToken] = useState(initialToken); 
  const [userId, setUserId] = useState<number | null | undefined>(initialUserId); 

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {  
    setToken(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('userId');

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token: string, expirationTime: string, userId: number) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);
    localStorage.setItem('userId', userId.toString());

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => { 
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    userId: userId,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


