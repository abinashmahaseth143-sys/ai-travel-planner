import React, { useState, useEffect, useRef } from 'react'
import { SearchDestination, GetPlaceDetails, GetPlacePhoto } from '../../service/GlobalApi'
import { toast } from 'sonner'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../service/firebaseConfig'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

function InfoSection({ trip, onTripUpdate }) {
  const [destinationData, setDestinationData] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editDestination, setEditDestination] = useState('');
  const [editDays, setEditDays] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editTraveler, setEditTraveler] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [listeningFor, setListeningFor] = useState(null);
  const recognitionRef = useRef(null);
  
  // Recommendation states
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const getLocation = () => {
    if (!trip?.userSelection?.location) return "United Kingdom";
    const location = trip.userSelection.location;
    if (typeof location === 'string') return location;
    return location.label || location.description || "United Kingdom";
  };

  const getDays = () => {
    return trip?.userSelection?.days || "1";
  };

  const getBudget = () => {
    return trip?.userSelection?.budget || "Moderate";
  };

  const getTravelers = () => {
    const traveler = trip?.userSelection?.traveler;
    if (!traveler) return "2 People";
    if (traveler === "Just Me") return "1 Person";
    if (traveler === "A Couple") return "2 People";
    if (traveler === "Family") return "3-5 People";
    if (traveler === "Friends") return "5-10 People";
    return traveler;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
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
      toast.error('Voice recognition not supported. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    setListeningFor(field);
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      setListeningFor(null);
    };
    
    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      setIsListening(false);
      recognitionRef.current = null;
      setListeningFor(null);
      if (event.error === 'not-allowed') {
        toast.error('Please allow microphone access.');
      }
    };
    
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      console.log(`Voice input for ${field}:`, spokenText);
      
      if (field === 'destination') {
        setEditDestination(spokenText);
        searchDestinationRecommendations(spokenText);
        toast.success(`Destination set to ${spokenText}`);
      } 
      else if (field === 'days') {
        const numberMatch = spokenText.match(/\d+/);
        if (numberMatch) {
          setEditDays(numberMatch[0]);
          toast.success(`Days set to ${numberMatch[0]}`);
        } else {
          toast.info("Please say a number like '3 days' or '5 days'");
        }
      }
      else if (field === 'budget') {
        const lowerText = spokenText.toLowerCase();
        if (lowerText.includes('cheap') || lowerText.includes('budget')) {
          setEditBudget('Cheap');
          toast.success("Budget set to Cheap");
        } else if (lowerText.includes('moderate') || lowerText.includes('medium')) {
          setEditBudget('Moderate');
          toast.success("Budget set to Moderate");
        } else if (lowerText.includes('luxury') || lowerText.includes('expensive')) {
          setEditBudget('Luxury');
          toast.success("Budget set to Luxury");
        } else {
          toast.info("Please say 'cheap', 'moderate', or 'luxury'");
        }
      }
      else if (field === 'traveler') {
        const lowerText = spokenText.toLowerCase();
        if (lowerText.includes('just me') || lowerText.includes('alone') || lowerText.includes('solo')) {
          setEditTraveler('Just Me');
          toast.success("Traveler set to Just Me");
        } else if (lowerText.includes('couple') || lowerText.includes('two people') || lowerText.includes('2 people')) {
          setEditTraveler('A Couple');
          toast.success("Traveler set to A Couple");
        } else if (lowerText.includes('family')) {
          setEditTraveler('Family');
          toast.success("Traveler set to Family");
        } else if (lowerText.includes('friends') || lowerText.includes('group')) {
          setEditTraveler('Friends');
          toast.success("Traveler set to Friends");
        } else {
          toast.info("Please say 'just me', 'couple', 'family', or 'friends'");
        }
      }
    };
    
    recognition.start();
  };

  const searchDestinationRecommendations = async (query) => {
    if (!query.trim() || query.length < 2) {
      setRecommendations([]);
      setShowRecommendations(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const response = await GetPlaceDetails({
        textQuery: query,
        pageSize: 5,
        languageCode: 'en'
      });
      
      if (response.data?.places && response.data.places.length > 0) {
        const places = response.data.places.map(place => ({
          name: place.displayName?.text,
          address: place.formattedAddress,
          rating: place.rating,
          photo: place.photos?.[0]?.name
        }));
        setRecommendations(places);
        setShowRecommendations(true);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Error searching destinations:", error);
      setRecommendations([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectDestination = (place) => {
    setEditDestination(place.name);
    setShowRecommendations(false);
    toast.success(`Selected ${place.name}`);
  };

  useEffect(() => {
    if (trip) {
      setEditDestination(getLocation());
      setEditDays(getDays());
      setEditBudget(getBudget());
      setEditTraveler(getTravelers());
    }
  }, [trip]);

  const getShareText = () => {
    return `✈️ Trip to ${getLocation()}!\n\n📅 Duration: ${getDays()} day${getDays() > 1 ? 's' : ''}\n💰 Budget: ${getBudget()}\n👥 Travelers: ${getTravelers()}\n\nCheck out my itinerary:`;
  };

  const shareOnWhatsApp = () => {
    const text = `${getShareText()} ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShowShareOptions(false);
  };

  const copyToClipboard = async () => {
    const message = `${getShareText()}\n\n${window.location.href}`;
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Link copied to clipboard! 📋");
    } catch (err) {
      toast.error("Failed to copy");
    }
    setShowShareOptions(false);
  };

  const handleSaveEdit = async () => {
    if (!trip?.id) return;
    
    setIsSaving(true);
    try {
      const tripRef = doc(db, "AITrips", trip.id);
      
      const updatedUserSelection = {
        ...trip.userSelection,
        location: editDestination,
        days: editDays,
        budget: editBudget,
        traveler: editTraveler
      };
      
      await updateDoc(tripRef, {
        userSelection: updatedUserSelection
      });
      
      trip.userSelection = updatedUserSelection;
      
      toast.success("Trip details updated successfully! 🎉");
      setIsEditing(false);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Error updating trip:", error);
      toast.error("Failed to update trip details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditDestination(getLocation());
    setEditDays(getDays());
    setEditBudget(getBudget());
    setEditTraveler(getTravelers());
    setShowRecommendations(false);
    setIsEditing(false);
  };

  const budgetOptions = ["Cheap", "Moderate", "Luxury"];
  const travelerOptions = ["Just Me", "A Couple", "Family", "Friends"];

  const fetchDestination = async () => {
    const locationName = getLocation();
    if (!locationName) return;

    setLoadingPhoto(true);
    
    try {
      const result = await SearchDestination(locationName);
      if (result && result.photo) {
        setDestinationData(result);
      }
    } catch (error) {
      console.error("Error fetching destination:", error);
    } finally {
      setLoadingPhoto(false);
    }
  };

  useEffect(() => {
    if (trip?.userSelection?.location) {
      fetchDestination();
    }
  }, [trip]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareOptions && !event.target.closest('.share-container')) {
        setShowShareOptions(false);
      }
      if (showRecommendations && !event.target.closest('.recommendations-container')) {
        setShowRecommendations(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showShareOptions, showRecommendations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isEditing) {
        searchDestinationRecommendations(editDestination);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [editDestination, isEditing]);

  const micButtonStyle = (isActive) => ({
    background: isActive 
      ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
      : 'linear-gradient(135deg, #10b981, #059669)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    boxShadow: isActive 
      ? '0 0 0 3px rgba(239, 68, 68, 0.3)' 
      : '0 2px 8px rgba(16, 185, 129, 0.3)',
    animation: isActive ? 'pulse 1.5s infinite' : 'none'
  });

  return (
    <div style={{ padding: '0 30px' }}>
      {/* Hero Image */}
      <div style={{ 
        position: 'relative', 
        width: '100%',
        marginTop: '20px'
      }}>
        <img 
          src={destinationData?.photo || "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&h=400&fit=crop"}
          alt={destinationData?.name || getLocation()}
          style={{
            width: '100%',
            height: '280px',
            objectFit: 'cover',
            borderRadius: '24px'
          }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&h=400&fit=crop";
          }}
        />
        
        {loadingPhoto && (
          <div style={{ 
            position: 'absolute', 
            bottom: '16px', 
            left: '16px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px'
          }}>
            <AiOutlineLoading3Quarters style={{ animation: 'spin 1s linear infinite', display: 'inline-block', marginRight: '6px' }} />
            Loading image...
          </div>
        )}
      </div>
      
      {/* Location Name and Edit Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '24px', 
        marginBottom: '16px',
        flexWrap: 'wrap', 
        gap: '12px' 
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
          {destinationData?.name || getLocation()}
        </h2>
        
        <button
          onClick={() => setIsEditing(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ✏️ Edit Trip
        </button>
      </div>
      
      {/* Rating */}
      {destinationData?.rating && (
        <div style={{ marginBottom: '16px' }}>
          <span style={{ color: '#f59e0b' }}>⭐ {destinationData.rating}</span>
          <span style={{ color: '#6b7280', marginLeft: '8px' }}>Popular destination</span>
        </div>
      )}
      
      {/* Trip Details */}
      {isEditing ? (
        <div style={{ 
          backgroundColor: '#f8fafc', 
          borderRadius: '16px', 
          padding: '24px',
          marginTop: '16px',
          marginBottom: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
            ✏️ Edit Trip Details
          </h3>
          
          <div style={{ marginBottom: '16px', position: 'relative' }} className="recommendations-container">
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              📍 Destination
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={editDestination}
                onChange={(e) => setEditDestination(e.target.value)}
                placeholder="Search for a destination..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                autoFocus
              />
              <button
                onClick={() => startListening('destination')}
                onDoubleClick={stopListening}
                style={micButtonStyle(isListening && listeningFor === 'destination')}
                title={isListening && listeningFor === 'destination' ? "Listening... Double-click to stop" : "Click to speak destination"}
              >
                {isListening && listeningFor === 'destination' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <rect x="9" y="9" width="6" height="6" fill="white" rx="1"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </button>
            </div>
            
            {showRecommendations && recommendations.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 10,
                maxHeight: '300px',
                overflowY: 'auto',
                marginTop: '4px'
              }}>
                {recommendations.map((place, idx) => (
                  <div
                    key={idx}
                    onClick={() => selectDestination(place)}
                    style={{
                      padding: '12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>📍</span>
                      <div>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{place.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{place.address}</div>
                        {place.rating && (
                          <div style={{ fontSize: '11px', color: '#f59e0b' }}>⭐ {place.rating}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              📅 Number of Days
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="number"
                value={editDays}
                onChange={(e) => setEditDays(e.target.value)}
                min="1"
                max="30"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={() => startListening('days')}
                onDoubleClick={stopListening}
                style={micButtonStyle(isListening && listeningFor === 'days')}
                title={isListening && listeningFor === 'days' ? "Listening... Double-click to stop" : "Click to speak number of days"}
              >
                {isListening && listeningFor === 'days' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <rect x="9" y="9" width="6" height="6" fill="white" rx="1"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              💰 Budget
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={editBudget}
                onChange={(e) => setEditBudget(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                {budgetOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button
                onClick={() => startListening('budget')}
                onDoubleClick={stopListening}
                style={micButtonStyle(isListening && listeningFor === 'budget')}
                title={isListening && listeningFor === 'budget' ? "Listening... Double-click to stop" : "Click to speak budget (cheap, moderate, luxury)"}
              >
                {isListening && listeningFor === 'budget' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <rect x="9" y="9" width="6" height="6" fill="white" rx="1"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px', color: '#374151' }}>
              👥 Traveler Type
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                value={editTraveler}
                onChange={(e) => setEditTraveler(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                {travelerOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button
                onClick={() => startListening('traveler')}
                onDoubleClick={stopListening}
                style={micButtonStyle(isListening && listeningFor === 'traveler')}
                title={isListening && listeningFor === 'traveler' ? "Listening... Double-click to stop" : "Click to speak traveler type (just me, couple, family, friends)"}
              >
                {isListening && listeningFor === 'traveler' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
                    <rect x="9" y="9" width="6" height="6" fill="white" rx="1"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {recommendations.length > 0 && (
            <div style={{
              backgroundColor: '#e0e7ff',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '12px',
              color: '#4338ca'
            }}>
              💡 {recommendations.length} destination{recommendations.length > 1 ? 's' : ''} found! Click on any to select.
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={handleCancelEdit}
              style={{
                padding: '10px 24px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                opacity: isSaving ? 0.7 : 1
              }}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginTop: '16px', 
          marginBottom: '24px',
          alignItems: 'center', 
          flexWrap: 'wrap' 
        }}>
          <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '8px 20px' }}>
            📅 {getDays()} Day{getDays() > 1 ? 's' : ''}
          </div>
          <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '8px 20px' }}>
            💸 {getBudget()} Budget
          </div>
          <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '8px 20px' }}>
            🥂 No. Of Traveler: {getTravelers()}
          </div>
          
          <div className="share-container" style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowShareOptions(!showShareOptions)}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '8px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              📤 Share
            </button>
            
            {showShareOptions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                zIndex: 100,
                minWidth: '200px',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '8px 0' }}>
                  <button onClick={shareOnWhatsApp} style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px 16px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                    <span style={{ fontSize: '20px', marginRight: '10px' }}>💬</span> WhatsApp
                  </button>
                  <button onClick={copyToClipboard} style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10px 16px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}>
                    <span style={{ fontSize: '20px', marginRight: '10px' }}>📋</span> Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
            70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
        `}
      </style>
    </div>
  )
}

export default InfoSection