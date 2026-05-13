import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

function CookiePreferences({ onClose }) {
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cookiePreferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setAnalytics(prefs.analytics !== false);
      setMarketing(prefs.marketing === true);
    }
  }, []);

  const savePreferences = () => {
    const prefs = { analytics, marketing };
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    toast.success('Your cookie preferences have been saved');
    onClose();
  };

  const acceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    savePreferences();
  };

  const rejectAll = () => {
    setAnalytics(false);
    setMarketing(false);
    savePreferences();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '28px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>Cookie Preference Center</h2>
          <p style={{ fontSize: '13px', opacity: 0.9 }}>
            We use cookies and similar technologies to enhance your experience.
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }}>
          <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '24px', lineHeight: '1.5' }}>
            Using websites and apps involves storing and retrieving information from your device, including cookies and other identifiers. 
            You can tailor your choices below. You may change your consent at any time.
          </p>

          {/* Strictly Necessary */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>Strictly Necessary Cookies</h3>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                These cookies are essential for the site to function and cannot be toggled off. They assist with security, 
                user authentication, saving trips, and core features.
              </p>
              <button
                onClick={() => setShowLearnMore(!showLearnMore)}
                style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '12px', cursor: 'pointer', marginTop: '8px', padding: 0 }}
              >
                Learn more →
              </button>
              {showLearnMore && (
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#4b5563', background: '#f9fafb', padding: '8px 12px', borderRadius: '8px' }}>
                  Essential cookies include authentication tokens, session identifiers, and preference storage. They do not track you across websites.
                </div>
              )}
            </div>
            <div style={{ marginLeft: '16px' }}>
              <span style={{ backgroundColor: '#e5e7eb', padding: '4px 12px', borderRadius: '40px', fontSize: '12px', fontWeight: '500' }}>Always Active</span>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f3f4f6'
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>Analytics Cookies</h3>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                These cookies help us understand how visitors interact with our site. They allow us to measure traffic, 
                track page views, and improve performance.
              </p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', fontWeight: '500' }}>{analytics ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>

          {/* Marketing Cookies */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: '600', marginBottom: '4px' }}>Marketing Performance Cookies</h3>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                These cookies help us measure the effectiveness of our marketing campaigns and personalise ads (not currently active, but reserved for future use).
              </p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', fontWeight: '500' }}>{marketing ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button
              onClick={rejectAll}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            >
              Reject All
            </button>
            <button
              onClick={savePreferences}
              style={{
                padding: '10px 20px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Save Preferences
            </button>
            <button
              onClick={acceptAll}
              style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              Accept All
            </button>
          </div>

          <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginTop: '24px' }}>
            You can change your cookie preferences at any time. This choice is saved in your browser.
          </p>
        </div>

        {/* Close button (X) */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '24px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default CookiePreferences;