import React, { useState, useEffect } from 'react'
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
        {/* Logo Section */}
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
            style={{height: '36px'}}
          />
          <span style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: '#1f2937',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap'
          }}>
            AI-TRAVEL-PLANNER
          </span>
        </div>
        
        {/* Right Section - Buttons and User */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'center',
          flexShrink: 0
        }}>
          {/* Language Translator Button - FULL TEXT */}
          <button 
            onClick={() => setShowTranslator(true)}
            style={{
              padding: '6px 16px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            🌐 Language Translator
          </button>
          
          {/* User Profile Section */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px 4px 4px',
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
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <span style={{ fontSize: '13px', marginRight: '2px', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName?.split(' ')[0] || 'User'}
                </span>
                <span style={{ fontSize: '10px' }}>▼</span>
              </button>
              
              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  minWidth: '220px',
                  zIndex: 200,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{user.displayName}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate('/my-trips');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      textAlign: 'left',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  >
                    <span style={{ fontSize: '18px' }}>📜</span>
                    <span>My Travel History</span>
                  </button>
                  
                  <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '4px 0' }}></div>
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      textAlign: 'left',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                  >
                    <span style={{ fontSize: '18px' }}>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : isGuest ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                backgroundColor: '#fef3c7',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                color: '#d97706',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}>
                🎁 {remainingTrips} left
              </div>
              <button
                onClick={handleSignIn}
                style={{
                  padding: '6px 14px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
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
                padding: '6px 14px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              🔐 Sign In
            </button>
          )}
        </div>
      </div>

      {/* Language Translator Modal */}
      {showTranslator && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowTranslator(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '85vh',
            overflow: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#8b5cf6',
              color: 'white',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌍 Language Translator
              </h3>
              <button
                onClick={() => setShowTranslator(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0 8px'
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <LanguageTranslator />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;