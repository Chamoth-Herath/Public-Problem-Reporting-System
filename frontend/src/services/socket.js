import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const createSocket = () => io(SOCKET_URL, { autoConnect: false });

export default io(SOCKET_URL, { autoConnect: false });