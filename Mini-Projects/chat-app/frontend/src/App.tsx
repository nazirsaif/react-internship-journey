import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { Button } from '@internal/ui-system/src/components/ui/Button';
import { Input } from '@internal/ui-system/src/components/ui/Input';
import { MessageSquare, Users, Send } from 'lucide-react';

import './App.css';

interface Message {
  _id?: string;
  room: string;
  sender: string;
  text: string;
  timestamp: string;
}

const SERVER_URL = 'http://localhost:3001';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<string>('');
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // We generate a random username for the session if not set
    const user = `User_${Math.floor(Math.random() * 1000)}`;
    setUsername(user);

    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('messageHistory', (history: Message[]) => {
      setMessages(history);
      scrollToBottom();
    });

    socket.on('chatMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socket.on('system', (msg: string) => {
      const sysMsg: Message = {
        room: currentRoom,
        sender: 'System',
        text: msg,
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, sysMsg]);
      scrollToBottom();
    });

    socket.on('typing', (user: string) => {
      setTypingUser(user);
    });

    socket.on('stopTyping', () => {
      setTypingUser(null);
    });

    return () => {
      socket.off('messageHistory');
      socket.off('chatMessage');
      socket.off('system');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [socket, currentRoom]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (room.trim() && socket) {
      socket.emit('joinRoom', room);
      setCurrentRoom(room);
      setMessages([]);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && socket && currentRoom) {
      const msgData = {
        room: currentRoom,
        sender: username,
        text: inputValue
      };
      socket.emit('chatMessage', msgData);
      socket.emit('stopTyping', currentRoom);
      setInputValue('');
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    if (socket && currentRoom) {
      socket.emit('typing', currentRoom);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', currentRoom);
      }, 1000);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <MessageSquare size={24} />
          <h1>ChatApp</h1>
        </div>
        
        <div className="user-info">
          <p>Logged in as:</p>
          <div className="user-badge">
            <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
            {username}
          </div>
        </div>

        <form onSubmit={handleJoinRoom} className="join-form">
          <div>
            <label>Join a Room</label>
            <Input 
              value={room} 
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. general"
            />
          </div>
          <Button type="submit">
            <Users size={16} style={{marginRight: '8px'}} />
            Join Room
          </Button>
        </form>
      </div>

      {/* Main Chat Area */}
      <div className="main-chat">
        {currentRoom ? (
          <>
            {/* Header */}
            <div className="chat-header">
              <h2>
                <span className="hash">#</span> {currentRoom}
              </h2>
            </div>

            {/* Messages */}
            <div className="messages-area">
              {messages.map((msg, idx) => (
                <div key={msg._id || idx} className={`message-wrapper ${msg.sender === username ? 'own' : 'other'}`}>
                  {msg.sender === 'System' ? (
                    <div className="system-message">{msg.text}</div>
                  ) : (
                    <div className={`message-bubble ${msg.sender === username ? 'own' : 'other'}`}>
                      {msg.sender !== username && <div className="message-sender">{msg.sender}</div>}
                      <div className="message-text">{msg.text}</div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
              <div className="typing-indicator">
                {typingUser && typingUser !== socket?.id && `Someone is typing...`}
              </div>
              <form onSubmit={handleSendMessage} className="message-form">
                <Input 
                  value={inputValue}
                  onChange={handleTyping}
                  placeholder={`Message #${currentRoom}`}
                />
                <Button type="submit">
                  <Send size={16} style={{marginRight: '8px'}} />
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <MessageSquare size={64} />
            <p>Join a room to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
