import React, { useState, useEffect } from 'react';

const ChatBot = ({ chatbotId }) => {
    const [chatBubbleVisible, setChatBubbleVisible] = useState(false);
    const handleChatBubbleClick = () => setChatBubbleVisible(!chatBubbleVisible);

    useEffect(() => {
        
        window.addEventListener('chatbase:chatbubble:click', handleChatBubbleClick);

        return () => window.removeEventListener('chatbase:chatbubble:click', handleChatBubbleClick);
    }, [chatbotId]);

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
            <button
                onClick={handleChatBubbleClick} 
                className="bg-black text-white rounded-full px-4 py-2
      background-image: url('path/to/your/logo.png');
      background-size: contain;
      background-position: center;"
            >
                Ask me
            </button>
            {chatBubbleVisible && (
                <iframe
                    src={`https://www.chatbase.co/chatbot-iframe/${chatbotId}`}
                    style={{ width: '350px', height: '400px', position: 'absolute', bottom: '50px', right: '20px' }}
                />
            )}
        </div>
    );
};

export default ChatBot;