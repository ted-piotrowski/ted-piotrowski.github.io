import React, { useContext, useEffect, useState } from 'react';
import { isWidgetOpened, toggleWidget } from 'react-chat-widget';
import { DataType } from '../../types/chat';
import { Color } from '../../utils/styles';
import { LinkContext } from '../Connection';
import ControlButton from '../ControlButton';
import ChatIcon from '../icons/ChatIcon';

const ChatButton = () => {
    const link = useContext(LinkContext);
    const [chat, setChat] = useState(true);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        if (!isWidgetOpened()) {
            toggleWidget();
        }
        const onData = (incoming) => {
            try {
                const data = JSON.parse(incoming.toString());
                if (data.type === DataType.CHAT && !isWidgetOpened()) {
                    setUnread(unread => unread + 1);
                }
            } catch (e) { }
        }
        if (link) {
            link.on('data', onData);
        }
        return () => {
            if (link) {
                link.removeListener('data', onData)
            }
        }
    }, [link]);

    const toggleChat = () => {
        toggleWidget();
        setChat(!chat);
        setUnread(0);
    }

    return (
        <ControlButton onClick={toggleChat}>
            {unread > 0 && <div style={styles.unread}>{unread}</div>}
            <ChatIcon color={chat ? Color.RED : Color.BLUE1} />
        </ControlButton>
    )
}

const bubble = 20;

const styles = {
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