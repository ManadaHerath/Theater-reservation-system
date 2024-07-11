import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import LiveChat from './LiveChat';
import chat_icon from '../../assets/chat_icon.jpeg';

const ENDPOINT = 'http://localhost:5001';

const Chat = () => {
  const storedUsername = localStorage.getItem('username') || '';
  const [username, setUsername] = useState(storedUsername);
  const [showChat, setShowChat] = useState(false);
  const [showJoinChat, setShowJoinChat] = useState(false);
  const [socket, setSocket] = useState(null);

  const joinChat = () => {
    if (username !== '') {
      localStorage.setItem('username', username.trim());
      setShowChat(true);
      setShowJoinChat(false);
      if (socket) {
        socket.emit('request_messages');
      }
    }
  };

  const closeChat = () => {
    setShowChat(false);
    setUsername('');
    localStorage.removeItem('username');
  };

  const openJoinChat = () => {
    setShowJoinChat(true);
  };

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (storedUsername !== '') {
      setShowChat(true);
      setShowJoinChat(false);
      if (socket) {
        socket.emit('request_messages');
      }
    }
  }, [storedUsername, socket]);
  
  return (
    <div className="grid w-screen h-screen p-0 m-0 font-sans text-gray-900 bg-gray-100 place-items-center">
      {!showChat ? (
        !showJoinChat ? (
          <div className="fixed z-50 bottom-5 right-5">
            <img
              src={chat_icon}
              alt=""
              onClick={openJoinChat}
              className="w-12 h-12 transition-transform transform rounded-full shadow-lg cursor-pointer hover:scale-110"
            />
          </div>
        ) : (
          <div className="flex flex-col p-5 text-center bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-2xl text-gray-700">Join the Chat</h3>
            <input
              type="text"
              placeholder="Username"
              onChange={(event) => setUsername(event.target.value)}
              className="w-full h-10 px-2 mb-2 text-lg border border-gray-300 rounded-lg"
            />
            <button
              onClick={joinChat}
              className="w-full h-10 mt-2 text-lg text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-700"
            >
              Join Chat
            </button>
          </div>
        )
      ) : (
        socket && <LiveChat socket={socket} username={username} onClose={closeChat} />
      )}
    </div>
  );
};

export default Chat;
