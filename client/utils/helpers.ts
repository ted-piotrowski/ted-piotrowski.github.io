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