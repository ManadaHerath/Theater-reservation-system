import React, { useState, useEffect } from "react";

const ChatBot = ({ chatbotId }) => {
  const [chatBubbleVisible, setChatBubbleVisible] = useState(false);
  const handleChatBubbleClick = () => setChatBubbleVisible(!chatBubbleVisible);

  useEffect(() => {
    window.addEventListener("chatbase:chatbubble:click", handleChatBubbleClick);

    return () =>
      window.removeEventListener(
        "chatbase:chatbubble:click",
        handleChatBubbleClick
      );
  }, [chatbotId]);

  return (
    <div className="fixed bottom-12 right-8 z-50">
      {/* Glowing and Floating Button */}
      <button
        onClick={handleChatBubbleClick}
        className="relative w-12 h-8 sm:w-24 sm:h-12 text-base sm:text-lg hover:text-white bg-white text-black font-bold rounded-2xl hover:bg-blue-800 transition duration-300 flex justify-center items-center shadow-xl animate-bounce-slow"
        style={{
          boxShadow: "0 0 30px rgba(0, 150, 255, 0.7)", // Glowing effect
          //backgroundImage: "url(https://firebasestorage.googleapis.com/v0/b/movie-mingle-2ec48.appspot.com/o/vecteezy_robot-chatbot-aesthetic_25271424.png?alt=media&token=1b54f33a-3f9a-451d-be88-16fb07a84521)", // Add logo if needed
          backgroundSize: "cover",
          border: "1px solid darkblue",
          backgroundPosition: "center",
        }}
      >
      <h1>Ask Me</h1>
        {/* Floating Glow Effect */}
        <div
          className=""
          style={{
            background:
              "radial-gradient(circle, rgba(0, 150, 255, 0.3) 0%, rgba(0, 150, 255, 0) 70%)",
          }}
        />
        
      </button>

      {chatBubbleVisible && (
        <iframe
          src={`https://www.chatbase.co/chatbot-iframe/${chatbotId}`}
          className="w-80 h-96 absolute bottom-16 right-0 bg-white shadow-lg rounded-lg"
        />
      )}
    </div>
  );
};

export default ChatBot;
