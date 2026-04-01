import React, { useState, useEffect } from 'react'
import { SearchDestination } from '../../service/GlobalApi'

function InfoSection({ trip }) {
  const [destinationData, setDestinationData] = useState(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

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
        
        {/* Destination Name Overlay (optional) */}
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
        
        <button 
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
          📤 Send
        </button>
      </div>
    </div>
  )
}

export default InfoSection