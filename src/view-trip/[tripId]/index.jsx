import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels'; 
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import WeatherWidget from '../components/WeatherWidget';

function Viewtrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Track window width for responsive design
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const GetTripData = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document:", docSnap.data());
        setTrip({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No Such Document");
        toast('No trip Found!');
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
      toast.error('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  // Back button goes to Create Trip
  const handleBack = () => {
    navigate('/create-trip');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 480;

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        margin: 0,
        padding: 0
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid white',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!trip) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>No trip found</h2>
          <button 
            onClick={() => navigate('/create-trip')}
            style={{
              background: 'white',
              color: '#667eea',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '40px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Create New Trip
          </button>
        </div>
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
      position: 'relative',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      {/* Main Content - White Card */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        background: 'white',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        boxSizing: 'border-box'
      }}>
        {/* Information Section */}
        <InfoSection trip={trip} />
        
        {/* Weather Widget */}
        <div style={{ padding: '0 30px 20px 30px' }}>
          <WeatherWidget destination={trip?.userSelection?.location} />
        </div>
        
        {/* Recommended Hotels */}
        <div style={{ padding: '0 30px' }}>
          <Hotels trip={trip} />
        </div>
        
        {/* Daily Plans */}
        <div style={{ padding: '0 30px' }}>
          <PlacesToVisit trip={trip} />
        </div>
        
        {/* Footer */}
        <Footer />
        
        {/* Bottom Action Bar - Travel Guide and Back button in SAME LINE with proper spacing */}
        <div style={{ 
          padding: isMobile ? '20px 16px 30px 16px' : '20px 30px 30px 30px',
          borderTop: '1px solid #e5e7eb',
          marginTop: '20px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '12px' : '20px',
            flexWrap: 'nowrap'
          }}>
            {/* Travel Guide Button */}
            <button
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(trip?.userSelection?.location)} travel guide`, '_blank')}
              style={{
                padding: isSmallMobile ? '10px 12px' : '12px 28px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                fontSize: isSmallMobile ? '12px' : '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                color: 'white',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                minWidth: isSmallMobile ? '120px' : '150px',
                textAlign: 'center',
                flex: 1,
                maxWidth: isMobile ? '45%' : 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
              }}
            >
              {isSmallMobile ? '🔍 Travel Guide' : '🔍 Travel Guide'}
            </button>
            
            {/* Back Button - Same size, no arrow */}
            <button
              onClick={handleBack}
              style={{
                padding: isSmallMobile ? '10px 12px' : '12px 28px',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'white',
                borderRadius: '40px',
                border: 'none',
                cursor: 'pointer',
                fontSize: isSmallMobile ? '12px' : '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                minWidth: isSmallMobile ? '80px' : '150px',
                textAlign: 'center',
                flex: 1,
                maxWidth: isMobile ? '45%' : 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              Back
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
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Viewtrip;