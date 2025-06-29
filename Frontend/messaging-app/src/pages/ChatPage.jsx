import { useEffect, useState } from 'react';
import socket from '../api/socket';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sender, setSender] = useState('');
  const [nameSet, setNameSet] = useState(false);

  useEffect(() => {
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('receiveMessageHistory', (history) => {
      setMessages(history);
    });

    socket.emit('getMessages');

    return () => {
      socket.off('receiveMessage');
      socket.off('receiveMessageHistory');
    };
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;

    const newMsg = {
      sender,
      receiver: 'otro@example.com',
      message: text,
    };

    socket.emit('sendMessage', newMsg);
    setText('');
  };

  const handleSetName = () => {
    if (sender.trim()) {
      setNameSet(true);
    }
  };

  const handleClearChat = async () => {
    const confirmClear = window.confirm('¿Estás seguro de que querés reiniciar el chat?');
    if (!confirmClear) return;

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error al reiniciar chat:', err);
    }
  };

  if (!nameSet) {
    return (
      <div style={{ maxWidth: '400px', margin: '5rem auto', textAlign: 'center' }}>
        <h2>📛 Elegí tu nombre</h2>
        <input
          type="text"
          placeholder="Tu nombre o email"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          style={{ width: '80%', marginBottom: '1rem' }}
        />
        <br />
        <button onClick={handleSetName}>Entrar al chat</button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
        <span>💬 Chat</span>
        <button onClick={handleClearChat} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
           Reiniciar
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === sender ? 'you' : 'other'}`}>
            <strong>{msg.sender}</strong><br />
            {msg.message}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={text}
          placeholder="Escribí un mensaje"
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
};

export default ChatPage;
