import React from 'react';
import io from 'socket.io-client';
import Connection from './components/Connection';
import './css/main.css';

const socket = io('wss://sacalerts.com:3000', { upgrade: false, transports: ['websocket'] });

const App = () => {
    return <Connection socket={socket} />
}

export default App;