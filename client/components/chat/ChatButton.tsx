import React, { useContext, useEffect, useState } from 'react';
import { isWidgetOpened, toggleWidget } from 'react-chat-widget';
import { Color } from '../../utils/styles';
import { LinkContext } from '../Connection';
import ChatIcon from '../icons/ChatIcon';

const ChatButton = () => {
    const link = useContext(LinkContext);
    const [chat, setChat] = useState(true);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        if (!isWidgetOpened()) {
            toggleWidget();
        }
        link.on('data', () => {
            if (!isWidgetOpened()) {
                setUnread(unread => unread + 1);
            }
        })
    }, [link]);

    const toggleChat = () => {
        toggleWidget();
        setChat(!chat);
        setUnread(0);
    }

    return (

        <button style={styles.button} onClick={toggleChat}>
            {unread > 0 && <div style={styles.unread}>{unread}</div>}
            <ChatIcon color={chat ? Color.RED : Color.BLUE1} />
        </button>
    )
}

const bubble = 20;

const styles = {
    button: {
        position: 'relative' as 'relative',
        width: 80,
        height: 80,
        background: 'transparent',
        padding: 20,
        border: 'none',
        backgroundColor: Color.BLUE2,
        boxShadow: `0 1px 5px ${Color.BLUE2}`
    },
    unread: {
        position: 'absolute' as 'absolute',
        borderRadius: '100%',
        backgroundColor: Color.RED,
        padding: 2,
        height: bubble,
        width: bubble,
        maxHeight: bubble,
        maxWidth: bubble,
        fontSize: 16,
        textAlign: 'center' as 'center',
        color: Color.BLUE4,
        top: 10, right: 10,
    }
}

export default ChatButton;