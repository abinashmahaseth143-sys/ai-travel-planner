import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../service/firebaseConfig'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTrips();
  }, []);

  const fetchAllTrips = async () => {
    try {
      setLoading(true);
      const tripsRef = collection(db, "AITrips");
      const q = query(tripsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const tripsData = [];
      querySnapshot.forEach((doc) => {
        tripsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log("Fetched trips:", tripsData);
      setTrips(tripsData);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return "Unknown date";
    }
  };

  const getBudgetColor = (budget) => {
    if (budget === "Cheap") return "#10b981";
    if (budget === "Moderate") return "#f59e0b";
    if (budget === "Luxury") return "#ef4444";
    return "#6b7280";
  };

  // Fallback image if no destination image is saved
  const getFallbackImage = (location) => {
    if (!location) return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop";
    
    const locationLower = location.toLowerCase();
    
    if (locationLower.includes('london') || locationLower.includes('uk') || locationLower.includes('england')) {
      return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=200&fit=crop";
    }
    if (locationLower.includes('paris') || locationLower.includes('france')) {
      return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=200&fit=crop";
    }
    if (locationLower.includes('new york') || locationLower.includes('nyc')) {
      return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=200&fit=crop";
    }
    if (locationLower.includes('usa') || locationLower.includes('united states')) {
      return "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=200&fit=crop";
    }
    if (locationLower.includes('japan') || locationLower.includes('tokyo')) {
      return "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400&h=200&fit=crop";
    }
    if (locationLower.includes('italy') || locationLower.includes('rome')) {
      return "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=200&fit=crop";
    }
    
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop";
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <AiOutlineLoading3Quarters style={{ 
          animation: 'spin 1s linear infinite', 
          fontSize: '40px', 
          color: '#3b82f6' 
        }} />
        <p>Loading your trips...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
          🗺️ No Trips Yet
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          You haven't created any trips. Start planning your next adventure!
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Create Your First Trip
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>
          📋 My Trips
        </h1>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          + New Trip
        </button>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {trips.map((trip) => {
          const userSelection = trip.userSelection || {};
          const budgetColor = getBudgetColor(userSelection.budget);
          const locationName = userSelection.location || "Unknown";
          
          // STEP 3: Use the saved destination image from Firebase
          // If no saved image, use fallback based on location
          const imageUrl = userSelection.destinationImage || getFallbackImage(locationName);
          
          return (
            <div
              key={trip.id}
              onClick={() => navigate(`/view-trip/${trip.id}`)}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'transform 0.2s, boxShadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              {/* STEP 3: REAL DESTINATION IMAGE from Google Places (saved during trip creation) */}
              <img 
                src={imageUrl}
                alt={locationName}
                style={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  // If image fails, use fallback
                  e.target.src = getFallbackImage(locationName);
                }}
              />
              
              <div style={{ padding: '20px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  marginBottom: '12px',
                  color: '#1f2937'
                }}>
                  {locationName}
                </h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ 
                    backgroundColor: '#f3f4f6', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    📅 {userSelection.days || '?'} days
                  </span>
                  <span style={{ 
                    backgroundColor: '#f3f4f6', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    👥 {userSelection.traveler || '?'}
                  </span>
                  <span style={{ 
                    backgroundColor: budgetColor + '20', 
                    color: budgetColor,
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    💰 {userSelection.budget || '?'}
                  </span>
                </div>
                
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>
                  Created: {formatDate(trip.createdAt)}
                </p>
                
                <div style={{ marginTop: '16px' }}>
                  <span style={{
                    color: '#3b82f6',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default MyTrips