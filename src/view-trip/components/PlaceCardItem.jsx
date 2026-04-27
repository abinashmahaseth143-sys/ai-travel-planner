import React from 'react'

function PlaceCardItem({ place, onClick }) {
  if (!place) return null;

  const placeName = place.placeName || place.name || "Attraction";
  // STEP 3: Use the real image from Google Places API
  const placeImage = place.placeImageUrl || "/placeholder.jpg";
  const timeValue = place.time || place.startTime || "Flexible";
  const travelTime = place.timeToTravel || place.travelTime || place.timeTravel || "";
  const descriptionValue = place.description || place.placeDetails || place.placeDe1 || "Must-visit attraction";
  const ticketValue = place.ticketPricing || place.ticketPrice;
  const ratingValue = place.rating || place.stars;
  const reviewCount = place.reviewCount || 0;
  const address = place.address || "";

  // Format travel time display
  const getTravelTimeDisplay = (time) => {
    if (!time) return null;
    if (time.includes('hour') || time.includes('minute') || time.includes('min')) {
      return time;
    }
    if (!isNaN(time)) {
      return `${time} minutes`;
    }
    return time;
  };

  const travelTimeDisplay = getTravelTimeDisplay(travelTime);

  const handleClick = () => {
    if (onClick) {
      onClick(place);
    }
  };

  return (
    <div 
      onClick={handleClick}
      style={{ 
        display: 'flex', 
        gap: '16px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        transition: 'transform 0.2s, boxShadow 0.2s',
        cursor: 'pointer',
        border: '1px solid #e5e7eb'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* STEP 3: Real Image from Google Places API */}
      <img 
        src={placeImage}
        alt={placeName}
        style={{ 
          width: '100px', 
          height: '130px', 
          objectFit: 'cover',
          borderRadius: '12px',
          backgroundColor: '#f3f4f6'
        }}
        onError={(e) => {
          e.target.src = "/placeholder.jpg";
        }}
      />
      
      {/* Place Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Place Name */}
        <h3 style={{ 
          fontWeight: 'bold', 
          fontSize: '16px',
          color: '#f59e0b',
          marginBottom: '6px'
        }}>
          {placeName}
        </h3>
        
        {/* Address (if available) */}
        {address && (
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            📍 {address}
          </div>
        )}
        
        {/* Visit Time */}
        <div style={{ 
          fontSize: '13px', 
          color: '#3b82f6',
          marginBottom: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>🕒</span> {timeValue}
        </div>
        
        {/* Description */}
        <p style={{ 
          fontSize: '13px', 
          color: '#6b7280',
          lineHeight: '1.5',
          marginBottom: '6px'
        }}>
          {descriptionValue}
        </p>
        
        {/* Travel Time */}
        {travelTimeDisplay && (
          <div style={{ 
            fontSize: '12px', 
            color: '#8b5cf6',
            marginBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>🚗</span> Travel: {travelTimeDisplay}
          </div>
        )}
        
        {/* Ticket Pricing & Rating in one row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {ticketValue && (
            <div style={{ 
              fontSize: '12px', 
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>🎫</span> {ticketValue}
            </div>
          )}
          
          {ratingValue && (
            <div style={{ 
              fontSize: '12px', 
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>⭐</span> {ratingValue} {reviewCount > 0 && `(${reviewCount} reviews)`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlaceCardItem