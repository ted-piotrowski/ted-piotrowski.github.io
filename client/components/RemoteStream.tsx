import React, { useContext, useEffect, useRef } from 'react';
import { LinkContext } from './Connection';

const RemoteStream = () => {
    const link = useContext(LinkContext);
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const listener = (track: MediaStreamTrack) => {
            console.log('add track', track);
            if (track.kind === 'video' && videoRef && videoRef.current) {
                const video = videoRef.current;
                const videoStream = new MediaStream([track]);
                if ('srcObject' in video) {
                    video.srcObject = videoStream;
                    track.addEventListener('mute', () => { video.srcObject = null })
                } else {
                    video.src = window.URL.createObjectURL(videoStream) // for older browsers
                    track.addEventListener('mute', () => { console.log('Track muted', track); video.src = null })
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
                    track.addEventListener('mute', () => { console.log('Track muted', track); audio.src = null })
                }
                audio.play()
            }
        }
        link.on('track', listener);
        return () => {
            link.removeListener('track', listener);
        }
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