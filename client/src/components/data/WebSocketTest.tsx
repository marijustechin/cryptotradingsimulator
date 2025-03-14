import { useState, useEffect } from 'react';

export const WebSocketTest = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3003/ws/crypto'); // Replace with your actual WebSocket URL

    socket.onopen = () => {
      setStatus('Prisijungęs');
    };

    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onclose = () => {
      setStatus('Atsijungęs');
    };

    socket.onerror = (error) => {
      console.error('WebSocket klaida:', error);
      setStatus('Klaida');
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-lg max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-2">WebSocket testas</h2>
      <p>Pranešimai turi ateiti kas 1 minutę...</p>
      <p className="text-sm text-violet-30000">Būsena: {status}</p>
      <div className="mt-4 p-2 border rounded-md overflow-auto max-h-80">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <p key={index} className="text-sm">
              {msg}
            </p>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            Laukiu iš serverio pranešimų...
          </p>
        )}
      </div>
    </div>
  );
};
