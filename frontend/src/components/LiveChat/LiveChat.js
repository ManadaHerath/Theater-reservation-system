import React, { useEffect, useRef, useState } from 'react';
import close_icon from '../../assets/close.jpg';

const LiveChat = ({ socket, username, onClose }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [clickedMessageId, setClickedMessageId] = useState(null);
  const messageContainerRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      const messageData = {
        author: username,
        message: currentMessage,
        time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
      };
      if (socket) {
        await socket.emit('send_message', messageData);
        setCurrentMessage('');
      }
    }
  };

  const handleDeleteMessage = async (id) => {
    if (socket) {
      await socket.emit('delete_message', id);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (data) => {
        setMessageList((list) => [...list, data]);
      });

      socket.on('load_messages', (messages) => {
        setMessageList(messages);
      });

      socket.on('message_deleted', (deletedMessageId) => {
        setMessageList((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== deletedMessageId)
        );
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
        socket.off('load_messages');
        socket.off('message_deleted');
      }
    };
  }, [socket]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  return (
    <div className="w-[400px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      <div className="relative flex items-center justify-center h-12 text-lg font-bold text-white bg-blue-500">
        <p>Live Chat</p>
        <img
          src={close_icon}
          alt=""
          className="absolute w-5 h-5 transform -translate-y-1/2 cursor-pointer right-2 top-1/2"
          onClick={onClose}
        />
      </div>
      <div
        className="flex-1 p-2 overflow-y-auto bg-gray-100"
        ref={messageContainerRef}
      >
        <div className="flex flex-col gap-2">
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg max-w-3/4 break-words ${messageContent.author === username ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
              onClick={() => setClickedMessageId(clickedMessageId === messageContent.id ? null : messageContent.id)}
            >
              <div className="break-words">
                <p>{messageContent.message}</p>
              </div>
              <div className="flex mt-1 text-xs">
                <p className="mr-2">{messageContent.time}</p>
                <p>{messageContent.author}</p>
                {messageContent.author === username && clickedMessageId === messageContent.id && (
                  <button onClick={() => handleDeleteMessage(messageContent.id)} className="ml-2 text-red-500">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-12 p-2 bg-gray-200 border-t border-gray-300">
        <input
          type="text"
          placeholder="Hey..."
          onChange={(event) => setCurrentMessage(event.target.value)}
          value={currentMessage}
          className="flex-1 p-2 mr-2 text-lg bg-white border border-gray-300 rounded-lg outline-none"
          onKeyPress={(event) => {
            if (event.key === 'Enter') sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="flex items-center justify-center w-10 h-10 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-700"
        >
          &#9658;
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
