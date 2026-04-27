import React, { useState, useRef, useEffect } from 'react'

function LanguageTranslator() {
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('auto')
  const [targetLanguage, setTargetLanguage] = useState('hi')
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [sourceSearch, setSourceSearch] = useState('')
  const [targetSearch, setTargetSearch] = useState('')
  const [showSourceDropdown, setShowSourceDropdown] = useState(false)
  const [showTargetDropdown, setShowTargetDropdown] = useState(false)

  const sourceRef = useRef(null)
  const targetRef = useRef(null)

  // ---------- Complete language list (Google Translate codes) ----------
  const languages = {
    auto: 'Auto Detect',
    af: 'Afrikaans', sq: 'Albanian', am: 'Amharic', ar: 'Arabic', hy: 'Armenian', az: 'Azerbaijani',
    eu: 'Basque', be: 'Belarusian', bn: 'Bengali', bs: 'Bosnian', bg: 'Bulgarian', ca: 'Catalan',
    ceb: 'Cebuano', ny: 'Chichewa', 'zh-CN': 'Chinese (Simplified)', 'zh-TW': 'Chinese (Traditional)', co: 'Corsican',
    hr: 'Croatian', cs: 'Czech', da: 'Danish', nl: 'Dutch', en: 'English', eo: 'Esperanto',
    et: 'Estonian', tl: 'Filipino', fi: 'Finnish', fr: 'French', fy: 'Frisian', gl: 'Galician',
    ka: 'Georgian', de: 'German', el: 'Greek', gu: 'Gujarati', ht: 'Haitian Creole', ha: 'Hausa',
    haw: 'Hawaiian', iw: 'Hebrew', hi: 'Hindi', hmn: 'Hmong', hu: 'Hungarian', is: 'Icelandic',
    ig: 'Igbo', id: 'Indonesian', ga: 'Irish', it: 'Italian', ja: 'Japanese', jv: 'Javanese',
    kn: 'Kannada', kk: 'Kazakh', km: 'Khmer', rw: 'Kinyarwanda', ko: 'Korean', ku: 'Kurdish',
    ky: 'Kyrgyz', lo: 'Lao', la: 'Latin', lv: 'Latvian', lt: 'Lithuanian', lb: 'Luxembourgish',
    mk: 'Macedonian', mg: 'Malagasy', ms: 'Malay', ml: 'Malayalam', mt: 'Maltese', mi: 'Maori',
    mr: 'Marathi', mn: 'Mongolian', my: 'Myanmar (Burmese)', ne: 'Nepali', no: 'Norwegian', or: 'Odia',
    ps: 'Pashto', fa: 'Persian', pl: 'Polish', pt: 'Portuguese', pa: 'Punjabi', ro: 'Romanian',
    ru: 'Russian', sm: 'Samoan', gd: 'Scots Gaelic', sr: 'Serbian', st: 'Sesotho', sn: 'Shona',
    sd: 'Sindhi', si: 'Sinhala', sk: 'Slovak', sl: 'Slovenian', so: 'Somali', es: 'Spanish',
    su: 'Sundanese', sw: 'Swahili', sv: 'Swedish', tg: 'Tajik', ta: 'Tamil', tt: 'Tatar',
    te: 'Telugu', th: 'Thai', tr: 'Turkish', tk: 'Turkmen', uk: 'Ukrainian', ur: 'Urdu',
    ug: 'Uyghur', uz: 'Uzbek', vi: 'Vietnamese', cy: 'Welsh', xh: 'Xhosa', yi: 'Yiddish',
    yo: 'Yoruba', zu: 'Zulu'
  }

  // Simple flags (optional, for better UI)
  const flags = {
    en: '🇬🇧', hi: '🇮🇳', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', it: '🇮🇹', pt: '🇵🇹', ru: '🇷🇺',
    ja: '🇯🇵', ko: '🇰🇷', 'zh-CN': '🇨🇳', ar: '🇸🇦', bn: '🇧🇩', ta: '🇮🇳', te: '🇮🇳', mr: '🇮🇳',
    ur: '🇵🇰', tr: '🇹🇷', nl: '🇳🇱', sv: '🇸🇪', pl: '🇵🇱', uk: '🇺🇦', el: '🇬🇷', th: '🇹🇭',
    vi: '🇻🇳', id: '🇮🇩', ms: '🇲🇾', ne: '🇳🇵', sw: '🇹🇿', am: '🇪🇹'
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target)) setShowSourceDropdown(false)
      if (targetRef.current && !targetRef.current.contains(event.target)) setShowTargetDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getFilteredLanguages = (searchTerm) => {
    let filtered = Object.entries(languages)
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(([code, name]) =>
        name.toLowerCase().includes(term) || code.toLowerCase().includes(term)
      )
    }
    return filtered
  }

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const speakText = (text, langCode) => {
    if (!window.speechSynthesis || !text) return
    stopSpeaking()
    const utterance = new SpeechSynthesisUtterance(text)
    const voiceMap = {
      en: 'en-US', hi: 'hi-IN', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
      it: 'it-IT', pt: 'pt-PT', ru: 'ru-RU', ja: 'ja-JP', ko: 'ko-KR',
      'zh-CN': 'zh-CN', ar: 'ar-SA', tr: 'tr-TR', nl: 'nl-NL', sv: 'sv-SE',
      pl: 'pl-PL', uk: 'uk-UA', el: 'el-GR', th: 'th-TH', vi: 'vi-VN',
      id: 'id-ID', ne: 'ne-NP', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN'
    }
    utterance.lang = voiceMap[langCode] || 'en-US'
    utterance.rate = 0.9
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported. Please use Chrome.')
      return
    }
    const recognition = new window.webkitSpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript
      setInputText(spokenText)
      translateText(spokenText)
    }
    recognition.start()
  }

  const translateText = async (text) => {
    if (!text.trim()) return
    setIsTranslating(true)
    try {
      const source = sourceLanguage === 'auto' ? '' : sourceLanguage
      const target = targetLanguage
      // Google Translate public endpoint (works without API key)
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
      const response = await fetch(url)
      const data = await response.json()
      if (data && data[0]) {
        const translated = data[0].map(item => item[0]).join('')
        setTranslatedText(translated)
      } else {
        setTranslatedText('Translation failed. Please try again.')
      }
    } catch (error) {
      console.error('Translation error:', error)
      setTranslatedText('Error translating. Check your connection.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleTranslate = () => translateText(inputText)

  const swapLanguages = () => {
    if (sourceLanguage !== 'auto') {
      const temp = sourceLanguage
      setSourceLanguage(targetLanguage)
      setTargetLanguage(temp)
      setInputText(translatedText)
      setTranslatedText('')
    }
  }

  const travelPhrases = [
    'Where is the nearest hotel?',
    'How much does this cost?',
    'I need a doctor, please.',
    'Where is the restroom?',
    'Can I have the menu, please?',
    'What time does the train leave?',
    'Help me, please!',
    'How are you?'
  ]

  const sourceLanguages = getFilteredLanguages(sourceSearch)
  const targetLanguages = getFilteredLanguages(targetSearch)

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        🌍 Universal Language Translator
      </h3>

      {/* Language Selection */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Source Language */}
        <div style={{ flex: 1 }} ref={sourceRef}>
          <label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>From:</label>
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowSourceDropdown(!showSourceDropdown)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'white' }}
            >
              <span>{flags[sourceLanguage] || '🌐'} {languages[sourceLanguage] || 'Auto Detect'}{sourceLanguage === 'auto' && ' (Auto)'}</span>
              <span>▼</span>
            </div>
            {showSourceDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '4px', maxHeight: '350px', overflow: 'auto', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <input
                  type="text"
                  placeholder="🔍 Search language..."
                  value={sourceSearch}
                  onChange={(e) => setSourceSearch(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: 'none', borderBottom: '1px solid #e5e7eb', outline: 'none' }}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {sourceLanguages.map(([code, name]) => (
                    <div
                      key={code}
                      onClick={() => {
                        setSourceLanguage(code)
                        setShowSourceDropdown(false)
                        setSourceSearch('')
                      }}
                      style={{ padding: '10px 12px', cursor: 'pointer', backgroundColor: sourceLanguage === code ? '#e0e7ff' : 'white', borderBottom: '1px solid #f3f4f6' }}
                    >
                      {flags[code] || '🌐'} {name}
                    </div>
                  ))}
                  {sourceLanguages.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No languages found</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '28px' }}>
          <button onClick={swapLanguages} style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '20px' }}>🔄</button>
        </div>

        {/* Target Language */}
        <div style={{ flex: 1 }} ref={targetRef}>
          <label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>To:</label>
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowTargetDropdown(!showTargetDropdown)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'white' }}
            >
              <span>{flags[targetLanguage] || '🌐'} {languages[targetLanguage]}</span>
              <span>▼</span>
            </div>
            {showTargetDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', marginTop: '4px', maxHeight: '350px', overflow: 'auto', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <input
                  type="text"
                  placeholder="🔍 Search language..."
                  value={targetSearch}
                  onChange={(e) => setTargetSearch(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: 'none', borderBottom: '1px solid #e5e7eb', outline: 'none' }}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {targetLanguages.map(([code, name]) => (
                    <div
                      key={code}
                      onClick={() => {
                        setTargetLanguage(code)
                        setShowTargetDropdown(false)
                        setTargetSearch('')
                      }}
                      style={{ padding: '10px 12px', cursor: 'pointer', backgroundColor: targetLanguage === code ? '#e0e7ff' : 'white', borderBottom: '1px solid #f3f4f6' }}
                    >
                      {flags[code] || '🌐'} {name}
                    </div>
                  ))}
                  {targetLanguages.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No languages found</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type or speak any text to translate... (130+ languages)"
        rows="3"
        style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #d1d5db', marginBottom: '12px', fontSize: '14px', resize: 'vertical' }}
      />

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={handleTranslate} disabled={isTranslating || !inputText.trim()} style={{ flex: 1, padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isTranslating ? 'Translating...' : 'Translate ✨'}
        </button>
        <button onClick={startListening} onDoubleClick={stopSpeaking} style={{ padding: '10px 20px', backgroundColor: isListening ? '#ef4444' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isListening ? '🔴 Listening...' : '🎤 Speak'}
        </button>
        <button onClick={() => speakText(translatedText, targetLanguage)} disabled={!translatedText} style={{ padding: '10px 20px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isSpeaking ? '🔊 Speaking...' : '🔊 Listen'}
        </button>
      </div>

      {/* Translation Output */}
      {translatedText && (
        <div style={{ padding: '12px', backgroundColor: '#e0e7ff', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#4338ca', marginBottom: '4px' }}>
            Translation ({flags[targetLanguage] || '🌐'} {languages[targetLanguage]}):
          </div>
          <div style={{ fontSize: '15px', color: '#1e1b4b' }}>{translatedText}</div>
        </div>
      )}

      {/* Quick Phrases */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>📝 Quick Travel Phrases:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {travelPhrases.map((phrase, idx) => (
            <button key={idx} onClick={() => setInputText(phrase)} style={{ padding: '6px 12px', backgroundColor: '#fef9c3', border: '1px solid #fde047', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}>
              {phrase}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '16px', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '8px', fontSize: '11px', textAlign: 'center' }}>
        🌍 {Object.keys(languages).length - 1} Languages • Google Translate • 🔍 Search any language • 💡 Click 🎤 to speak, double-click to stop
      </div>
    </div>
  )
}

export default LanguageTranslator