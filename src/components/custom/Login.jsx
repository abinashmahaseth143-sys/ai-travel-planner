import React, { useState, useEffect } from 'react';
import { signInWithGoogle } from '../../service/firebaseConfig';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await signInWithGoogle();
      if (user) {
        localStorage.removeItem('guestMode');
        localStorage.removeItem('guestTripsGenerated');
        toast.success(`Welcome ${user.displayName || 'Traveler'}! 🎉`);
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
      if (!error.message.includes('popup-closed-by-user')) {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Navigate back to home page (this closes the login page)
    navigate('/');
  };

  const handleGuestMode = () => {
    const guestTripsGenerated = parseInt(localStorage.getItem('guestTripsGenerated') || '0');
    const maxFreeTrips = 2;
    
    if (guestTripsGenerated >= maxFreeTrips) {
      toast.warning(`You've used your ${maxFreeTrips} free trips! Please sign in to create more.`);
      return;
    }
    
    localStorage.setItem('guestMode', 'true');
    if (!localStorage.getItem('guestTripsGenerated')) {
      localStorage.setItem('guestTripsGenerated', '0');
    }
    
    const remaining = maxFreeTrips - guestTripsGenerated;
    toast.success(`Welcome! You have ${remaining} free ${remaining === 1 ? 'trip' : 'trips'} remaining.`);
    navigate('/');
  };

  const remainingTrips = 2 - (parseInt(localStorage.getItem('guestTripsGenerated') || '0'));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '28px',
        padding: '40px',
        maxWidth: '420px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        position: 'relative',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#94a3b8',
            padding: '8px',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.color = '#475569';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          ✕
        </button>

        {/* Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 10px 25px rgba(102,126,234,0.3)'
        }}>
          <span style={{ fontSize: '40px' }}>✈️</span>
        </div>

        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '12px',
          color: '#1e293b'
        }}>
          Sign In to Your Account
        </h2>
        
        <p style={{
          fontSize: '14px',
          color: '#64748b',
          marginBottom: '32px',
          lineHeight: '1.5'
        }}>
          Sign in to save unlimited trips and access all features
        </p>
        
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '10px',
            marginBottom: '20px',
            color: '#ef4444',
            fontSize: '13px'
          }}>
            {error}
          </div>
        )}
        
        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 20px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '50px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            fontWeight: '500',
            transition: 'all 0.2s',
            opacity: loading ? 0.7 : 1,
            marginBottom: '20px'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
        
        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        </div>
        
        {/* Guest Mode Button */}
        <button
          onClick={handleGuestMode}
          style={{
            width: '100%',
            padding: '12px 20px',
            backgroundColor: '#f8fafc',
            color: '#475569',
            border: '1px solid #e2e8f0',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '500',
            transition: 'all 0.2s',
            marginBottom: '16px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          🎁 Try Free ({2 - (parseInt(localStorage.getItem('guestTripsGenerated') || '0'))} trips)
        </button>
        
        {/* Remaining Trips Info */}
        <p style={{
          fontSize: '12px',
          color: '#94a3b8',
          marginTop: '8px'
        }}>
          {remainingTrips > 0 
            ? `${remainingTrips} free ${remainingTrips === 1 ? 'trip' : 'trips'} remaining` 
            : 'No free trips left. Sign in to continue!'}
        </p>
      </div>
      
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Login;