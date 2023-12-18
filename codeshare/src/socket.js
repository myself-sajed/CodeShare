import { io } from 'socket.io-client';
// const link = "wss://codeshare-api.onrender.com/"
const link = `${process.env.REACT_APP_BACKEND_URL}`

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };
    return io(link, options);
};