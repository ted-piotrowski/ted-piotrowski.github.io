import React, { useContext, useState } from 'react';
import { Color } from '../utils/styles';
import Chat from './chat/Chat';
import ChatButton from './chat/ChatButton';
import { LinkContext } from './Connection';
import MicrophoneIcon from './icons/MicrophoneIcon';
import ScreenIcon from './icons/ScreenIcon';
import VideoIcon from './icons/VideoIcon';
import LocalStream from './LocalStream';
import RemoteStream from './RemoteStream';

const Room = () => {

    const [audio, setAudio] = useState(false);
    const [video, setVideo] = useState(false);
    const [screen, setScreen] = useState(false);
    const [videoTrack, setVideoTrack] = useState<MediaStreamTrack>(null);
    const [audioTrack, setAudioTrack] = useState<MediaStreamTrack>(null);
    const [rtcStream, setRtcStream] = useState(new MediaStream());
    const link = useContext(LinkContext);

    const toggleAudio = async () => {
        if (!audio) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
                setAudio(true);
                stream.getTracks().map(track => {
                    rtcStream.addTrack(track);
                    setAudioTrack(track);
                    link.addTrack(track, rtcStream);
                });
                console.log('add track', rtcStream.getTracks())
            } catch (e) {
                console.log('could not get audio stream', e);
            }
        } else {
            console.log('stop track', rtcStream.getTracks())
            rtcStream.getAudioTracks().map(track => {
                link.removeTrack(track, rtcStream)
                setAudioTrack(null);
                track.stop();
            });
            setAudio(false);
        }
    }

    const toggleVideo = async () => {
        if (!video) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true
                });
                if (screen) {
                    await toggleScreen();
                }
                setVideo(true);
                stream.getTracks().map(track => {
                    rtcStream.addTrack(track);
                    setVideoTrack(track);
                    link.addTrack(track, rtcStream);
                });
            } catch (e) {
                console.log('could not get video stream', e);
            }
        } else {
            rtcStream.getVideoTracks().map(track => {
                link.removeTrack(track, rtcStream)
                setVideoTrack(null);
                track.stop();
            });
            setVideo(false);
        }
    }

    const toggleScreen = async () => {
        if (!screen) {
            try {
                const stream: MediaStream = await (navigator.mediaDevices as any).getDisplayMedia({
                    video: true
                });
                if (video) {
                    await toggleVideo();
                }
                setScreen(true);
                stream.getTracks().map(track => {
                    rtcStream.addTrack(track);
                    setVideoTrack(track);
                    link.addTrack(track, rtcStream);
                });
            } catch (e) {
                console.log('could not get display stream', e);
            }
        } else {
            rtcStream.getVideoTracks().map(track => {
                link.removeTrack(track, rtcStream)
                setVideoTrack(null);
                track.stop();
            });
            setScreen(false);
        }
    }

    return (
        <div style={styles.container}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
                <LocalStream videoTrack={videoTrack} audioTrack={audioTrack} />
                <RemoteStream />
            </div>
            <div>
                <Chat />
            </div>
            <div style={styles.leftSidebar}>
                <div>
                    <button style={styles.button} onClick={toggleAudio}>
                        <MicrophoneIcon color={audio ? Color.RED : Color.BLUE1} />
                    </button>
                </div>
                <div>
                    <button style={styles.button} onClick={toggleVideo}>
                        <VideoIcon color={video ? Color.RED : Color.BLUE1} />
                    </button>
                </div>
                <div>
                    <button style={styles.button} onClick={toggleScreen}>
                        <ScreenIcon color={screen ? Color.RED : Color.BLUE1} />
                    </button>
                </div>
                <div>
                    <ChatButton />
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        position: 'absolute' as 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
    },
    leftSidebar: {
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0,
    },
    button: {
        width: 80,
        height: 80,
        background: 'transparent',
        padding: 20,
        border: 'none',
        backgroundColor: Color.BLUE2,
        boxShadow: `0 1px 5px ${Color.BLUE2}`
    }
}

export default Room;