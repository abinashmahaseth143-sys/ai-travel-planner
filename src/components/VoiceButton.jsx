import React, { useState } from 'react'

function VoiceButton({ onResult, label, placeholder }) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice not supported');
      alert('Please use Chrome, Edge, or Safari for voice search');
      return;
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };
    
    recognition.onend = () => setListening(false);
    
    recognition.onerror = (e) => {
      setError(e.error);
      setListening(false);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
      setListening(false);
    };
    
    recognition.start();
  };

  return (
    <button
      onClick={startListening}
      style={{
        background: listening ? '#ef4444' : '#f3f4f6',
        border: 'none',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        marginLeft: '8px',
        transition: 'all 0.2s'
      }}
      title={listening ? "Listening..." : `Speak to set ${label}`}
    >
      {listening ? '🎤🔴' : '🎤'}
    </button>
  );
}

export default VoiceButton;