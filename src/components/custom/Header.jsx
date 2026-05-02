import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import LanguageTranslator from '../LanguageTranslator'
import { auth, logout } from '../../service/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { toast } from 'sonner'

function Header() {
  const navigate = useNavigate();
  const [showTranslator, setShowTranslator] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [remainingTrips, setRemainingTrips] = useState(2);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
  
  const userMenuRef = useRef(null);

  // Track window size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      const guestMode = localStorage.getItem('guestMode') === 'true';
      setIsGuest(guestMode && !user);
      
      const guestTripsGenerated = parseInt(localStorage.getItem('guestTripsGenerated') || '0');
      setRemainingTrips(2 - guestTripsGenerated);
    });
    return () => unsubscribe();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showTranslator) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showTranslator]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('guestMode');
      localStorage.removeItem('guestTripsGenerated');
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleSignIn = () => {
    localStorage.removeItem('guestMode');
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Responsive modal width based on device
  const getModalWidth = () => {
    if (windowWidth <= 480) return '95%';      // iPhone SE, small Android
    if (windowWidth <= 640) return '92%';      // iPhone 12/13/14, small tablet
    if (windowWidth <= 768) return '90%';      // iPad Mini, Galaxy Tab
    if (windowWidth <= 1024) return '85%';     // iPad, small laptop
    if (windowWidth <= 1280) return '800px';   // MacBook Air, small laptop
    return '900px';                            // Desktop, large laptop
  };

  // Responsive modal height based on device
  const getModalHeight = () => {
    if (windowHeight <= 600) return '95vh';    // Small devices in landscape
    if (windowHeight <= 700) return '90vh';    // Medium phones
    if (windowHeight <= 800) return '88vh';    // Most phones
    return '85vh';                             // Tablets and desktops
  };

  // Responsive padding based on device
  const getModalPadding = () => {
    if (windowWidth <= 480) return '12px';
    if (windowWidth <= 640) return '16px';
    if (windowWidth <= 768) return '20px';
    return '24px';
  };

  // Responsive header padding
  const getHeaderPadding = () => {
    if (windowWidth <= 480) return '12px 16px';
    if (windowWidth <= 640) return '14px 20px';
    return '16px 24px';
  };

  // Check if device is mobile for special adjustments
  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 480;

  return (
    <>
      <div style={{
        padding: '10px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        boxSizing: 'border-box'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer',
          flexShrink: 0
        }} onClick={() => navigate('/')}>
          <img 
            src='/logo.svg' 
            alt='logo'
            style={{height: isMobile ? '30px' : '36px'}}
          />
          <span style={{
            fontSize: isMobile ? '9px' : '11px',
            fontWeight: 'bold',
            color: '#1f2937',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap'
          }}>
            AI-TRAVEL-PLANNER
          </span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: isMobile ? '8px' : '12px', 
          alignItems: 'center',
          flexShrink: 0
        }}>
          {user ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '4px' : '6px',
                  padding: isMobile ? '3px 6px 3px 3px' : '4px 8px 4px 4px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <img
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName?.[0] || 'U'}&background=3b82f6&color=fff`}
                  alt={user.displayName}
                  style={{
                    width: isMobile ? '24px' : '28px',
                    height: isMobile ? '24px' : '28px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                {!isSmallMobile && (
                  <>
                    <span style={{ fontSize: isMobile ? '11px' : '13px', marginRight: '2px', maxWidth: isMobile ? '70px' : '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.displayName?.split(' ')[0] || 'User'}
                    </span>
                    <span style={{ fontSize: isMobile ? '8px' : '10px' }}>▼</span>
                  </>
                )}
                {isSmallMobile && <span style={{ fontSize: '10px' }}>▼</span>}
              </button>
              
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02)',
                  minWidth: isMobile ? '220px' : '260px',
                  zIndex: 200,
                  overflow: 'hidden',
                  border: '1px solid #f0f0f0'
                }}>
                  <div style={{ 
                    padding: isMobile ? '12px 16px' : '16px 20px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <p style={{ fontWeight: 'bold', fontSize: isMobile ? '13px' : '15px', marginBottom: '4px' }}>{user.displayName}</p>
                    {!isSmallMobile && <p style={{ fontSize: '10px', opacity: 0.85 }}>{user.email}</p>}
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowTranslator(true);
                    }}
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px 16px' : '14px 20px',
                      textAlign: 'left',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: '500',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s',
                      borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
                    }}
                  >
                    <span style={{ fontSize: isMobile ? '18px' : '20px' }}>🌐</span>
                    <span>Language Translator</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/my-trips');
                    }}
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px 16px' : '14px 20px',
                      textAlign: 'left',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: '500',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s',
                      borderBottom: '1px solid rgba(255,255,255,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                    }}
                  >
                    <span style={{ fontSize: isMobile ? '18px' : '20px' }}>📜</span>
                    <span>My Travel History</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: isMobile ? '12px 16px' : '14px 20px',
                      textAlign: 'left',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: '500',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                    }}
                  >
                    <span style={{ fontSize: isMobile ? '18px' : '20px' }}>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : isGuest ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px' }}>
              <div style={{
                backgroundColor: '#fef3c7',
                padding: isMobile ? '3px 8px' : '4px 10px',
                borderRadius: '20px',
                fontSize: isMobile ? '9px' : '11px',
                color: '#d97706',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}>
                🎁 {remainingTrips} left
              </div>
              <button
                onClick={handleSignIn}
                style={{
                  padding: isMobile ? '5px 10px' : '6px 14px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '10px' : '12px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap'
                }}
              >
                Sign In
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              style={{
                padding: isMobile ? '5px 12px' : '6px 14px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: isMobile ? '11px' : '13px',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              {isMobile ? '🔐 Sign In' : '🔐 Sign In'}
            </button>
          )}
        </div>
      </div>

      {/* Language Translator Modal - FULLY RESPONSIVE FOR ALL DEVICES */}
      {showTranslator && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          overflow: 'hidden',
          margin: 0,
          padding: isMobile ? '10px' : '20px'
        }} onClick={() => setShowTranslator(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: isMobile ? '16px' : '20px',
            maxWidth: getModalWidth(),
            width: windowWidth <= 480 ? '95%' : '90%',
            minWidth: windowWidth <= 480 ? 'auto' : '320px',
            maxHeight: getModalHeight(),
            height: 'auto',
            overflowY: 'auto',
            overflowX: 'hidden',
            position: 'relative',
            margin: '0 auto',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: getHeaderPadding(),
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: '#8b5cf6',
              color: 'white',
              borderTopLeftRadius: isMobile ? '16px' : '20px',
              borderTopRightRadius: isMobile ? '16px' : '20px',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <h3 style={{ 
                fontSize: isMobile ? '16px' : '18px', 
                fontWeight: 'bold', 
                margin: 0, 
                display: 'flex', 
                alignItems: 'center', 
                gap: isMobile ? '6px' : '8px' 
              }}>
                <span style={{ fontSize: isMobile ? '18px' : '20px' }}>🌍</span>
                {!isSmallMobile && "Language Translator"}
                {isSmallMobile && "Translator"}
              </h3>
              <button
                onClick={() => setShowTranslator(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: isMobile ? '24px' : '28px',
                  cursor: 'pointer',
                  padding: '0 8px',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>
            <div style={{ 
              padding: getModalPadding(),
              overflowX: 'hidden',
              wordWrap: 'break-word'
            }}>
              <LanguageTranslator />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;