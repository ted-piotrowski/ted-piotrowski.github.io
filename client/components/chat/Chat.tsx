import React, { useContext, useEffect } from 'react';
import { addResponseMessage, Widget } from 'react-chat-widget';
import '../../css/chat.css';
import { getUsername } from '../../utils/helpers';
import { LinkContext, RoomContext } from '../Connection';

const Chat = () => {
    const link = useContext(LinkContext);
    const room = useContext(RoomContext);

    const me = getUsername();

    useEffect(() => {
        link.on('data', (data) => { addResponseMessage(data.toString()) })
        const name = room.join('###').replace(me, '').replace('###', '');
        addResponseMessage(`Connected successfully. Send a message to **${name}** here or enable the microphone to speak.`);
    }, [link])

    const handleNewUserMessage = (message) => {
        link.send(message);
    }

    return (
        <Widget
            handleNewUserMessage={handleNewUserMessage}
            title='Chat'
            subtitle=''
            fullScreenMode={true}
            launcher={(open) => null}
        />
    );
}

export default Chat;