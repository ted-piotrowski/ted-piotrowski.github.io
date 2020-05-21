import React, { useEffect } from 'react';
import Connection from './components/Connection';
import './css/main.css';
import { generateWords } from './utils/helpers';

const App = () => {
    useEffect(() => {
        if (window.location.pathname === '/') {
            window.location.href = `/${generateWords(3)}`;
        }
    }, [])

    if (window.location.pathname === '/') {
        return null;
    }
    return <Connection />
}

export default App;