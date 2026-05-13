import React from 'react';
import { Link, useNavigate } from 'react-router-dom';   // added useNavigate

function Terms() {
  const navigate = useNavigate();   // for going back

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: '60px 20px' 
    }}>
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        background: 'white', 
        borderRadius: '32px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '48px 40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Terms of Service</h1>
          <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '14px' }}>Effective date: May 10, 2026</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* ... all your sections remain unchanged ... */}
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing or using AI Travel Planner (“the Service”), you agree to be bound by these Terms...</p>
            </section>
            <section>
              <h2>2. User Accounts & Guest Mode</h2>
              <p>You may sign in using Google Authentication or continue as a guest...</p>
            </section>
            <section>
              <h2>3. Use of the Service</h2>
              <p>You may use AI Travel Planner to generate travel itineraries...</p>
            </section>
            <section>
              <h2>4. Third-Party Services</h2>
              <p>Our Service integrates with: Google Places API, Open-Meteo, Firebase, Google Translate...</p>
            </section>
            <section>
              <h2>5. Disclaimer of Warranties</h2>
              <p>The Service is provided “as is” without warranties...</p>
            </section>
            <section>
              <h2>6. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, AI Travel Planner shall not be liable...</p>
            </section>
            <section>
              <h2>7. Contact</h2>
              <p>Questions about these Terms? Contact us at: <strong>abinashmahaseth@gmail.com</strong></p>
            </section>
          </div>

          {/* Back button - goes to previous page (View Trip) */}
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;