import React, { useState, useEffect } from 'react'
import { SearchDestination } from '../../service/GlobalApi'
import { toast } from 'sonner'

function InfoSection({ trip }) {
  const [destinationData, setDestinationData] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

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

  const getShareText = () => {
    return `✈️ Trip to ${getLocation()}!\n\n📅 Duration: ${getDays()} day${getDays() > 1 ? 's' : ''}\n💰 Budget: ${getBudget()}\n👥 Travelers: ${getTravelers()}\n\nCheck out my itinerary:`;
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  const shareOnWhatsApp = () => {
    const text = `${getShareText()} ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShowShareOptions(false);
  };

  const shareOnTelegram = () => {
    const text = `${getShareText()} ${window.location.href}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank');
    setShowShareOptions(false);
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  const shareOnPinterest = () => {
    const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&description=${encodeURIComponent(getShareText())}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  const shareOnReddit = () => {
    const url = `https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(`Trip to ${getLocation()}`)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  const shareOnMessenger = () => {
    const url = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=123456789&redirect_uri=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    setShowShareOptions(false);
  };

  const shareOnEmail = () => {
    const subject = `My Trip to ${getLocation()}`;
    const body = `${getShareText()}\n\n${window.location.href}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

  // Fetch real destination photo
  const fetchDestination = async () => {
    const locationName = getLocation();
    if (!locationName) return;

    setLoadingPhoto(true);
    
    try {
      const result = await SearchDestination(locationName);
      console.log("Destination found:", result);
      
      if (result && result.photo) {
        setDestinationData(result);
      } else {
        console.log("No photo found for:", locationName);
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

  // Close share options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareOptions && !event.target.closest('.share-container')) {
        setShowShareOptions(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showShareOptions]);

  return (
    <div>
      {/* Hero Image - Shows real destination photo */}
      <div style={{ position: 'relative', width: '100%' }}>
        <img 
          src={destinationData?.photo || "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&h=400&fit=crop"}
          alt={destinationData?.name || getLocation()}
          style={{
            width: '100%',
            height: '340px',
            objectFit: 'cover',
            borderRadius: '12px'
          }}
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&h=400&fit=crop";
          }}
        />
        
        {/* Loading indicator */}
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
            Loading {getLocation()} image...
          </div>
        )}
        
        {/* Destination Name Overlay */}
        {destinationData?.name && (
          <div style={{ 
            position: 'absolute', 
            bottom: '16px', 
            right: '16px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            📍 {destinationData.name}
          </div>
        )}
      </div>
      
      {/* Location Name */}
      <h2 style={{ fontSize: '30px', fontWeight: 'bold', marginTop: '24px' }}>
        {destinationData?.name || getLocation()}
      </h2>
      
      {/* Rating (if available) */}
      {destinationData?.rating && (
        <div style={{ marginTop: '4px', marginBottom: '12px' }}>
          <span style={{ color: '#f59e0b' }}>⭐ {destinationData.rating}</span>
          <span style={{ color: '#6b7280', marginLeft: '8px' }}>Popular destination</span>
        </div>
      )}
      
      {/* Trip Details */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '8px 24px' }}>
          📅 {getDays()} Day{getDays() > 1 ? 's' : ''}
        </div>
        <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '8px 24px' }}>
          💸 {getBudget()} Budget
        </div>
        <div style={{ backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '8px 24px' }}>
          🥂 No. Of Traveler: {getTravelers()}
        </div>
        
        {/* Send Button with Share Options */}
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
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            📤 Share
          </button>
          
          {/* Share Options Dropdown */}
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
                <button onClick={shareOnWhatsApp} style={shareButtonStyle}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>💬</span> WhatsApp
                </button>
                <button onClick={shareOnTelegram} style={shareButtonStyle}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>✈️</span> Telegram
                </button>
                <button onClick={shareOnMessenger} style={shareButtonStyle}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>💬</span> Messenger
                </button>
                <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }}></div>
                <button onClick={shareOnFacebook} style={shareButtonStyle}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>📘</span> Facebook
                </button>
                <button onClick={shareOnTwitter} style={shareButtonStyle}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>🐦</span> Twitter
                </button>
                <button onClick={shareOnLinkedIn} style={shareButtonStyle}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>🔗</span> LinkedIn
                </button>
                <button onClick={shareOnPinterest} style={shareButtonStyle}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>📌</span> Pinterest
                </button>
                <button onClick={shareOnReddit} style={shareButtonStyle}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>🤖</span> Reddit
                </button>
                <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }}></div>
                <button onClick={shareOnEmail} style={shareButtonStyle}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>📧</span> Email
                </button>
                <button onClick={copyToClipboard} style={shareButtonStyle}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>📋</span> Copy Link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const shareButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: '10px 16px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: '14px',
  textAlign: 'left',
  transition: 'background-color 0.2s'
};

export default InfoSection