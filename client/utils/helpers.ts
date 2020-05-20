import sound from './sound';

export const getRoomName = () => {
    return document.location.pathname;
}

export const getDefaultUsername = () => {
    let username = window.sessionStorage.getItem('username');
    if (username === null) {
        username = `guest${Math.ceil(Math.random() * 999)}`;
        window.sessionStorage.setItem('username', username);
    }
    return username;
}

export const setDefaultUsername = (username: string) => {
    window.sessionStorage.setItem('username', username);
}

export const playSound = () => {
    const audio = new Audio(sound);
    audio.play();
}