import React, { ChangeEvent, KeyboardEvent, useContext, useEffect, useRef, useState } from 'react';
import { getDefaultUsername, getRoomName, setDefaultUsername } from '../utils/helpers';
import { Color } from '../utils/styles';
import { LinkContext, RoomContext, SocketContext } from './Connection';

const Welcome = () => {
    const link = useContext(LinkContext);
    const room = useContext(RoomContext);
    const socket = useContext(SocketContext);
    const input = useRef(null);
    const [username, setUsername] = useState(getDefaultUsername());
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            if (input && input.current) {
                input.current.focus();
                input.current.select();
            }
        }, 0);
    }, [input]);

    const updateUsername = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= 20) {
            setUsername(e.target.value);
            setDefaultUsername(e.target.value);
        }
    }

    const keyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13 && username !== '') {
            updateFinished();
        }
    }

    const updateFinished = () => {
        setFinished(true);
        socket.emit('enter', getRoomName(), username);
    }

    if (finished) {
        return null;
    }

    return (
        <div style={styles.loading}>
            <div style={{ padding: 40, backgroundColor: Color.BLUE2, borderRadius: 5, }}>
                <p style={{ fontSize: 24 }}>
                    What would you like to be called?
                </p>
                <p style={{ textAlign: 'center', display: 'flex', justifyContent: 'horizontal' }}>
                    <input style={styles.input} value={username} onKeyDown={keyDown} onChange={updateUsername} ref={input} />
                    <button onClick={updateFinished} disabled={username === ''} style={{ fontSize: 20, padding: 20 }}>Join</button>
                </p>
            </div>
        </div>
    )
}

const styles = {
    loading: {
        position: 'absolute' as 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.8)',
        backgroundSize: '100%',
        backgroundPosition: 'center',
        zIndex: 100,
    },
    input: {
        backgroundColor: Color.BLUE4,
        padding: 10,
        width: '80%',
        textAlign: 'center' as 'center',
        fontSize: 20,
        border: `1px solid ${Color.BLUE3}`
    }
}


export default Welcome;