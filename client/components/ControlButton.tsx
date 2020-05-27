import React from 'react';
import { Color } from '../utils/styles';

const ControlButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return <button {...props} style={{ ...styles.button, ...props.style }} />
}

const styles = {
    button: {
        position: 'relative' as 'relative',
        width: 70,
        height: 70,
        background: 'transparent',
        marginBottom: 1,
        padding: 15,
        border: 'none',
        backgroundColor: Color.BLUE2,
        boxShadow: `0 1px 5px ${Color.BLUE2}`,
    }
};

export default ControlButton;