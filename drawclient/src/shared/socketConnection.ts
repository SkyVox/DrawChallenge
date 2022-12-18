import { io } from 'socket.io-client';
export const socket = io('http://localhost:1011', { transports : [ 'websocket' ] });