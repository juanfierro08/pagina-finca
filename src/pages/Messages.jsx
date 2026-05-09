import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Messages.css';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, senderId: 'h1', text: '¡Hola! ¿En qué te puedo ayudar?', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, senderId: 'g1', text: 'Me gustaría saber si la piscina está climatizada.', timestamp: new Date(Date.now() - 3500000) }
  ]);
  const [newMessage, setNewMessage] = useState('');

  if (!user) {
    return (
      <div className="container mt-xl text-center">
        <h2>Debes iniciar sesión para ver tus mensajes.</h2>
        <button onClick={() => navigate('/login')} className="btn-primary mt-md">Ir al Login</button>
      </div>
    );
  }

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      senderId: user.id,
      text: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="container messages-page">
      <div className="chat-layout glass-panel">
        <div className="chat-sidebar">
          <h3>Tus Chats</h3>
          <div className="chat-list">
            <div className="chat-list-item active">
              <div className="chat-avatar"></div>
              <div className="chat-preview">
                <h4>{user.role === 'Propietario' ? 'Huésped (Juan)' : 'Anfitrión (María)'}</h4>
                <p>Último mensaje...</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="chat-main">
          <div className="chat-header">
            <h3>{user.role === 'Propietario' ? 'Juan' : 'María'}</h3>
          </div>
          
          <div className="chat-messages">
            {messages.map(msg => {
              const isMine = msg.senderId === user.id;
              return (
                <div key={msg.id} className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
                  {msg.text}
                </div>
              );
            })}
          </div>
          
          <form onSubmit={handleSend} className="chat-input-area">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Escribe un mensaje..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="btn-primary">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
