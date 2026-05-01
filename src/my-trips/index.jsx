import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, auth } from '../service/firebaseConfig'
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { AiOutlineLoading3Quarters, AiOutlineDelete } from 'react-icons/ai'
import { toast } from 'sonner'

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const guestMode = localStorage.getItem('guestMode') === 'true';
      
      if (guestMode && !currentUser) {
        toast.info('Guest trips are not saved. Sign in to save your travel history permanently!');
        navigate('/');
      } else if (!currentUser && !guestMode) {
        navigate('/login');
      } else if (currentUser) {
        fetchUserTrips(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserTrips = async (userId) => {
    try {
      setLoading(true);
      const tripsRef = collection(db, "AITrips");
      const q = query(
        tripsRef, 
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      const tripsData = [];
      querySnapshot.forEach((doc) => {
        tripsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log("Fetched trips for user:", tripsData);
      setTrips(tripsData);
    } catch (error) {
      console.error("Error fetching trips:", error);
      if (error.code === 'failed-precondition') {
        toast.info('Index is building. Please wait a moment and refresh.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete a single trip
  const deleteTrip = async (tripId, event) => {
    if (event) event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone!')) {
      try {
        await deleteDoc(doc(db, "AITrips", tripId));
        toast.success('Trip deleted successfully!');
        fetchUserTrips(user.uid);
      } catch (error) {
        console.error("Error deleting trip:", error);
        toast.error('Failed to delete trip');
      }
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

  const getBudgetDisplay = (budget) => {
    if (budget === "Cheap") return "Budget Friendly";
    if (budget === "Moderate") return "Moderate";
    if (budget === "Luxury") return "Luxury";
    return budget || "Standard";
  };

  const getFallbackImage = (location) => {
    if (!location) return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop";
    
    const locationLower = location.toLowerCase();
    
    const imageMap = {
      'nepal': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
      'egypt': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400&h=200&fit=crop',
      'costa rica': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop',
      'morocco': 'https://images.unsplash.com/photo-1489493887464-892be6d1da6a?w=400&h=200&fit=crop',
      'usa': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=200&fit=crop',
      'united states': 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=200&fit=crop',
      'japan': 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400&h=200&fit=crop',
      'italy': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=200&fit=crop',
      'france': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=200&fit=crop',
      'thailand': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&h=200&fit=crop',
      'spain': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=200&fit=crop',
      'india': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=200&fit=crop'
    };
    
    for (const [key, url] of Object.entries(imageMap)) {
      if (locationLower.includes(key)) return url;
    }
    
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop";
  };

  // If not logged in, show sign in button
  if (!user && !loading) {
    const guestMode = localStorage.getItem('guestMode') === 'true';
    if (guestMode) {
      return (
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '80px 20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>👤</div>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
            Guest Mode Active
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>
            Sign in to save your travel history permanently!
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('guestMode');
              localStorage.removeItem('guestTripsGenerated');
              navigate('/login');
            }}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 32px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Sign In to Save History
          </button>
        </div>
      );
    }
    
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔐</div>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
          Sign In to View Your History
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          Please sign in to see your travel history
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 32px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

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
        <p>Loading your travel history...</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Empty state - No travel history yet
  if (trips.length === 0) {
    return (
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>📜</div>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
          No Travel History Yet
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          You haven't created any trips. Start planning your next adventure to build your history!
        </p>
        <button
          onClick={() => navigate('/create-trip')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 32px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          ✨ Create Your First Trip
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        background: 'white',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px 30px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
              📜 My Travel History
            </h1>
            <p style={{ opacity: 0.9 }}>
              {trips.length} {trips.length === 1 ? 'trip' : 'trips'} planned
            </p>
          </div>
          <button
            onClick={() => navigate('/create-trip')}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              padding: '10px 24px',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '40px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            }}
          >
            + New Trip
          </button>
        </div>

        {/* Trips Grid */}
        <div style={{ padding: '30px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {trips.map((trip) => {
              const userSelection = trip.userSelection || {};
              const budgetColor = getBudgetColor(userSelection.budget);
              const budgetDisplay = getBudgetDisplay(userSelection.budget);
              const locationName = userSelection.location || "Unknown";
              const imageUrl = getFallbackImage(locationName);
              
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
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  }}
                >
                  <img 
                    src={imageUrl}
                    alt={locationName}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.src = getFallbackImage(locationName);
                    }}
                  />
                  
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold', 
                      marginBottom: '12px',
                      color: '#1f2937'
                    }}>
                      {locationName}
                    </h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
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
                        💰 {budgetDisplay}
                      </span>
                    </div>
                    
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>
                      Added: {formatDate(trip.createdAt)}
                    </p>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderTop: '1px solid #f3f4f6',
                      paddingTop: '16px'
                    }}>
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
                      
                      <button
                        onClick={(e) => deleteTrip(trip.id, e)}
                        style={{
                          padding: '6px 16px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ef4444';
                        }}
                      >
                        <AiOutlineDelete size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Back Button */}
        <div style={{
          padding: '20px 30px 30px 30px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: 'white',
              borderRadius: '40px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyTrips;