import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';
import WeatherWidget from '../components/WeatherWidget';
import CookiePreferences from '../../components/custom/CookiePreferences';

function Viewtrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [showCookieModal, setShowCookieModal] = useState(false);

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
      margin: '0',
      overflowX: 'hidden',
      overflowY: 'auto',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      position: 'relative',
      boxSizing: 'border-box'
    }}>
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
        <InfoSection trip={trip} />
        
        <div style={{ padding: '0 30px 20px 30px' }}>
          <WeatherWidget destination={trip?.userSelection?.location} />
        </div>
        
        <div style={{ padding: '0 30px' }}>
          <Hotels trip={trip} />
        </div>
        
        <div style={{ padding: '0 30px' }}>
          <PlacesToVisit trip={trip} />
        </div>
        
        <Footer />
        
        {/* BOTTOM ACTION BAR - Legal links on left, Back button on right */}
        <div style={{ 
          padding: isMobile ? '12px 16px' : '16px 24px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: '12px'
        }}>
          {/* Left section - legal links + copyright (no wrapping) */}
          <div style={{ 
            display: 'flex', 
            gap: isMobile ? '12px' : '20px', 
            flexWrap: 'nowrap',
            alignItems: 'center',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            <Link to="/terms" style={{ color: '#000000', textDecoration: 'none', fontSize: isMobile ? '11px' : '13px', whiteSpace: 'nowrap' }}>
              Terms of Service
            </Link>
            <Link to="/privacy" style={{ color: '#000000', textDecoration: 'none', fontSize: isMobile ? '11px' : '13px', whiteSpace: 'nowrap' }}>
              Privacy Policy
            </Link>
            <button 
              onClick={() => setShowCookieModal(true)} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#000000', 
                cursor: 'pointer', 
                fontSize: isMobile ? '11px' : '13px', 
                padding: 0, 
                whiteSpace: 'nowrap'
              }}
            >
              Cookie Preferences
            </button>
            <span style={{ color: '#9ca3af', fontSize: isMobile ? '10px' : '12px', whiteSpace: 'nowrap' }}>
              © 2026 AI Travel Planner
            </span>
          </div>

          {/* Right section - Back button (fixed width, never shrinks) */}
          <button
            onClick={handleBack}
            style={{
              padding: isSmallMobile ? '6px 16px' : '8px 24px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              color: 'white',
              borderRadius: '40px',
              border: 'none',
              cursor: 'pointer',
              fontSize: isSmallMobile ? '12px' : '14px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            ← Back
          </button>
        </div>
      </div>
      
      {/* Scroll to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            fontSize: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
          }}
        >
          ↑
        </button>
      )}
      
      {showCookieModal && <CookiePreferences onClose={() => setShowCookieModal(false)} />}
      
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