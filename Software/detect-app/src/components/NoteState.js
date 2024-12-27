import React, { useState, useEffect } from 'react';
import NoteContext from './NoteContext';

const NoteState = (props) => {
    // Retrieve initial state from localStorage or default to an empty string
    const [counter, setCounter] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);
    const [globalUsername, setGLobalUsername] = useState(() => {
        return localStorage.getItem('globalUsername') || ''; // Initialize from localStorage
    });

    // Sync globalUsername with localStorage
    useEffect(() => {
        if (globalUsername) {
            localStorage.setItem('globalUsername', globalUsername);
            setLoggedIn(true); // Mark the user as logged in if username exists
        } else {
            localStorage.removeItem('globalUsername');
            setLoggedIn(false); // Mark the user as logged out if username is cleared
        }
    }, [globalUsername]);

    return (
        <NoteContext.Provider value={{ counter, setCounter, loggedIn, setLoggedIn, globalUsername, setGLobalUsername }}>
            {props.children}
        </NoteContext.Provider>
    );
};

export default NoteState;
