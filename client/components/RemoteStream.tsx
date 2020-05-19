import React, { useContext, useEffect, useRef } from 'react';
import { LinkContext } from './Connection';

const RemoteStream = () => {
    const link = useContext(LinkContext);
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const listener = (track: MediaStreamTrack) => {
            console.log('add track', track);
            if (track.kind === 'video' && videoRef && videoRef.current) {
                const video = videoRef.current;
                const videoStream = new MediaStream([track]);
                video.style.display = 'block';
                video.srcObject = videoStream;
                track.addEventListener('mute', () => {
                    console.log('Track muted', track);
                    video.style.display = 'none';
                });
                track.addEventListener('unmute', () => {
                    console.log('Track unmuted', track);
                    video.style.display = 'block';
                });
                track.addEventListener('ended', () => {
                    console.log('Track ended', track);
                    video.srcObject = null
                });
                video.play()
            }
            if (track.kind === 'audio' && audioRef && audioRef.current) {
                const audio = audioRef.current;
                const audioStream = new MediaStream([track]);
                audio.srcObject = audioStream;
                track.addEventListener('ended', () => {
                    console.log('Track ended', track);
                    audio.srcObject = null
                })
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