import React, { useContext, useEffect, useRef } from 'react';
import { DataType } from '../types/chat';
import { LinkContext, RoomContext } from './Connection';

const RemoteStream = () => {
    const link = useContext(LinkContext);
    const room = useContext(RoomContext);
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const addTrack = (track: MediaStreamTrack) => {
            console.log('add track', track);
            if (track.kind === 'video' && videoRef && videoRef.current) {
                const video = videoRef.current;
                const videoStream = new MediaStream([track]);
                video.style.display = 'block';
                video.srcObject = videoStream;
                video.play()
            }
            if (track.kind === 'audio' && audioRef && audioRef.current) {
                const audio = audioRef.current;
                const audioStream = new MediaStream([track]);
                audio.srcObject = audioStream;
                audio.play()
            }
        }
        const removeTrack = (incoming: string) => {
            try {
                const data = JSON.parse(incoming);
                if (data.type === DataType.VIDEO_TRACK_ENDED) {
                    if (videoRef && videoRef.current) {
                        const video = videoRef.current;
                        video.style.display = 'none';
                        video.srcObject = null;
                    }
                }
            } catch (e) { }
        }
        if (link) {
            link.on('data', removeTrack);
            link.on('track', addTrack);
        }
        return () => {
            if (link) {
                link.removeListener('data', removeTrack);
                link.removeListener('track', addTrack);
            }
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
    name: {
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
    },
    video: {
        width: '100%',
        height: '100%',
    }
}

export default RemoteStream;