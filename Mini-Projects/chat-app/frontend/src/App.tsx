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
  readBy?: string[];
}

interface OnlineUser {
  id: string;
  username: string;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3002';

function getRelativeTime(timestamp: string) {
  const diffInSeconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function RelativeTime({ timestamp }: { timestamp: string }) {
  const [timeStr, setTimeStr] = useState(getRelativeTime(timestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(getRelativeTime(timestamp));
    }, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span className="message-time">{timeStr}</span>;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<string>('');
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isWindowFocused, setIsWindowFocused] = useState(document.hasFocus());
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // We generate a random username for the session if not set
    const user = `User_${Math.floor(Math.random() * 1000)}`;
    setUsername(user);

    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      newSocket.close();
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    if (socket && currentRoom && isWindowFocused) {
      messages.forEach(msg => {
        if (msg._id && msg.sender !== username && (!msg.readBy || !msg.readBy.includes(username))) {
          socket.emit('markAsRead', { messageId: msg._id, username, room: currentRoom });
        }
      });
    }
  }, [messages, isWindowFocused, socket, currentRoom, username]);

  useEffect(() => {
    if (!socket) return;

    setIsConnected(socket.connected);

    const onConnect = () => {
      setIsConnected(true);
      if (currentRoom && username) {
        socket.emit('joinRoom', { room: currentRoom, username });
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('messageHistory', (history: Message[]) => {
      setMessages(history);
      setIsLoadingHistory(false);
      scrollToBottom(true);
    });

    socket.on('chatMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom(message.sender === username);
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

    socket.on('roomUsers', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    socket.on('messageUpdated', (updatedMsg: Message) => {
      setMessages(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('messageHistory');
      socket.off('chatMessage');
      socket.off('system');
      socket.off('typing');
      socket.off('stopTyping');
      socket.off('roomUsers');
      socket.off('messageUpdated');
    };
  }, [socket, currentRoom, username]);

  const scrollToBottom = (force = false) => {
    if (!messagesAreaRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesAreaRef.current;
    const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 150;

    if (force || isScrolledToBottom) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (room.trim() && socket) {
      setIsLoadingHistory(true);
      socket.emit('joinRoom', { room, username });
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
            <label htmlFor="room-input">Join a Room</label>
            <Input 
              id="room-input"
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
              <div className="chat-header-info">
                <h2>
                  <span className="hash">#</span> {currentRoom}
                </h2>
              </div>
              <div className="online-users-container">
                <div className="online-users-count">
                  <Users size={16} />
                  <span>{onlineUsers.length} online</span>
                </div>
                <div className="online-users-list">
                  {onlineUsers.map(u => (
                    <div key={u.id} className="online-user-item">
                      <div className="status-dot connected"></div>
                      <span className="online-user-name">{u.username === username ? 'You' : u.username}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-area" ref={messagesAreaRef}>
              {isLoadingHistory ? (
                <div className="empty-state">
                  <div className="loading-spinner"></div>
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="empty-state">
                  <MessageSquare size={48} />
                  <p>No messages yet. Be the first to say hi!</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={msg._id || idx} className={`message-wrapper ${msg.sender === username ? 'own' : 'other'}`}>
                    {msg.sender === 'System' ? (
                      <div className="system-message">{msg.text}</div>
                    ) : (
                      <div className={`message-bubble ${msg.sender === username ? 'own' : 'other'}`}>
                        {msg.sender !== username && <div className="message-sender">{msg.sender}</div>}
                        <div className="message-text">{msg.text}</div>
                        <div className="message-meta">
                          <RelativeTime timestamp={msg.timestamp} />
                          {msg.sender === username && msg.readBy && msg.readBy.length > 0 && (
                            <span className="message-seen">
                               ・ Seen by {msg.readBy.filter(u => u !== username).join(', ')}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
              <div className="typing-indicator">
                {typingUser && typingUser !== socket?.id && `Someone is typing...`}
              </div>
              <form onSubmit={handleSendMessage} className="message-form">
                <Input 
                  aria-label="Message text"
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
