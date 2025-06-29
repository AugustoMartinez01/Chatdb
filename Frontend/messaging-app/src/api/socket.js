// src/api/socket.js
import { io } from 'socket.io-client';

const backendURL = `http://${window.location.hostname}:5000`;
const socket = io(backendURL);

export default socket;
