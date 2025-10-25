import React from 'react';

interface ChatbotHeaderProps {
  setShowChatbot: (show: boolean) => void;
}

const ChatbotHeader: React.FC<ChatbotHeaderProps> = ({ setShowChatbot }) => {
  return (
    <div style={{
      backgroundColor: '#376B7E',
      padding: '10px',
      borderRadius: '8px 8px 0 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      fontWeight: 'bold',
    }}>
      <span>Asistente Virtual</span>
      <button
        onClick={() => setShowChatbot(false)}
        style={{
          backgroundColor: 'transparent',
          color: 'white',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          width: '25px',
          height: '25px',
          lineHeight: '1',
          padding: '0',
        }}
      >
        X
      </button>
    </div>
  );
};

export default ChatbotHeader;
