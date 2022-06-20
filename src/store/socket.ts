import openSocket from 'socket.io-client';

const socket = openSocket(`${process.env.REACT_APP_OPENSOCKET}`);

export default socket