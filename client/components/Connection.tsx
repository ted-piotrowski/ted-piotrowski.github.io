import React, { useEffect, useState } from 'react';
// import 'react-chat-widget/lib/styles.css';
import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
import { getDefaultUsername, getRoomName } from '../utils/helpers';
import Room from './Room';
import Welcome from './Welcome';

const socket = io('wss://sacalerts.com:3000', { upgrade: false, transports: ['websocket'] });

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
export const SocketContext = React.createContext<SocketIOClient.Socket>(socket);

const Connection = () => {
    const [users, setUsers] = useState([]);
    const [link, setLink] = useState<SimplePeer.Instance | null>(null);

    useEffect(() => {
        const room = getRoomName();
        const me = getDefaultUsername();
        socket.emit('enter', room, me);

        socket.on('roomUpdated', (users: string[], me: string) => {
            // convention is for local user to always come first
            setUsers([me, ...users.filter(user => user !== me)]);
        });

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

    return (
        <SocketContext.Provider value={socket}>
            <LinkContext.Provider value={link}>
                <RoomContext.Provider value={users}>
                    <Room />
                    <Welcome />
                </RoomContext.Provider>
            </LinkContext.Provider>
        </SocketContext.Provider >
    )
}

export default Connection;