import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { createChatBotMessage } from "react-chatbot-kit";

import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";
import ChatbotHeader from "./ChatbotHeader"; // Import the custom header

import "./Chatbot.css";

interface MyChatbotProps {
  setShowChatbot: (show: boolean) => void;
}

const MyChatbot: React.FC<MyChatbotProps> = ({ setShowChatbot }) => {
  const config = {
    initialMessages: [createChatBotMessage("¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte? Escribe 'ayuda' para ver la lista completa de comandos.", { withAvatar: true })],
    botName: "Asistente Virtual",
    customStyles: {
      botMessageBox: {
        backgroundColor: "#376B7E",
      },
      chatButton: {
        backgroundColor: "#376B7E",
      },
    },
    customComponents: {
      header: (props: any) => <ChatbotHeader {...props} setShowChatbot={setShowChatbot} />,
    },
    widgets: [], // Re-add an empty widgets array
  };

  return (
    <Chatbot
      config={config}
      messageParser={MessageParser}
      actionProvider={ActionProvider}
      headerText="Asistente Virtual"
      placeholderText="Escribe tu mensaje aquí..."
      style={{ width: '100%' }}
      // react-chatbot-kit manages history internally, no direct disable prop like react-chatbotify
    />
  );
};

export default MyChatbot;
