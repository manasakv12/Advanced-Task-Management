// useSocket.js
import { useEffect } from 'react';

const useSocket = () => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      // Send a test message to the server
      socket.send(JSON.stringify({ type: 'test', data: 'Hello, server!' }));
    };

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };

    socket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      socket.close();
    };
  }, []);
};

export default useSocket;