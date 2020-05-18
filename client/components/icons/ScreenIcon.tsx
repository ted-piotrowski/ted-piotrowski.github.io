
import React from 'react';
import { Color } from '../../utils/styles';

interface Props {
    color?: Color;
}

const ScreenIcon = (props: Props) => {
    const { color } = props;

    return (
        <svg version="1.1" id="Capa_1" x="0px" y="0px" fill={color} viewBox="0 0 437.248 437.248">
            <g>
                <g>
                    <path d="M421.888,10.24H15.36C6.656,10.24,0,16.896,0,25.6v306.176c0,8.704,6.656,15.36,15.36,15.36h153.088v49.152h-48.64v30.72
			H317.44v-30.72H268.8v-49.152h153.088c8.704,0,15.36-6.656,15.36-15.36V25.6C437.248,16.896,430.592,10.24,421.888,10.24z
			 M406.528,239.616H30.72V40.96h375.808V239.616z"/>
                </g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
        </svg>

    )
}

ScreenIcon.defaultProps = {
    color: Color.BLUE1,
}

export default ScreenIcon;