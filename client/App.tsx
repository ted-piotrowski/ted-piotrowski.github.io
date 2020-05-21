import React, { useEffect, useState } from 'react';
import Connection from './components/Connection';
import './css/main.css';
import { generateWords } from './utils/helpers';

const App = () => {
    const [room, setRoom] = useState(null);
    useEffect(() => {
        if (window.location.pathname === '/') {
            history.replaceState(null, document.title, `/${generateWords(3)}`);
        }
        setRoom(true);
    }, [])

    if (!room) {
        return null;
    }
    return <Connection />
}

export default App;