import React, { useState, useEffect } from 'react'
import { useLoadScript, Autocomplete } from '@react-google-maps/api'
import { Input } from '@/components/ui/input'
import { SelectTravelesList, SelectBudgetOptions } from '../constants/options'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { db, auth } from '../service/firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { AiOutlineLoading3Quarters, AiOutlineArrowLeft } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import WeatherCountryAdvisor from '../components/WeatherCountryAdvisor'
import { generateTrip } from '../lib/aiService'

const libraries = ['places'];

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [days, setDays] = useState('');
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [guestTripsRemaining, setGuestTripsRemaining] = useState(2);
  const [isListening, setIsListening] = useState(false);
  const [listeningFor, setListeningFor] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const navigate = useNavigate();

  let recognitionRef = null;

  // Track window width for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const guestMode = localStorage.getItem('guestMode') === 'true';
      const guestTripsGenerated = parseInt(localStorage.getItem('guestTripsGenerated') || '0');
      const maxFreeTrips = 2;
      
      setGuestTripsRemaining(maxFreeTrips - guestTripsGenerated);
      
      if (!user && !guestMode) {
        console.log("User not authenticated, redirecting to login...");
        navigate('/login');
      } else if (user) {
        console.log("User authenticated:", user.email);
        setIsAuthenticated(true);
        setCurrentUser(user);
      } else if (guestMode) {
        console.log("Guest mode active, remaining trips:", guestTripsRemaining);
        setIsAuthenticated(true);
      }
    });
    return () => unsubscribe();
  }, [navigate, guestTripsRemaining]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAnJwDgg2l5yJJUPL69v4qtS0uzoYcFpj0",
    libraries,
  });

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const selectedPlace = autocomplete.getPlace();
      if (selectedPlace?.formatted_address) {
        setPlace({
          label: selectedPlace.formatted_address,
          value: selectedPlace
        });
        console.log("Selected place:", selectedPlace);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef) {
      recognitionRef.stop();
      recognitionRef = null;
    }
    setIsListening(false);
    setListeningFor(null);
  };

  const startListening = (field) => {
    if (isListening) {
      stopListening();
      return;
    }
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    setListeningFor(field);
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef = recognition;
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef = null;
      setListeningFor(null);
    };
    
    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      setIsListening(false);
      recognitionRef = null;
      setListeningFor(null);
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice input.');
      }
    };
    
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      console.log(`Voice input for ${field}:`, spokenText);
      
      if (field === 'destination') {
        setPlace({
          label: spokenText,
          value: { formatted_address: spokenText }
        });
        const inputElement = document.querySelector('input[placeholder*="Search"]');
        if (inputElement) {
          inputElement.value = spokenText;
        }
        toast.success(`Destination set to ${spokenText}`);
      } 
      else if (field === 'days') {
        // ========== IMPROVED NUMBER PARSING FOR DAYS ==========
        let daysValue = null;
        const lowerText = spokenText.toLowerCase();
        
        // Remove common words to isolate the number
        const cleanText = lowerText.replace(/day|days|for|about|around|approximately/gi, '').trim();
        
        // 1. Extract digits from text (e.g., "3 days" -> 3)
        const digits = cleanText.match(/\d+/);
        if (digits) {
          daysValue = parseInt(digits[0]);
        }
        
        // 2. If no digits, check for word numbers
        if (!daysValue) {
          const wordToNumber = {
            'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
            'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14,
            'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18,
            'nineteen': 19, 'twenty': 20, 'thirty': 30, 'forty': 40,
            'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80,
            'ninety': 90, 'hundred': 100
          };
          
          for (const [word, num] of Object.entries(wordToNumber)) {
            if (lowerText.includes(word)) {
              daysValue = num;
              break;
            }
          }
        }
        
        // 3. Check for combined words like "twenty five"
        if (!daysValue && lowerText.includes('twenty')) {
          if (lowerText.includes('five')) daysValue = 25;
          else if (lowerText.includes('six')) daysValue = 26;
          else if (lowerText.includes('seven')) daysValue = 27;
          else if (lowerText.includes('eight')) daysValue = 28;
          else if (lowerText.includes('nine')) daysValue = 29;
          else daysValue = 20;
        }
        
        if (!daysValue && lowerText.includes('thirty')) {
          if (lowerText.includes('one')) daysValue = 31;
          else daysValue = 30;
        }
        
        // 4. Validate and set the value
        if (daysValue && daysValue >= 1 && daysValue <= 30) {
          setDays(daysValue.toString());
          toast.success(`✅ ${daysValue} day${daysValue > 1 ? 's' : ''} set!`);
        } else if (daysValue && daysValue > 30) {
          toast.info("Maximum 30 days allowed. Please say a lower number (1-30).");
        } else {
          toast.info("Please say a number like '5 days', 'seven', or 'twenty'");
        }
      }
      else if (field === 'budget') {
        const lowerText = spokenText.toLowerCase();
        if (lowerText.includes('cheap') || lowerText.includes('budget')) {
          setSelectedBudget(1);
          toast.success("Budget set to Cheap");
        } else if (lowerText.includes('moderate') || lowerText.includes('medium')) {
          setSelectedBudget(2);
          toast.success("Budget set to Moderate");
        } else if (lowerText.includes('luxury') || lowerText.includes('expensive')) {
          setSelectedBudget(3);
          toast.success("Budget set to Luxury");
        } else {
          toast.info("Please say 'cheap', 'moderate', or 'luxury'");
        }
      }
      else if (field === 'traveler') {
        const lowerText = spokenText.toLowerCase();
        if (lowerText.includes('just me') || lowerText.includes('alone') || lowerText.includes('solo')) {
          setSelectedTraveler(1);
          toast.success("Traveler set to Just Me");
        } else if (lowerText.includes('couple') || lowerText.includes('two people') || lowerText.includes('2 people')) {
          setSelectedTraveler(2);
          toast.success("Traveler set to Couple");
        } else if (lowerText.includes('family')) {
          setSelectedTraveler(3);
          toast.success("Traveler set to Family");
        } else if (lowerText.includes('friends') || lowerText.includes('group')) {
          setSelectedTraveler(4);
          toast.success("Traveler set to Friends");
        } else {
          toast.info("Please say 'just me', 'couple', 'family', or 'friends'");
        }
      }
    };
    
    recognition.start();
  };

  const handleCountrySelect = (countryName) => {
    console.log("Selected country from weather advisor:", countryName);
    setPlace({
      label: countryName,
      value: { formatted_address: countryName }
    });
    toast.success(`Selected ${countryName}! Now set your trip details.`);
    
    const inputElement = document.querySelector('input[placeholder*="Search"]');
    if (inputElement) {
      inputElement.value = countryName;
    }
  };

  const SaveAiTrip = async (TripData) => {
    try {
      const user = auth.currentUser;
      const guestMode = localStorage.getItem('guestMode') === 'true';
      const guestTripsGenerated = parseInt(localStorage.getItem('guestTripsGenerated') || '0');
      const maxFreeTrips = 2;
      
      if (guestMode && guestTripsGenerated >= maxFreeTrips) {
        toast.error(`You've reached the free limit of ${maxFreeTrips} trips! Please sign in to create more.`);
        navigate('/login');
        return false;
      }
      
      const docId = Date.now().toString();
      
      const formData = {
        location: place?.label,
        days: days,
        traveler: SelectTravelesList.find(t => t.id === selectedTraveler)?.title,
        budget: SelectBudgetOptions.find(b => b.id === selectedBudget)?.title,
        timestamp: new Date().toISOString()
      };
      
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: TripData,
        userEmail: user?.email || 'guest@temporary.com',
        userId: user?.uid || `guest_${docId}`,
        userName: user?.displayName || 'Guest User',
        isGuest: guestMode,
        id: docId,
        createdAt: new Date().toISOString()
      });
      
      if (guestMode) {
        const newCount = guestTripsGenerated + 1;
        localStorage.setItem('guestTripsGenerated', newCount.toString());
        const remaining = maxFreeTrips - newCount;
        if (remaining === 0) {
          toast.warning(`You've used all ${maxFreeTrips} free trips! Sign in to save more.`);
        } else {
          toast.success(`Trip saved! You have ${remaining} free ${remaining === 1 ? 'trip' : 'trips'} remaining.`);
        }
      }
      
      navigate('/view-trip/' + docId);
      return true;
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip. Please try again.");
      return false;
    }
  };

  const handleGenerateTrip = async () => {
    if (!place || !days || !selectedTraveler || !selectedBudget) {
      toast("Please fill all details")
      return
    }

    const guestMode = localStorage.getItem('guestMode') === 'true';
    const guestTripsGenerated = parseInt(localStorage.getItem('guestTripsGenerated') || '0');
    const maxFreeTrips = 2;
    
    if (guestMode && guestTripsGenerated >= maxFreeTrips) {
      toast.error(`You've reached the free limit of ${maxFreeTrips} trips! Please sign in to create more.`);
      navigate('/login');
      return;
    }

    setLoading(true)
    const loadingToast = toast.loading("Generating your personalized itinerary...")

    try {
      const travelerType = SelectTravelesList.find(t => t.id === selectedTraveler)?.title
      const budgetType = SelectBudgetOptions.find(b => b.id === selectedBudget)?.title

      const result = await generateTrip(
        place?.label,
        days,
        travelerType,
        budgetType
      );
      
      if (result.usedFallback) {
        toast.dismiss(loadingToast);
        toast.info(result.fallbackMessage);
      }
      
      const saved = await SaveAiTrip(result.data);
      
      localStorage.setItem('itinerary', JSON.stringify(result.data))
      
      toast.dismiss(loadingToast);
      if (saved) {
        toast.success("Trip generated and saved successfully! 🎉")
      } else {
        toast.warning("Trip generated but could not save to database")
      }
      
    } catch (error) {
      console.error("Error:", error)
      toast.dismiss(loadingToast);
      toast.error("Failed to generate itinerary. Please try again.")
    } finally {
      setLoading(false)
    }
  };

  if (!isAuthenticated && auth.currentUser === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <AiOutlineLoading3Quarters style={{ animation: 'spin 1s linear infinite', fontSize: '40px', color: '#3b82f6' }} />
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isLoaded) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading Google Maps...</div>;
  }

  const guestMode = localStorage.getItem('guestMode') === 'true';
  const guestTripsGenerated = parseInt(localStorage.getItem('guestTripsGenerated') || '0');
  const remainingTrips = 2 - guestTripsGenerated;

  const micButtonStyle = (isActive) => ({
    background: isActive 
      ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
      : 'linear-gradient(135deg, #10b981, #059669)',
    border: 'none',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: isActive 
      ? '0 0 0 3px rgba(239, 68, 68, 0.3), 0 4px 12px rgba(0,0,0,0.15)' 
      : '0 4px 12px rgba(16, 185, 129, 0.3)',
    animation: isActive ? 'pulse 1.5s infinite' : 'none'
  });

  // Get display name for signed in user
  const getUserDisplayName = () => {
    if (!currentUser) return '';
    return currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
  };

  // Add listening indicator for days
  const isDaysListening = isListening && listeningFor === 'days';

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      position: 'relative',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      <Toaster />
      
      {/* Main Content Container */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          padding: 'clamp(20px, 5vw, 32px) clamp(16px, 4vw, 24px)',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shine 3s infinite'
          }} />
          
          <h2 style={{ 
            fontSize: 'clamp(22px, 5vw, 32px)', 
            fontWeight: 'bold', 
            marginBottom: '12px', 
            fontFamily: 'inherit',
            wordBreak: 'break-word',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            ✨ Your Travel Story Starts Here
          </h2>
          
          <p style={{ 
            fontSize: 'clamp(13px, 4vw, 16px)', 
            opacity: 0.95, 
            fontFamily: 'inherit',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.5'
          }}>
            Answer a few quick questions about your dream trip
          </p>
          
          <p style={{ 
            fontSize: 'clamp(13px, 4vw, 16px)', 
            opacity: 0.9, 
            fontFamily: 'inherit',
            maxWidth: '600px',
            margin: '8px auto 0',
            lineHeight: '1.5'
          }}>
            Get a custom itinerary designed just for you
          </p>
          
          {currentUser && (
            <div style={{ 
              marginTop: '20px', 
              display: 'flex', 
              justifyContent: 'center',
              width: '100%'
            }}>
              <p style={{ 
                fontSize: 'clamp(11px, 3vw, 14px)', 
                background: 'rgba(255,255,255,0.2)', 
                backdropFilter: 'blur(10px)', 
                display: 'inline-block', 
                padding: '6px 16px', 
                borderRadius: '40px', 
                fontFamily: 'inherit',
                margin: 0
              }}>
                ✓ Signed in as {getUserDisplayName()}
              </p>
            </div>
          )}
          
          {guestMode && !currentUser && (
            <div style={{ 
              marginTop: '20px', 
              display: 'flex', 
              justifyContent: 'center',
              width: '100%'
            }}>
              <p style={{ 
                fontSize: 'clamp(11px, 3vw, 14px)', 
                background: '#fef3c7', 
                color: '#d97706', 
                display: 'inline-block', 
                padding: '6px 16px', 
                borderRadius: '40px', 
                fontFamily: 'inherit',
                margin: 0
              }}>
                🎁 Guest Mode: {remainingTrips} free {remainingTrips === 1 ? 'trip' : 'trips'} remaining
              </p>
            </div>
          )}
        </div>
        
        {/* Content Body */}
        <div style={{ 
          padding: 'clamp(20px, 5vw, 40px)',
          boxSizing: 'border-box'
        }}>
          
          {/* Weather Advisor Section */}
          <div style={{ 
            overflowX: 'auto', 
            overflowY: 'visible',
            display: 'block',
            width: '100%',
            WebkitOverflowScrolling: 'touch',
            marginBottom: '32px'
          }}>
            <WeatherCountryAdvisor 
              destination={place?.label} 
              onSelectDestination={handleCountrySelect}
            />
          </div>
          
          {/* Divider */}
          <div style={{ 
            height: '2px', 
            background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)',
            margin: '32px 0',
            borderRadius: '2px'
          }} />
          
          {/* Destination Section */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '28px' }}>📍</span>
              <h3 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 'bold', color: '#1f2937', fontFamily: 'inherit', margin: 0 }}>Where would you like to go?</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                  <input
                    type="text"
                    placeholder="Search for any city, country, or place..."
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      fontSize: '15px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '16px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </Autocomplete>
              </div>
              <button
                onClick={() => startListening('destination')}
                onDoubleClick={stopListening}
                style={micButtonStyle(isListening && listeningFor === 'destination')}
                title={isListening && listeningFor === 'destination' ? "Listening... Double-click to stop" : "Click to speak destination"}
              >
                {isListening && listeningFor === 'destination' ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <rect x="9" y="9" width="6" height="6" fill="white" rx="1"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Days Section - IMPROVED */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '28px' }}>📅</span>
              <h3 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 'bold', color: '#1f2937', fontFamily: 'inherit', margin: 0 }}>How many days are you planning?</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Input 
                type="number"
                placeholder="Enter number of days (e.g., 3, 5, 7)"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                style={{ 
                  flex: 1,
                  minWidth: '200px',
                  padding: '14px 16px', 
                  fontSize: '15px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '16px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={() => startListening('days')}
                onDoubleClick={stopListening}
                style={micButtonStyle(isListening && listeningFor === 'days')}
                title={isListening && listeningFor === 'days' ? "Listening... Double-click to stop" : "Click to speak number of days (e.g., '5 days' or 'seven')"}
              >
                {isListening && listeningFor === 'days' ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <rect x="9" y="9" width="6" height="6" fill="white" rx="1"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </button>
            </div>
            {/* Voice feedback indicator for days */}
            {isDaysListening && (
              <div style={{ 
                marginTop: '8px', 
                fontSize: '12px', 
                color: '#10b981', 
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1s infinite' }}></span>
                🎤 Listening for number of days... Say like "5 days" or "seven"
              </div>
            )}
          </div>

          {/* Budget Section */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '28px' }}>💰</span>
              <h3 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 'bold', color: '#1f2937', fontFamily: 'inherit', margin: 0 }}>What is your budget?</h3>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '16px', 
              marginBottom: '20px' 
            }}>
              {SelectBudgetOptions.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedBudget(item.id)}
                  style={{
                    cursor: 'pointer',
                    padding: '20px',
                    border: selectedBudget === item.id ? '2px solid #667eea' : '2px solid #e5e7eb',
                    borderRadius: '16px',
                    backgroundColor: selectedBudget === item.id ? '#f0f4ff' : 'white',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedBudget === item.id ? '0 4px 12px rgba(102, 126, 234, 0.2)' : 'none',
                    transform: selectedBudget === item.id ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>{item.icon}</div>
                  <h4 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '4px', fontFamily: 'inherit' }}>{item.title}</h4>
                  <p style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'inherit' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => startListening('budget')}
                onDoubleClick={stopListening}
                style={micButtonStyle(isListening && listeningFor === 'budget')}
                title={isListening && listeningFor === 'budget' ? "Listening... Double-click to stop" : "Click to speak budget (cheap, moderate, luxury)"}
              >
                {isListening && listeningFor === 'budget' ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <rect x="9" y="9" width="6" height="6" fill="white" rx="1"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Traveler Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '28px' }}>👥</span>
              <h3 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 'bold', color: '#1f2937', fontFamily: 'inherit', margin: 0 }}>Who's joining the adventure?</h3>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
              gap: '16px', 
              marginBottom: '20px' 
            }}>
              {SelectTravelesList.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedTraveler(item.id)}
                  style={{
                    cursor: 'pointer',
                    padding: '16px',
                    border: selectedTraveler === item.id ? '2px solid #667eea' : '2px solid #e5e7eb',
                    borderRadius: '16px',
                    backgroundColor: selectedTraveler === item.id ? '#f0f4ff' : 'white',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedTraveler === item.id ? '0 4px 12px rgba(102, 126, 234, 0.2)' : 'none',
                    transform: selectedTraveler === item.id ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>{item.icon}</div>
                  <h4 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px', fontFamily: 'inherit' }}>{item.title}</h4>
                  <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px', fontFamily: 'inherit' }}>{item.desc}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', fontFamily: 'inherit' }}>{item.people}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => startListening('traveler')}
                onDoubleClick={stopListening}
                style={micButtonStyle(isListening && listeningFor === 'traveler')}
                title={isListening && listeningFor === 'traveler' ? "Listening... Double-click to stop" : "Click to speak traveler type"}
              >
                {isListening && listeningFor === 'traveler' ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <rect x="9" y="9" width="6" height="6" fill="white" rx="1"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            marginTop: '20px',
            width: '100%'
          }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'white',
                padding: 'clamp(10px, 1.5vw, 14px) clamp(16px, 3vw, 32px)',
                borderRadius: '40px',
                border: 'none',
                fontSize: 'clamp(13px, 1.5vw, 16px)',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                flex: windowWidth < 500 ? '1' : 'auto',
                minWidth: windowWidth < 500 ? 'auto' : '120px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              <AiOutlineArrowLeft size={16} />
              {windowWidth < 500 ? 'Back' : 'Back to Home'}
            </button>
            
            <button 
              onClick={handleGenerateTrip}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'white',
                padding: 'clamp(10px, 1.5vw, 14px) clamp(16px, 3vw, 32px)',
                borderRadius: '40px',
                border: 'none',
                fontSize: 'clamp(13px, 1.5vw, 16px)',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'inherit',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.6 : 1,
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                flex: windowWidth < 500 ? '1' : 'auto',
                minWidth: windowWidth < 500 ? 'auto' : '140px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters style={{ animation: 'spin 1s linear infinite' }} />
                  {windowWidth < 500 ? 'Gen...' : 'Generating...'}
                </>
              ) : (
                <>
                  ✨
                  {windowWidth < 500 ? 'Generate' : 'Generate My Trip'}
                </>
              )}
            </button>
          </div>
          
        </div>
      </div>
      
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            overflow-x: hidden;
            width: 100%;
            position: relative;
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes shine {
            0% { left: -100%; }
            20% { left: 100%; }
            100% { left: 100%; }
          }
        `}
      </style>
    </div>
  )
}

export default CreateTrip