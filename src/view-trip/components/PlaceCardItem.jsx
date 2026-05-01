import React, { useState, useEffect } from 'react'

function PlaceCardItem({ place, onClick }) {
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!place) return null;

  const placeName = place.placeName || place.name || "Attraction";
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
      className="place-card"
      style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: '16px',
        padding: isMobile ? '12px' : '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: '1px solid #e5e7eb',
        width: '100%',
        boxSizing: 'border-box'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f3f4f6';
        e.currentTarget.style.transform = isMobile ? 'translateY(-2px)' : 'translateX(4px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f9fafb';
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Place Image */}
      <div 
        className="place-card-image"
        style={{
          width: isMobile ? '100%' : '100px',
          height: isMobile ? '180px' : '100px',
          flexShrink: 0,
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#e5e7eb'
        }}
      >
        <img 
          src={placeImage}
          alt={placeName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
      </div>
      
      {/* Place Details */}
      <div 
        className="place-card-content"
        style={{ 
          flex: 1, 
          minWidth: 0,
          width: '100%'
        }}
      >
        <h4 
          className="place-card-title"
          style={{
            fontSize: isMobile ? '18px' : '16px',
            fontWeight: 'bold',
            color: '#f59e0b',
            marginBottom: '6px',
            lineHeight: '1.3'
          }}
        >
          {placeName}
        </h4>
        
        <p style={{
          fontSize: '12px',
          color: '#6b7280',
          marginBottom: '8px',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          wordBreak: 'break-word'
        }}>
          📍 {address || 'Address not available'}
        </p>
        
        <div 
          className="place-tags"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '8px'
          }}
        >
          {timeValue && (
            <span style={{
              fontSize: '11px',
              color: '#374151',
              background: '#e0e7ff',
              padding: '4px 10px',
              borderRadius: '20px'
            }}>
              🕐 {timeValue}
            </span>
          )}
          
          {travelTimeDisplay && (
            <span style={{
              fontSize: '11px',
              color: '#374151',
              background: '#e0e7ff',
              padding: '4px 10px',
              borderRadius: '20px'
            }}>
              🚗 Travel: {travelTimeDisplay}
            </span>
          )}
          
          {ticketValue && (
            <span style={{
              fontSize: '11px',
              color: '#374151',
              background: '#e0e7ff',
              padding: '4px 10px',
              borderRadius: '20px'
            }}>
              💰 {ticketValue}
            </span>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {ratingValue && (
            <span style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ⭐ {ratingValue}
            </span>
          )}
          
          {reviewCount > 0 && (
            <span style={{
              fontSize: '11px',
              color: '#6b7280'
            }}>
              ({reviewCount.toLocaleString()} reviews)
            </span>
          )}
          
          <span style={{
            fontSize: '11px',
            color: '#3b82f6',
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            Click for map →
          </span>
        </div>
      </div>
    </div>
  );
}

export default PlaceCardItem;