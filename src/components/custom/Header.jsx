import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate();
  const [showTranslator, setShowTranslator] = useState(false);

  return (
    <>
      <div style={{
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottom: '1px solid #ccc',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <img 
          src='/logo.svg' 
          alt='logo'
          style={{height: '40px', cursor: 'pointer'}}
          onClick={() => navigate('/')}
        />
        
        {/* Buttons Container */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Language Translator Button */}
          <button 
            onClick={() => setShowTranslator(true)}
            style={{
              padding: '8px 20px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
          >
            🌐 Translate
          </button>
          
          {/* My Trips Button */}
          <button 
            onClick={() => navigate('/my-trips')}
            style={{
              padding: '8px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            📋 My Trips
          </button>
        </div>
      </div>

      {/* Language Translator Modal */}
      {showTranslator && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowTranslator(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '85vh',
            overflow: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#8b5cf6',
              color: 'white',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌍 Universal Language Translator
              </h3>
              <button
                onClick={() => setShowTranslator(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0 8px'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Modal Content */}
            <div style={{ padding: '20px' }}>
              <LanguageTranslatorInside />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Language Translator Component for Modal
function LanguageTranslatorInside() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  let recognitionRef = null;

  const languages = {
    'auto': { name: 'Auto Detect', flag: '🌐' },
    'en': { name: 'English', flag: '🇺🇸', voice: 'en-US' },
    'es': { name: 'Spanish', flag: '🇪🇸', voice: 'es-ES' },
    'fr': { name: 'French', flag: '🇫🇷', voice: 'fr-FR' },
    'de': { name: 'German', flag: '🇩🇪', voice: 'de-DE' },
    'it': { name: 'Italian', flag: '🇮🇹', voice: 'it-IT' },
    'pt': { name: 'Portuguese', flag: '🇵🇹', voice: 'pt-PT' },
    'ru': { name: 'Russian', flag: '🇷🇺', voice: 'ru-RU' },
    'ja': { name: 'Japanese', flag: '🇯🇵', voice: 'ja-JP' },
    'ko': { name: 'Korean', flag: '🇰🇷', voice: 'ko-KR' },
    'zh': { name: 'Chinese', flag: '🇨🇳', voice: 'zh-CN' },
    'hi': { name: 'Hindi', flag: '🇮🇳', voice: 'hi-IN' },
    'ne': { name: 'Nepali', flag: '🇳🇵', voice: 'ne-NP' },
    'ar': { name: 'Arabic', flag: '🇸🇦', voice: 'ar-SA' },
    'tr': { name: 'Turkish', flag: '🇹🇷', voice: 'tr-TR' },
    'nl': { name: 'Dutch', flag: '🇳🇱', voice: 'nl-NL' },
    'sv': { name: 'Swedish', flag: '🇸🇪', voice: 'sv-SE' },
    'pl': { name: 'Polish', flag: '🇵🇱', voice: 'pl-PL' },
    'vi': { name: 'Vietnamese', flag: '🇻🇳', voice: 'vi-VN' },
    'th': { name: 'Thai', flag: '🇹🇭', voice: 'th-TH' },
    'id': { name: 'Indonesian', flag: '🇮🇩', voice: 'id-ID' }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakText = (text, langCode) => {
    if (!window.speechSynthesis) return;
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languages[langCode]?.voice || 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported. Please use Chrome.');
      return;
    }
    
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInputText(spokenText);
      translateText(spokenText);
    };
    
    recognition.start();
  };

  const translateText = async (text) => {
    if (!text.trim()) return;
    setIsTranslating(true);
    try {
      const source = sourceLanguage === 'auto' ? '' : sourceLanguage;
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${targetLanguage}`);
      const data = await response.json();
      if (data?.responseData?.translatedText) {
        let translated = data.responseData.translatedText;
        translated = translated.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        setTranslatedText(translated);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslate = () => {
    translateText(inputText);
  };

  const travelPhrases = [
    "Where is the nearest hotel?",
    "How much does this cost?",
    "I need a doctor, please.",
    "Where is the restroom?",
    "Can I have the menu, please?",
    "What time does the train leave?",
    "Help me, please!",
    "Where is the metro station?"
  ];

  return (
    <div>
      {/* Language Selection */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>From:</label>
          <select
            value={sourceLanguage}
            onChange={(e) => setSourceLanguage(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db' }}
          >
            {Object.entries(languages).map(([code, lang]) => (
              <option key={code} value={code}>{lang.flag} {lang.name}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>To:</label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db' }}
          >
            {Object.entries(languages).filter(([code]) => code !== 'auto').map(([code, lang]) => (
              <option key={code} value={code}>{lang.flag} {lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Area */}
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type or speak any text to translate..."
        rows="3"
        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db', marginBottom: '12px', fontSize: '14px' }}
      />

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleTranslate} 
          disabled={isTranslating || !inputText.trim()} 
          style={{ flex: 1, padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: (!inputText.trim() || isTranslating) ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
        >
          {isTranslating ? 'Translating...' : 'Translate ✨'}
        </button>
        <button 
          onClick={startListening} 
          onDoubleClick={stopSpeaking} 
          style={{ padding: '10px 20px', backgroundColor: isListening ? '#ef4444' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          title="Single click to speak, double click to stop"
        >
          {isListening ? '🔴 Listening...' : '🎤 Speak'}
        </button>
        <button 
          onClick={() => speakText(translatedText, targetLanguage)} 
          disabled={!translatedText} 
          style={{ padding: '10px 20px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: !translatedText ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
        >
          {isSpeaking ? '🔊 Speaking...' : '🔊 Listen'}
        </button>
      </div>

      {/* Translation Output */}
      {translatedText && (
        <div style={{ padding: '12px', backgroundColor: '#e0e7ff', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#4338ca', marginBottom: '4px' }}>
            Translation ({languages[targetLanguage]?.flag} {languages[targetLanguage]?.name}):
          </div>
          <div style={{ fontSize: '15px', color: '#1e1b4b' }}>{translatedText}</div>
        </div>
      )}

      {/* Quick Phrases */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>📝 Quick Travel Phrases:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {travelPhrases.map((phrase, idx) => (
            <button 
              key={idx} 
              onClick={() => setInputText(phrase)} 
              style={{ padding: '6px 12px', backgroundColor: '#fef9c3', border: '1px solid #fde047', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}
            >
              {phrase}
            </button>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div style={{ marginTop: '16px', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: '11px', textAlign: 'center' }}>
        💡 <strong>Tip:</strong> Click 🎤 once to speak, <strong>double-click</strong> to stop. Translation happens automatically!
      </div>
    </div>
  );
}

export default Header;