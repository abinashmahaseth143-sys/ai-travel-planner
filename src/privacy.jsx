import React from 'react';
import { useNavigate } from 'react-router-dom';

function Privacy() {
  const navigate = useNavigate();

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
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Privacy Policy</h1>
          <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '14px' }}>Last updated: May 13, 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>1. Information We Collect</h2>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                <strong>Personal Information:</strong> When you sign in with Google, we receive your name, email address, and profile picture. Guest users do not provide personal information, but we generate a temporary anonymous ID.
              </p>
              <p style={{ marginTop: '12px' }}><strong>Trip Data:</strong> We store the destination, number of days, budget, traveler type, and the generated itinerary (hotels, attractions, daily plans) that you create.</p>
              <p style={{ marginTop: '12px' }}><strong>Usage Data:</strong> We may collect anonymised information about how you use the Service (e.g., pages visited, features used) to improve performance.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>2. How We Use Your Information</h2>
              <ul style={{ marginLeft: '24px', color: '#374151', lineHeight: '1.6' }}>
                <li>To generate and save your personalised travel itineraries</li>
                <li>To authenticate you and remember your saved trips</li>
                <li>To display hotel and attraction recommendations (via Google Places API)</li>
                <li>To show current weather for your destination (via Open-Meteo)</li>
                <li>To provide translation services (via Google Translate endpoint)</li>
                <li>To improve the Service and fix bugs</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>3. Cookies & Tracking</h2>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                We use essential cookies (always active) to enable login, session management, and saving trips. You can control optional analytics and marketing cookies via the <strong>Cookie Preferences</strong> link in the footer.
              </p>
              <p style={{ marginTop: '12px' }}>Your cookie choices are saved in your browser's local storage and can be changed at any time.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>4. Sharing of Information</h2>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                We do <strong>not</strong> sell your personal data. We share information only:
              </p>
              <ul style={{ marginLeft: '24px', color: '#374151', lineHeight: '1.6' }}>
                <li>With third-party APIs (Google Places, Open-Meteo, Firebase) to provide core functionality</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>5. Data Retention & Security</h2>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                Your trips are stored in Firestore until you delete them. Guest trips are automatically removed after 30 days of inactivity. We use industry-standard security measures, but no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>6. Your Rights</h2>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                Depending on your location, you may have the following rights regarding your personal data:
              </p>
              <ul style={{ marginLeft: '24px', color: '#374151', lineHeight: '1.6' }}>
                <li><strong>Access:</strong> You can view all your saved trips and profile information in the "My Trips" section of the app.</li>
                <li><strong>Correction:</strong> You can edit your trip details directly from the trip view page. To correct your profile information, update it in your Google account settings.</li>
                <li><strong>Export:</strong> You can download all your trip data as a JSON file by clicking the "Export Data" button in the My Trips page.</li>
                <li><strong>Deletion:</strong> You can delete individual trips from the My Trips page, or delete your entire account (including all trips) via the "Delete Account" option in the user menu.</li>
              </ul>
              <p style={{ marginTop: '12px' }}>If you are unable to perform any of these actions through the app, please contact us at <strong>abinashmahaseth@gmail.com</strong> and we will respond within 30 days.</p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>7. Children's Privacy</h2>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                The Service is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with data, please contact us.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>8. Contact Us</h2>
              <p style={{ color: '#374151', lineHeight: '1.6' }}>
                For privacy questions or to request deletion of your data, email: <strong>abinashmahaseth@gmail.com</strong>
              </p>
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

export default Privacy;