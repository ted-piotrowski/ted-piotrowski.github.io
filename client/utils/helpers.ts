export const getRoomName = () => {
    return document.location.pathname;
}

export const getUsername = () => {
    let username = window.sessionStorage.getItem('username');
    if (username === null) {
        username = `User${Math.ceil(Math.random() * 999)}`;
        window.sessionStorage.setItem('username', username);
    }
    return username;
}
