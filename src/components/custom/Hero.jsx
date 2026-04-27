import React from 'react'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div style={{textAlign: 'center', width: '100%', marginTop: '4rem'}}>
      <h1 style={{fontSize: '50px', fontWeight: 'bold'}}>
        <span style={{color: 'red'}}>Discover Your Next Adventure with AI:</span><br />
        Personalised Travel Recommendations
      </h1>
      <p style={{fontSize: '20px', marginTop: '1rem'}}>
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>
      
      {/* Black button with Link to create-trip */}
      <Link to='/create-trip'>
        <button style={{
          backgroundColor: 'black',
          color: 'white',
          padding: '12px 24px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '8px',
          marginTop: '2rem',
          cursor: 'pointer'
        }}>
          Get Started, It's Free
        </button>
      </Link>
    </div>
  )
}

export default Hero