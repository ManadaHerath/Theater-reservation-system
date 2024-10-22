import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons"; // or another similar icon
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Zoom from "@mui/material/Zoom";

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

  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  return (
    <div className="fixed bottom-12 right-16 z-50">
      {/* Glowing and Floating Button */}
      <BootstrapTooltip
        title="Ask Me"
        TransitionComponent={Zoom}
        placement="top"
        sx={{
          "& .MuiTooltip-tooltip": {
            fontSize: "1.0rem", // Increase the font size
            padding: "8px 16px", // Increase the padding for a larger tooltip
          },
        }}
      >
        <button
          onClick={handleChatBubbleClick}
          className="relative hover:text-blue-400 text-white font-bold transition duration-300 flex justify-center items-center animate-bounce-slow"
          style={{
            boxShadow: "0 0 30px rgba(0, 150, 255, 0.7)", // Glowing effect
            backgroundSize: "cover",
            border: "1px solid darkblue",
            backgroundPosition: "center",
            borderRadius: "50%", // Make the button circular
            width: "0px", // Set equal width and height to ensure it's a perfect circle
            height: "0px",
            padding: "10px",
          }}
        >
          <FontAwesomeIcon icon={faRobot} style={{ fontSize: '40px' }}  />

          {/* Floating Glow Effect */}
          <div
            style={{
              position: "absolute",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0, 150, 255, 0.3) 0%, rgba(0, 150, 255, 0) 70%)",
            }}
          />
        </button>
      </BootstrapTooltip>

      {chatBubbleVisible && (
        <iframe
          src={`https://www.chatbase.co/chatbot-iframe/${chatbotId}`}
          className="w-80 h-96 absolute bottom-16 right-5 bg-white shadow-lg rounded-lg"
        />
      )}
    </div>
  );
};

export default ChatBot;
