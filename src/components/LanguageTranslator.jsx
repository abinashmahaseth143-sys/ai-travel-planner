import React, { useState, useRef, useEffect } from 'react'

function LanguageTranslator() {
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [sourceSearch, setSourceSearch] = useState('')
  const [targetSearch, setTargetSearch] = useState('')
  const [showSourceDropdown, setShowSourceDropdown] = useState(false)
  const [showTargetDropdown, setShowTargetDropdown] = useState(false)
  const [copyInput, setCopyInput] = useState(false)
  const [copyOutput, setCopyOutput] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  const sourceRef = useRef(null)
  const targetRef = useRef(null)
  const recognitionRef = useRef(null)

  // Track window size for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Responsive breakpoints
  const isMobile = windowWidth <= 768
  const isSmallMobile = windowWidth <= 480

  // COMPLETE 212+ WORLD LANGUAGES
  const languages = {
    // Official UN Languages (6)
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    ru: 'Russian',
    zh: 'Chinese',
    ar: 'Arabic',
    
    // Other Major Languages (30+)
    hi: 'Hindi',
    bn: 'Bengali',
    pt: 'Portuguese',
    id: 'Indonesian',
    ur: 'Urdu',
    de: 'German',
    ja: 'Japanese',
    ko: 'Korean',
    it: 'Italian',
    tr: 'Turkish',
    vi: 'Vietnamese',
    ta: 'Tamil',
    te: 'Telugu',
    mr: 'Marathi',
    gu: 'Gujarati',
    kn: 'Kannada',
    ml: 'Malayalam',
    pa: 'Punjabi',
    ne: 'Nepali',
    si: 'Sinhala',
    my: 'Burmese',
    km: 'Khmer',
    lo: 'Lao',
    th: 'Thai',
    ms: 'Malay',
    fil: 'Filipino',
    nl: 'Dutch',
    sv: 'Swedish',
    no: 'Norwegian',
    da: 'Danish',
    fi: 'Finnish',
    pl: 'Polish',
    cs: 'Czech',
    hu: 'Hungarian',
    ro: 'Romanian',
    bg: 'Bulgarian',
    el: 'Greek',
    he: 'Hebrew',
    fa: 'Persian',
    uk: 'Ukrainian',
    
    // European Languages (40+)
    sr: 'Serbian',
    hr: 'Croatian',
    sk: 'Slovak',
    sl: 'Slovenian',
    lt: 'Lithuanian',
    lv: 'Latvian',
    et: 'Estonian',
    is: 'Icelandic',
    ga: 'Irish',
    cy: 'Welsh',
    mt: 'Maltese',
    sq: 'Albanian',
    mk: 'Macedonian',
    bs: 'Bosnian',
    ca: 'Catalan',
    eu: 'Basque',
    gl: 'Galician',
    oc: 'Occitan',
    br: 'Breton',
    fy: 'Frisian',
    lb: 'Luxembourgish',
    sc: 'Sardinian',
    nap: 'Neapolitan',
    sic: 'Sicilian',
    lij: 'Ligurian',
    fur: 'Friulian',
    lad: 'Ladino',
    ast: 'Asturian',
    arag: 'Aragonese',
    vec: 'Venetian',
    lmo: 'Lombard',
    pms: 'Piedmontese',
    eml: 'Emilian-Romagnol',
    wln: 'Walloon',
    vls: 'West Flemish',
    lim: 'Limburgish',
    zea: 'Zeelandic',
    fry: 'West Frisian',
    stq: 'Saterland Frisian',
    nds: 'Low German',
    pdc: 'Pennsylvania German',
    gsw: 'Swiss German',
    bar: 'Bavarian',
    cim: 'Cimbrian',
    rm: 'Romansh',
    lld: 'Ladin',
    ron: 'Romantsch',
    frp: 'Franco-Provençal',
    
    // Asian Languages (50+)
    mn: 'Mongolian',
    ug: 'Uyghur',
    bo: 'Tibetan',
    dz: 'Dzongkha',
    ky: 'Kyrgyz',
    kk: 'Kazakh',
    tk: 'Turkmen',
    tg: 'Tajik',
    ps: 'Pashto',
    sd: 'Sindhi',
    bal: 'Balochi',
    awa: 'Awadhi',
    hif: 'Fiji Hindi',
    bho: 'Bhojpuri',
    mai: 'Maithili',
    mag: 'Magahi',
    sat: 'Santali',
    or: 'Odia',
    asm: 'Assamese',
    mni: 'Manipuri',
    kha: 'Khasi',
    miz: 'Mizo',
    brx: 'Bodo',
    kok: 'Konkani',
    gom: 'Goan Konkani',
    tcy: 'Tulu',
    az: 'Azerbaijani',
    hy: 'Armenian',
    ka: 'Georgian',
    ku: 'Kurdish',
    
    // Middle Eastern Languages (15+)
    am: 'Amharic',
    ti: 'Tigrinya',
    so: 'Somali',
    om: 'Oromo',
    kab: 'Kabyle',
    tam: 'Tamazight',
    ary: 'Moroccan Arabic',
    arz: 'Egyptian Arabic',
    acm: 'Mesopotamian Arabic',
    
    // African Languages (40+)
    sw: 'Swahili',
    zu: 'Zulu',
    xh: 'Xhosa',
    st: 'Sesotho',
    tn: 'Setswana',
    ts: 'Tsonga',
    ve: 'Venda',
    nr: 'South Ndebele',
    ny: 'Chichewa',
    ig: 'Igbo',
    yo: 'Yoruba',
    ha: 'Hausa',
    wo: 'Wolof',
    ff: 'Fula',
    mos: 'Mossi',
    ew: 'Ewe',
    ak: 'Akan',
    tw: 'Twi',
    fon: 'Fon',
    bamb: 'Bambara',
    diu: 'Dinka',
    nus: 'Nuer',
    luo: 'Luo',
    lug: 'Ganda',
    run: 'Kirundi',
    kin: 'Kinyarwanda',
    sna: 'Shona',
    nd: 'North Ndebele',
    ln: 'Lingala',
    kg: 'Kongo',
    rw: 'Kinyarwanda',
    lg: 'Luganda',
    
    // Americas (Indigenous + Regional) (30+)
    qu: 'Quechua',
    ay: 'Aymara',
    gn: 'Guarani',
    map: 'Mapudungun',
    haw: 'Hawaiian',
    tah: 'Tahitian',
    rap: 'Rapanui',
    smo: 'Samoan',
    mao: 'Maori',
    ton: 'Tongan',
    fj: 'Fijian',
    hil: 'Hiligaynon',
    ceb: 'Cebuano',
    ilo: 'Ilocano',
    bik: 'Bikol',
    pam: 'Kapampangan',
    pang: 'Pangasinan',
    war: 'Waray',
    tgl: 'Tagalog',
    mri: 'Cook Islands Maori',
    rar: 'Rarotongan',
    niu: 'Niuean',
    tpi: 'Tok Pisin',
    bis: 'Bislama',
    hmo: 'Hiri Motu',
    pou: 'Pohnpeian',
    chu: 'Chuukese',
    kos: 'Kosraean',
    mah: 'Marshallese',
    kal: 'Kalaallisut',
    cre: 'Cree',
    oji: 'Ojibwe',
    moh: 'Mohawk',
    nav: 'Navajo',
    che: 'Cherokee',
    lak: 'Lakota',
    dak: 'Dakota',
    hop: 'Hopi',
    zun: 'Zuni',
    
    // Constructed Languages (10+)
    epo: 'Esperanto',
    ido: 'Ido',
    vol: 'Volapük',
    ina: 'Interlingua',
    ile: 'Interlingue',
    lat: 'Latin',
    tlh: 'Klingon',
    
    // South Asian Regional (additional)
    srd: 'Sardinian'
  }

  // Flags for major languages
  const flags = {
    en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷', ru: '🇷🇺', zh: '🇨🇳', ar: '🇸🇦',
    de: '🇩🇪', pt: '🇵🇹', hi: '🇮🇳', ja: '🇯🇵', ko: '🇰🇷', it: '🇮🇹',
    nl: '🇳🇱', sv: '🇸🇪', no: '🇳🇴', da: '🇩🇰', fi: '🇫🇮', pl: '🇵🇱',
    uk: '🇺🇦', cs: '🇨🇿', hu: '🇭🇺', ro: '🇷🇴', bg: '🇧🇬', el: '🇬🇷',
    tr: '🇹🇷', sr: '🇷🇸', hr: '🇭🇷', sk: '🇸🇰', sl: '🇸🇮', lt: '🇱🇹',
    lv: '🇱🇻', et: '🇪🇪', is: '🇮🇸', ga: '🇮🇪', cy: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', mt: '🇲🇹',
    th: '🇹🇭', vi: '🇻🇳', id: '🇮🇩', ms: '🇲🇾', fil: '🇵🇭', ta: '🇮🇳',
    te: '🇮🇳', mr: '🇮🇳', gu: '🇮🇳', kn: '🇮🇳', ml: '🇮🇳', pa: '🇮🇳',
    bn: '🇧🇩', ne: '🇳🇵', si: '🇱🇰', my: '🇲🇲', km: '🇰🇭', lo: '🇱🇦',
    mn: '🇲🇳', kk: '🇰🇿', az: '🇦🇿', hy: '🇦🇲', ka: '🇬🇪', he: '🇮🇱',
    fa: '🇮🇷', am: '🇪🇹', so: '🇸🇴', sw: '🇹🇿', zu: '🇿🇦', xh: '🇿🇦',
    ha: '🇳🇬', ig: '🇳🇬', yo: '🇳🇬', epo: '🟢', lat: '🏛️'
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
    // Sort alphabetically by name
    filtered.sort((a, b) => a[1].localeCompare(b[1]))
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
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      
      const voiceMap = {
        en: 'en-US', hi: 'hi-IN', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
        it: 'it-IT', pt: 'pt-PT', ru: 'ru-RU', ja: 'ja-JP', ko: 'ko-KR',
        zh: 'zh-CN', ar: 'ar-SA', tr: 'tr-TR', nl: 'nl-NL', sv: 'sv-SE',
        pl: 'pl-PL', uk: 'uk-UA', el: 'el-GR', th: 'th-TH', vi: 'vi-VN',
        id: 'id-ID', ne: 'ne-NP', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN',
        da: 'da-DK', no: 'no-NO', fi: 'fi-FI', cs: 'cs-CZ',
        hu: 'hu-HU', ro: 'ro-RO', bg: 'bg-BG', hr: 'hr-HR', sk: 'sk-SK'
      }
      
      utterance.lang = voiceMap[langCode] || 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1.0
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    }, 100)
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
      setIsListening(false)
    }
  }

  const startListening = () => {
    if (recognitionRef.current) {
      stopListening()
      return
    }
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported. Please use Chrome, Edge, or Safari.')
      return
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    
    recognition.onstart = () => {
      setIsListening(true)
    }
    
    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
    }
    
    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error)
      setIsListening(false)
      recognitionRef.current = null
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice input.')
      }
    }
    
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript
      // ONLY set the input text - NO automatic translation
      setInputText(spokenText)
      setCharCount(spokenText.length)
      // Clear previous translation when new voice input is added
      setTranslatedText('')
      console.log('Voice recognized:', spokenText)
    }
    
    recognition.start()
  }

  const translateText = async () => {
    const text = inputText
    if (!text.trim()) {
      alert('Please enter or speak some text to translate')
      return
    }
    setIsTranslating(true)
    try {
      const source = sourceLanguage
      const target = targetLanguage
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

  const handleTranslate = () => translateText()

  const swapLanguages = () => {
    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)
    setInputText(translatedText)
    setTranslatedText('')
    setCharCount(translatedText.length)
  }

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'input') {
        setCopyInput(true)
        setTimeout(() => setCopyInput(false), 1500)
      } else {
        setCopyOutput(true)
        setTimeout(() => setCopyOutput(false), 1500)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleInputChange = (e) => {
    setInputText(e.target.value)
    setCharCount(e.target.value.length)
    // Clear translation when user types new text
    setTranslatedText('')
  }

  const travelPhrases = [
    'Where is the nearest hotel?',
    'How much does this cost?',
    'I need a doctor, please.',
    'Where is the restroom?',
    'Can I have the menu, please?',
    'What time does the train leave?',
    'Help me, please!',
    'How are you?',
    'Thank you very much',
    'What is your name?',
    'How do I get to the airport?',
    'I would like to order food'
  ]

  const sourceLanguages = getFilteredLanguages(sourceSearch)
  const targetLanguages = getFilteredLanguages(targetSearch)

  const getLanguageDisplay = (code) => {
    return languages[code] || code
  }

  const getFlag = (code) => {
    return flags[code] || '🌐'
  }

  // Responsive styles
  const heroPadding = isMobile ? '16px' : '28px'
  const heroBorderRadius = isMobile ? '20px' : '28px'
  const heroFontSize = isMobile ? '22px' : '28px'
  const sectionPadding = isMobile ? '16px' : '24px'
  const sectionBorderRadius = isMobile ? '20px' : '24px'
  const gridGap = isMobile ? '10px' : '16px'
  const swapButtonSize = isMobile ? '40px' : '48px'
  const micButtonSize = isMobile ? '40px' : '48px'

  const totalLanguages = Object.keys(languages).length

  return (
    <div style={{
      width: '100%',
      margin: 0,
      padding: 0,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        marginBottom: isMobile ? '20px' : '32px',
        padding: heroPadding,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: heroBorderRadius,
        color: 'white'
      }}>
        <div style={{ fontSize: isMobile ? '40px' : '52px', marginBottom: '8px' }}>🌐</div>
        <h1 style={{ fontSize: heroFontSize, fontWeight: 'bold', marginBottom: '8px' }}>
          {isSmallMobile ? "Translator" : "Universal Language Translator"}
        </h1>
        {!isSmallMobile && (
          <>
            <p style={{ fontSize: isMobile ? '12px' : '14px', opacity: 0.9 }}>
              Translate between {totalLanguages}+ languages from around the world
            </p>
            <p style={{ fontSize: isMobile ? '10px' : '12px', opacity: 0.7, marginTop: '8px' }}>
              🌍 Every language, every dialect, every voice matters
            </p>
          </>
        )}
        {isSmallMobile && (
          <p style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px' }}>
            {totalLanguages}+ Languages Worldwide
          </p>
        )}
      </div>

      {/* Language Selector Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: gridGap,
        marginBottom: isMobile ? '20px' : '32px',
        alignItems: 'center'
      }}>
        {/* Source Language Card */}
        <div ref={sourceRef} style={{
          background: 'white',
          borderRadius: isMobile ? '16px' : '20px',
          padding: isMobile ? '12px' : '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
          position: 'relative'
        }}>
          <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#64748b', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>
            📤 {isMobile ? "FROM" : "TRANSLATE FROM"}
          </div>
          <div
            onClick={() => setShowSourceDropdown(!showSourceDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '8px' : '12px',
              background: '#f8fafc',
              borderRadius: '12px',
              cursor: 'pointer',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ 
              fontSize: isMobile ? '13px' : '15px', 
              fontWeight: '500', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap'
            }}>
              {getFlag(sourceLanguage)} {getLanguageDisplay(sourceLanguage)}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>▼</span>
          </div>
          {showSourceDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 1000,
              background: 'white',
              borderRadius: '12px',
              marginTop: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0',
              width: '100%',
              maxHeight: '350px',
              overflow: 'auto'
            }}>
              <input
                type="text"
                placeholder="🔍 Search 212+ languages..."
                value={sourceSearch}
                onChange={(e) => setSourceSearch(e.target.value)}
                style={{ width: '100%', padding: '12px', border: 'none', borderBottom: '1px solid #e2e8f0', outline: 'none', fontSize: isMobile ? '13px' : '14px' }}
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
                    style={{
                      padding: '10px 12px',
                      cursor: 'pointer',
                      background: sourceLanguage === code ? '#eef2ff' : 'white',
                      fontSize: isMobile ? '12px' : '13px',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.1s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{getFlag(code)}</span>
                    <span style={{ flex: 1 }}>{name}</span>
                    {!isSmallMobile && <span style={{ fontSize: '10px', color: '#94a3b8' }}>{code.toUpperCase()}</span>}
                  </div>
                ))}
              </div>
              <div style={{ padding: '8px 12px', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                {sourceLanguages.length} of {totalLanguages}+ languages
              </div>
            </div>
          )}
        </div>

        {/* Swap Button */}
        <button
          onClick={swapLanguages}
          style={{
            width: swapButtonSize,
            height: swapButtonSize,
            borderRadius: '50%',
            background: 'white',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            fontSize: isMobile ? '16px' : '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            flexShrink: 0
          }}
        >
          🔄
        </button>

        {/* Target Language Card */}
        <div ref={targetRef} style={{
          background: 'white',
          borderRadius: isMobile ? '16px' : '20px',
          padding: isMobile ? '12px' : '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
          position: 'relative'
        }}>
          <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#64748b', marginBottom: '8px', fontWeight: '600', letterSpacing: '0.5px' }}>
            📥 {isMobile ? "TO" : "TRANSLATE TO"}
          </div>
          <div
            onClick={() => setShowTargetDropdown(!showTargetDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '8px' : '12px',
              background: '#f8fafc',
              borderRadius: '12px',
              cursor: 'pointer',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ 
              fontSize: isMobile ? '13px' : '15px', 
              fontWeight: '500', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap'
            }}>
              {getFlag(targetLanguage)} {getLanguageDisplay(targetLanguage)}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '12px' }}>▼</span>
          </div>
          {showTargetDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 1000,
              background: 'white',
              borderRadius: '12px',
              marginTop: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0',
              width: '100%',
              maxHeight: '350px',
              overflow: 'auto'
            }}>
              <input
                type="text"
                placeholder="🔍 Search 212+ languages..."
                value={targetSearch}
                onChange={(e) => setTargetSearch(e.target.value)}
                style={{ width: '100%', padding: '12px', border: 'none', borderBottom: '1px solid #e2e8f0', outline: 'none', fontSize: isMobile ? '13px' : '14px' }}
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
                    style={{
                      padding: '10px 12px',
                      cursor: 'pointer',
                      background: targetLanguage === code ? '#eef2ff' : 'white',
                      fontSize: isMobile ? '12px' : '13px',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.1s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{getFlag(code)}</span>
                    <span style={{ flex: 1 }}>{name}</span>
                    {!isSmallMobile && <span style={{ fontSize: '10px', color: '#94a3b8' }}>{code.toUpperCase()}</span>}
                  </div>
                ))}
              </div>
              <div style={{ padding: '8px 12px', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                {targetLanguages.length} of {totalLanguages}+ languages
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div style={{
        background: 'white',
        borderRadius: sectionBorderRadius,
        padding: sectionPadding,
        marginBottom: isMobile ? '16px' : '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: isMobile ? '18px' : '20px' }}>📝</span>
            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: isMobile ? '14px' : '16px' }}>Source Text</span>
            <span style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>
              {getFlag(sourceLanguage)} {getLanguageDisplay(sourceLanguage)}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(inputText, 'input')}
            disabled={!inputText}
            style={{
              padding: '4px 12px',
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '20px',
              cursor: inputText ? 'pointer' : 'not-allowed',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: inputText ? 1 : 0.5,
              transition: 'all 0.2s'
            }}
          >
            📋 {copyInput ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div style={{ position: 'relative', width: '100%' }}>
          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder={`Type text in ${getLanguageDisplay(sourceLanguage)} or click the microphone to speak...`}
            rows={isMobile ? 3 : 4}
            style={{
              width: '100%',
              padding: isMobile ? '12px' : '16px',
              paddingRight: isMobile ? '50px' : '60px',
              fontSize: isMobile ? '14px' : '15px',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              resize: 'vertical',
              fontFamily: 'inherit',
              background: '#fafbfc',
              lineHeight: '1.5',
              transition: 'border 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#667eea'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
          />
          <button
            onClick={startListening}
            onDoubleClick={stopListening}
            style={{
              position: 'absolute',
              bottom: isMobile ? '12px' : '16px',
              right: isMobile ? '12px' : '16px',
              background: isListening 
                ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                : 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              borderRadius: '50%',
              width: micButtonSize,
              height: micButtonSize,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: isListening 
                ? '0 0 0 3px rgba(239, 68, 68, 0.3), 0 4px 12px rgba(0,0,0,0.15)' 
                : '0 4px 12px rgba(16, 185, 129, 0.3)',
              animation: isListening ? 'pulse 1.5s infinite' : 'none'
            }}
            title={isListening ? "Listening... Double-click to stop" : "Click to speak (Single click start, double-click stop)"}
          >
            {isListening ? (
              <svg width={isMobile ? "18" : "24"} height={isMobile ? "18" : "24"} viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                <rect x="9" y="9" width="6" height="6" fill="white" rx="1"/>
              </svg>
            ) : (
              <svg width={isMobile ? "16" : "22"} height={isMobile ? "16" : "22"} viewBox="0 0 24 24" fill="white">
                <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            )}
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '10px', color: '#94a3b8' }}>
          <span>{charCount} characters</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ 
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isListening ? '#ef4444' : '#10b981',
              animation: isListening ? 'pulse 1s infinite' : 'none'
            }}></span>
            {isListening ? 'Listening...' : (inputText ? `${Math.round(charCount / 5)} words` : 'Click 🎤 to speak')}
          </span>
        </div>
      </div>

      {/* Translate Button - Press this after speaking/typing */}
      <button
        onClick={handleTranslate}
        disabled={isTranslating || !inputText.trim()}
        style={{
          width: '100%',
          padding: isMobile ? '12px' : '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '60px',
          cursor: (!inputText.trim() || isTranslating) ? 'not-allowed' : 'pointer',
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: 'bold',
          marginBottom: isMobile ? '16px' : '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.3s ease',
          opacity: (!inputText.trim() || isTranslating) ? 0.6 : 1,
          boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)'
        }}
        onMouseEnter={(e) => {
          if (inputText.trim() && !isTranslating) {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(102, 126, 234, 0.4)'
        }}
      >
        {isTranslating ? (
          <>
            <span>⏳</span> Translating...
          </>
        ) : (
          <>
            <span>✨</span> {isMobile ? "Translate" : "Translate Now"}
            {!isMobile && <span>→</span>}
          </>
        )}
      </button>

      {/* Output Section */}
      <div style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: sectionBorderRadius,
        padding: sectionPadding,
        marginBottom: isMobile ? '16px' : '24px',
        border: '1px solid #e2e8f0',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: isMobile ? '18px' : '20px' }}>🔤</span>
            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: isMobile ? '14px' : '16px' }}>Translation</span>
            <span style={{ fontSize: '10px', color: '#64748b', background: '#e2e8f0', padding: '2px 8px', borderRadius: '12px' }}>
              {getFlag(targetLanguage)} {getLanguageDisplay(targetLanguage)}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => copyToClipboard(translatedText, 'output')}
              disabled={!translatedText}
              style={{
                padding: '4px 12px',
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                cursor: translatedText ? 'pointer' : 'not-allowed',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                opacity: translatedText ? 1 : 0.5,
                transition: 'all 0.2s'
              }}
            >
              📋 {copyOutput ? 'Copied!' : 'Copy'}
            </button>
            
            <button
              onClick={() => {
                if (translatedText && !isSpeaking) {
                  speakText(translatedText, targetLanguage)
                } else if (isSpeaking) {
                  stopSpeaking()
                }
              }}
              disabled={!translatedText}
              style={{
                padding: '4px 12px',
                background: isSpeaking 
                  ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
                  : 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                cursor: translatedText ? 'pointer' : 'not-allowed',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: '500',
                color: isSpeaking ? 'white' : '#1e293b',
                transition: 'all 0.3s ease',
                opacity: translatedText ? 1 : 0.5
              }}
              title={isSpeaking ? "Speaking... Click to stop" : "Listen to translation"}
            >
              {isSpeaking ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                  </svg>
                  Stop
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                  Listen
                </>
              )}
            </button>
          </div>
        </div>
        <div style={{
          background: 'white',
          padding: isMobile ? '16px' : '20px',
          borderRadius: '16px',
          minHeight: isMobile ? '100px' : '120px',
          border: '1px solid #e2e8f0'
        }}>
          {translatedText ? (
            <div style={{ fontSize: isMobile ? '14px' : '16px', color: '#1e293b', lineHeight: '1.6', wordBreak: 'break-word' }}>{translatedText}</div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '16px' }}>
              <span style={{ fontSize: isMobile ? '24px' : '32px', display: 'block', marginBottom: '8px' }}>🌐</span>
              {!isSmallMobile ? "Press 'Translate Now' to see translation" : "Press Translate to see result"}
            </div>
          )}
        </div>
      </div>

      {/* Quick Phrases - Only fill input, don't auto-translate */}
      {!isSmallMobile && (
        <div style={{
          background: 'white',
          borderRadius: isMobile ? '16px' : '20px',
          padding: isMobile ? '16px' : '20px',
          marginBottom: isMobile ? '16px' : '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: isMobile ? '16px' : '18px' }}>⚡</span>
            <span style={{ fontWeight: '600', color: '#1e293b', fontSize: isMobile ? '14px' : '16px' }}>Quick Travel Phrases</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {travelPhrases.slice(0, isMobile ? 8 : 12).map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(phrase)
                  setCharCount(phrase.length)
                  setTranslatedText('') // Clear previous translation
                }}
                style={{
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '11px' : '13px',
                  transition: 'all 0.2s'
                }}
              >
                {isMobile && phrase.length > 25 ? phrase.substring(0, 20) + '...' : phrase}
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#94a3b8' }}>
            💡 Click any phrase above, then press "Translate Now"
          </div>
        </div>
      )}

      {/* Features Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: isMobile ? '12px' : '24px',
        flexWrap: 'wrap',
        padding: isMobile ? '12px' : '16px',
        background: '#f8fafc',
        borderRadius: '16px',
        fontSize: isMobile ? '9px' : '12px',
        color: '#64748b'
      }}>
        <span>🌍 {totalLanguages}+ Languages</span>
        {!isSmallMobile && <span>🔄 Translate any pair</span>}
        <span>🎤 Voice input</span>
        {!isSmallMobile && <span>🔊 Text-to-speech</span>}
        <span>📋 Copy</span>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
      `}</style>
    </div>
  )
}

export default LanguageTranslator