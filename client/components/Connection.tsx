import React, { useEffect, useState } from 'react';
// import 'react-chat-widget/lib/styles.css';
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
import { getRoomName, getUsername } from '../utils/helpers';
import { Color } from '../utils/styles';
import Room from './Room';

interface CreateLinkData {
    socket: SocketIOClient.Socket,
    initiator: boolean;
}

function createLink(data: CreateLinkData) {
    const { socket, initiator } = data;
    const p = new SimplePeer({
        initiator,
        trickle: false,
    })

    p.on('signal', data => {
        socket.emit('signal', JSON.stringify(data));
    })


    p.on('connect', () => {
        console.log('CALL CONNECTED')
    })

    return p;
}

export const LinkContext = React.createContext<SimplePeer.Instance | null>(null);
export const RoomContext = React.createContext<string[]>([]);

const socket = io('http://sacalerts.com:3000', { upgrade: false, transports: ['websocket'] });

const Connection = () => {
    const [users, setUsers] = useState([]);
    const [link, setLink] = useState<SimplePeer.Instance | null>(null);

    useEffect(() => {
        const room = getRoomName();

        const me = getUsername();
        socket.emit('enter', room, me);

        socket.on('roomUpdated', setUsers);

        socket.on('initialize', () => {
            console.log('creating initiating link');
            const link = createLink({ socket, initiator: true });
            link.on('error', (err) => {
                console.log('ERROR destroying link', err);
                link.destroy();
                setLink(null);
            });
            setLink(link);
        });

        socket.on('signal', (sdp: string) => {
            console.log('received signal', link);
            if (!link) {
                const link = createLink({ socket, initiator: false });
                link.signal(sdp);
                link.on('error', (err) => {
                    console.log(err);
                    link.destroy();
                    setLink(null);
                });
                setLink(link);
            } else {
                link.signal(sdp);
            }
        });
        return () => {
            socket.off('roomUpdated')
            socket.off('initialize')
            socket.off('signal')
        }
    }, [link]);

    if (!link) {
        return (
            <div style={styles.loading}>
                <div style={{ padding: 40, backgroundColor: Color.BLUE2, borderRadius: 5, }}>
                    <p style={{ fontSize: 24 }}>
                        What would you like to be called?
                    </p>
                    <p style={{ textAlign: 'center' }}>
                        <input style={{ backgroundColor: Color.BLUE4, padding: 10, width: '80%', textAlign: 'center', fontSize: 20, border: `1px solid ${Color.BLUE3}` }} />
                    </p>
                </div>
            </div>

        )
    }

    return (
        <LinkContext.Provider value={link}>
            <RoomContext.Provider value={users}>
                <Room />
            </RoomContext.Provider>
        </LinkContext.Provider>
    )
}

const styles = {
    loading: {
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        background: Color.BLUE1,
        backgroundSize: '100%',
        backgroundPosition: 'center',
    }
}

export default Connection;