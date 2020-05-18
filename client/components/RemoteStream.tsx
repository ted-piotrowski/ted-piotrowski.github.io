import React, { useContext, useEffect, useRef } from 'react';
import { LinkContext } from './Connection';

const RemoteStream = () => {
    const link = useContext(LinkContext);
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        link.on('track', (track: MediaStreamTrack) => {
            console.log('add track', track);
            if (track.kind === 'video' && videoRef && videoRef.current) {
                const video = videoRef.current;
                const videoStream = new MediaStream([track]);
                if ('srcObject' in video) {
                    video.srcObject = videoStream;
                    track.addEventListener('mute', () => { video.srcObject = null })
                } else {
                    video.src = window.URL.createObjectURL(videoStream) // for older browsers
                    track.addEventListener('mute', () => { video.src = null })
                }
                video.play()
            }
            if (track.kind === 'audio' && audioRef && audioRef.current) {
                const audio = audioRef.current;
                const audioStream = new MediaStream([track]);
                if ('srcObject' in audio) {
                    audio.srcObject = audioStream;
                    track.addEventListener('mute', () => { audio.srcObject = null })
                } else {
                    audio.src = window.URL.createObjectURL(audioStream) // for older browsers
                    track.addEventListener('mute', () => { audio.src = null })
                }
                audio.play()
            }
        });
    }, [link]);

    return (
        <React.Fragment>
            <audio ref={audioRef} />
            <video style={styles.video} ref={videoRef} />
        </React.Fragment>
    );
}

const styles = {
    video: {
        width: '100%',
        height: '100%',
    }
}

export default RemoteStream;