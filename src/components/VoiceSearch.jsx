import React, { useState } from 'react'

function VoiceSearch({ onResult }) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const startListening = () => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Voice search not supported');
      alert('Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };
    
    recognition.onend = () => {
      setListening(false);
    };
    
    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e);
      setError(e.error);
      setListening(false);
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice recognized:', transcript);
      if (onResult) {
        onResult(transcript);
      }
      setListening(false);
    };
    
    recognition.start();
  };

  return (
    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 20 }}>
      <button
        type="button"
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
          transition: 'all 0.2s'
        }}
        title={listening ? "Listening..." : "Click to speak"}
      >
        {listening ? '🎤🔴' : '🎤'}
      </button>
      
      {error && (
        <div style={{
          position: 'absolute',
          bottom: '-24px',
          right: '0',
          fontSize: '10px',
          color: '#ef4444',
          whiteSpace: 'nowrap'
        }}>
          {error === 'not-allowed' ? 'Allow microphone' : 'Try again'}
        </div>
      )}
    </div>
  );
}

export default VoiceSearch;