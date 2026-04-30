import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      width: '100%',
      background: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
      {/* NO BOX - Just text directly on background */}
      <div>
        {/* Main Heading */}
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 52px)',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: 'white',
          lineHeight: '1.2',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          💫 Travel With Heart,<br />Not Just Feet
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(16px, 4vw, 18px)',
          color: 'rgba(255,255,255,0.95)',
          marginBottom: '10px'
        }}>
          Where you go matters. How you go matters more.
        </p>

        <p style={{
          fontSize: '16px',
          color: 'rgba(255,255,255,0.85)',
          marginBottom: '35px',
          fontWeight: '500'
        }}>
          Purposeful journeys for intentional travelers
        </p>

        {/* Button */}
        <Link to='/create-trip'>
          <button style={{
            background: 'white',
            color: '#ff0844',
            padding: '14px 40px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          }}>
            ✨ Get Started, It's Free →
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Hero