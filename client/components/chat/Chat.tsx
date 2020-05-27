import isUrl from 'is-url';
import React, { useContext, useEffect, useState } from 'react';
import { addResponseMessage, deleteMessages, toggleMsgLoader, Widget } from 'react-chat-widget';
import '../../css/chat.css';
import { DataType } from '../../types/chat';
import { playSound } from '../../utils/helpers';
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
                    playSound();
                    addResponseMessage(data.payload);
                    if (typing) {
                        toggleMsgLoader();
                        typing = false;
                    }
                } else if (data.type === DataType.TYPING_IN_CHAT) {
                    if (!typing) {
                        toggleMsgLoader();
                        typing = true;
                    }
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
            (document.querySelector('.rcw-send') as HTMLButtonElement).disabled = false;
            link.on('data', onData)
            deleteMessages(1, 'welcome');
            addResponseMessage(`🥳 Someone joined! Send them a message...`);
        } else {
            addResponseMessage(`👋 Invite someone to join you by sending them this url: \`${window.location.href}\``, 'welcome');
            (document.querySelector('.rcw-send') as HTMLButtonElement).disabled = true;
        }
        return () => {
            if (link) {
                link.removeListener('data', onData);
            }
        }
    }, [link])

    const handleNewUserMessage = (message: string) => {
        if (link) {
            if (isUrl(message)) {
                link.send(JSON.stringify({ type: DataType.CHAT, payload: `[${message}](${message})` }));
            } else if (isUrl(`http://${message}`)) {
                link.send(JSON.stringify({ type: DataType.CHAT, payload: `[${message}](http://${message})` }));
            } else {
                link.send(JSON.stringify({ type: DataType.CHAT, payload: message }));
            }
        }
    }

    const indicateTyping = () => {
        if (link) {
            link.send(JSON.stringify({ type: DataType.TYPING_IN_CHAT }));
        }
    }

    const title = room.length === 2 ? `Chat with ${room[1]}` : 'Chat'
    return (
        <Widget
            handleNewUserMessage={handleNewUserMessage}
            title={title}
            subtitle=''
            fullScreenMode={true}
            launcher={(open) => null}
            handleTextInputChange={indicateTyping}
        />
    );
}

export default Chat;