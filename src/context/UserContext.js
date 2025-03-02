import React, { createContext, useState, useContext, useEffect } from 'react'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    // const [apiHost, setApiHost] = useState('https://infra-track-backend.vercel.app/');
    const [apiHost, setApiHost] = useState('http://localhost:8080/');

    const saveToken = (token) => {
        setToken(token);
    }
    const saveUserDetails = (userDetails) => {
        setUserDetails(userDetails);
    }

    const saveLogin = (login) => {
        setLoggedIn(login);
    }

    useEffect(() => {
        let user = localStorage.getItem('user');
        // // console.log("HELLO FROM USER CONTEXT");
        if (user) {
            user = JSON.parse(user);
            setUserDetails(user);
            setLoggedIn(true);
        }

        let token = localStorage.getItem('token');
        if (token) {
            setToken(token);
            // setLoggedIn(true);
        }
    }, [])

    return (
        <UserContext.Provider value={{ token, saveToken, apiHost, saveUserDetails, saveLogin, loggedIn, userDetails }}>
            {children} {/* Render the children here */}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
}