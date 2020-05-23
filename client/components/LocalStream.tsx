import React, { useContext, useEffect, useRef, useState } from 'react';
import { Color } from '../utils/styles';
import { RoomContext } from './Connection';

interface Props {
    audioTrack: MediaStreamTrack;
    videoTrack: MediaStreamTrack;
}

const LocalStream = (props: Props) => {
    const { audioTrack, videoTrack } = props;
    const room = useContext(RoomContext);
    const [amplitude, setAmplitude] = useState(0);
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoTrack && videoRef && videoRef.current) {
            const video = videoRef.current;
            const videoStream = new MediaStream([videoTrack]);
            if ('srcObject' in video) {
                video.srcObject = videoStream;
            } else {
                video.src = window.URL.createObjectURL(videoStream) // for older browsers
            }
            video.play()
        }
        if (audioTrack) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext: AudioContext = new AudioContext();
            const analyzer = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(new MediaStream([audioTrack]));
            source.connect(analyzer);
            analyzer.fftSize = 32;
            const bufferLength = analyzer.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const visualize = () => {
                analyzer.getByteFrequencyData(dataArray)
                const decibel = Math.max(...Array.from(dataArray), 128);
                setAmplitude(decibel / 256 * 75);
                window.requestAnimationFrame(visualize);
            };
            window.requestAnimationFrame(visualize);
        }
    }, [videoTrack, audioTrack]);


    return (
        <div style={styles.container}>
            <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                <div style={{ opacity: 0.3, borderRadius: '100%', height: amplitude, width: amplitude, backgroundColor: Color.RED }}></div>
            </div>
            <div style={styles.avatar}>
                <div>{room[0] && room[0][0]}</div>
            </div>
            <div style={{ position: 'absolute', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {videoTrack && <video ref={videoRef} height={150} width={200} />}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute' as 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'black',
        height: 150,
        width: 200,
        maxWidth: 200,
        maxHeight: 150,
        boxShadow: `0 0 4px ${Color.BLUE2}`
    },
    avatar: {
        borderRadius: '100%',
        backgroundColor: Color.BLUE2,
        height: 50,
        width: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'bold' as 'bold',
        zIndex: 2,
    }
}

export default LocalStream;