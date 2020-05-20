import React, { useContext, useEffect, useState } from 'react';
import { addResponseMessage, toggleMsgLoader, Widget } from 'react-chat-widget';
import '../../css/chat.css';
import { DataType } from '../../types/chat';
import { LinkContext, RoomContext } from '../Connection';

const Chat = () => {
    const link = useContext(LinkContext);
    const room = useContext(RoomContext);
    const [typing, setTyping] = useState(false);

    useEffect(() => {
        let timeout;
        let typing = false;
        const onData = (incoming) => {
            try {
                const data = JSON.parse(incoming.toString());
                if (data.type === DataType.CHAT) {
                    addResponseMessage(data.payload);
                    if (typing) {
                        toggleMsgLoader();
                        typing = false;
                    }
                } else if (data.type === DataType.TYPING_IN_CHAT) {
                    if (!typing) {
                        console.log('toggle msg load')
                        toggleMsgLoader();
                    }
                    typing = true;
                    window.clearTimeout(timeout);
                    timeout = window.setTimeout(() => {
                        if (typing) {
                            toggleMsgLoader();
                            typing = false;
                        }
                    }, 2000)
                }
            } catch (e) { }
        }
        if (link) {
            link.on('data', onData)
            addResponseMessage(`Connected! Type here to send me a message...`);
        }
        return () => {
            if (link) {
                link.removeListener('data', onData);
            }
        }
    }, [link])

    const handleNewUserMessage = (message: string) => {
        link.send(JSON.stringify({ type: DataType.CHAT, payload: message }));
    }

    const indicateTyping = () => {
        if (link) {
            link.send(JSON.stringify({ type: DataType.TYPING_IN_CHAT }));
        }
    }

    return (
        <Widget
            handleNewUserMessage={handleNewUserMessage}
            title={`Chat with ${room.length === 2 ? room[1] : ''}`}
            subtitle=''
            fullScreenMode={true}
            launcher={(open) => null}
            handleTextInputChange={indicateTyping}
        />
    );
}

export default Chat;