import React from 'react';
import { Color } from '../../utils/styles';

interface Props {
    color?: Color;
}

const VideoIcon = (props: Props) => {
    const { color } = props;

    return (
        <svg version="1.1" id="Capa_1" x="0px" y="0px" fill={color} viewBox="0 0 455.168 455.168">
            <g>
                <g>
                    <path d="M446.464,118.528c-5.12-3.072-11.264-3.072-16.384,0l-82.944,50.176v-10.752c0-33.28-27.136-60.416-60.416-60.416H60.416
			C27.136,97.536,0,124.672,0,157.952v139.264c0,33.28,27.136,60.416,60.416,60.416H286.72c33.28,0,60.416-27.136,60.416-60.416
			v-15.872l82.944,49.664c7.68,4.608,17.92,2.048,22.528-5.632c1.536-2.56,2.56-5.632,2.56-8.704V132.864
			C454.656,127.232,451.584,121.6,446.464,118.528z"/>
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

VideoIcon.defaultProps = {
    color: Color.BLUE1,
}

export default VideoIcon;