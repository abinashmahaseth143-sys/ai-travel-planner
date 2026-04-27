import React, { useState } from 'react'

function VoiceButton({ onResult, label }) {
  const [listening, setListening] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice search not supported. Please use Chrome.");
      return;
    }
    
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
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
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        fontSize: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      title={listening ? "Listening..." : `Click to speak for ${label}`}
    >
      {listening ? '🎤🔴' : '🎤'}
    </button>
  );
}

export default VoiceButton;