import React from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      borderBottom: '1px solid #ccc',
      backgroundColor: 'white'
    }}>
      <img 
        src='/logo.svg' 
        alt='logo'
        style={{height: '40px', cursor: 'pointer'}}
        onClick={() => navigate('/')}
      />
      
      <button 
        onClick={() => navigate('/my-trips')}
        style={{
          padding: '8px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
      >
        📋 My Trips
      </button>
    </div>
  )
}

export default Header