
import React, { useState, useEffect } from 'react';
import { useDebug } from '../contexts/DebugContext';

const DebugToggle: React.FC = () => {
  const { isDebugMode, toggleDebugMode } = useDebug();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.altKey && event.key === 'd') {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const style: React.CSSProperties = {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '5px',
    cursor: 'pointer',
    zIndex: 1000,
    fontSize: '10px',
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? 'auto' : 'none',
    transition: 'opacity 0.3s ease-in-out',
  };

  return (
    <button
      onClick={toggleDebugMode}
      style={style}
    >
      {isDebugMode ? 'Debug OFF' : 'Debug ON'}
    </button>
  );
};

export default DebugToggle;
