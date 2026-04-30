import React, { useState, useEffect } from 'react'

function WeatherCountryAdvisor({ destination, onSelectDestination }) {
  const [weatherAdvice, setWeatherAdvice] = useState(null);
  const [recommendedCountries, setRecommendedCountries] = useState([]);

  // Complete worldwide country weather data with best seasons
  const countryData = {
    'Japan': { temp: { 'Jan': '2-10°C', 'Feb': '3-11°C', 'Mar': '6-15°C', 'Apr': '11-20°C', 'May': '16-24°C', 'Jun': '20-27°C', 'Jul': '24-30°C', 'Aug': '25-31°C', 'Sep': '21-27°C', 'Oct': '15-22°C', 'Nov': '9-17°C', 'Dec': '4-12°C' }, flag: '🇯🇵', best: ['Mar', 'Apr', 'May', 'Oct', 'Nov'], icon: '🌸', description: 'Cherry blossoms, temples, Mount Fuji' },
    'Italy': { temp: { 'Jan': '6-12°C', 'Feb': '7-13°C', 'Mar': '10-16°C', 'Apr': '13-19°C', 'May': '17-23°C', 'Jun': '21-27°C', 'Jul': '24-30°C', 'Aug': '24-30°C', 'Sep': '20-26°C', 'Oct': '15-21°C', 'Nov': '10-16°C', 'Dec': '7-13°C' }, flag: '🇮🇹', best: ['Apr', 'May', 'Jun', 'Sep', 'Oct'], icon: '🍕', description: 'Colosseum, Venice canals, Roman ruins' },
    'France': { temp: { 'Jan': '5-8°C', 'Feb': '6-10°C', 'Mar': '8-13°C', 'Apr': '13-18°C', 'May': '17-22°C', 'Jun': '20-25°C', 'Jul': '22-27°C', 'Aug': '22-27°C', 'Sep': '18-23°C', 'Oct': '13-18°C', 'Nov': '8-12°C', 'Dec': '5-9°C' }, flag: '🇫🇷', best: ['Apr', 'May', 'Jun', 'Sep', 'Oct'], icon: '🗼', description: 'Eiffel Tower, Louvre Museum, French Riviera' },
    'Spain': { temp: { 'Jan': '8-15°C', 'Feb': '9-16°C', 'Mar': '11-18°C', 'Apr': '13-20°C', 'May': '16-23°C', 'Jun': '20-28°C', 'Jul': '23-31°C', 'Aug': '23-31°C', 'Sep': '20-27°C', 'Oct': '16-22°C', 'Nov': '11-17°C', 'Dec': '9-15°C' }, flag: '🇪🇸', best: ['May', 'Jun', 'Jul', 'Aug', 'Sep'], icon: '💃', description: 'Sagrada Familia, beaches, flamenco' },
    'Greece': { temp: { 'Jan': '8-14°C', 'Feb': '8-15°C', 'Mar': '10-17°C', 'Apr': '13-20°C', 'May': '17-24°C', 'Jun': '21-29°C', 'Jul': '24-32°C', 'Aug': '24-32°C', 'Sep': '20-28°C', 'Oct': '16-23°C', 'Nov': '12-18°C', 'Dec': '9-15°C' }, flag: '🇬🇷', best: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], icon: '🏛️', description: 'Santorini sunsets, Acropolis, Greek islands' },
    'Turkey': { temp: { 'Jan': '4-10°C', 'Feb': '5-11°C', 'Mar': '7-14°C', 'Apr': '11-18°C', 'May': '15-23°C', 'Jun': '19-28°C', 'Jul': '22-31°C', 'Aug': '22-31°C', 'Sep': '18-27°C', 'Oct': '14-21°C', 'Nov': '9-15°C', 'Dec': '6-11°C' }, flag: '🇹🇷', best: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], icon: '🕌', description: 'Istanbul mosques, Cappadocia balloons' },
    'Portugal': { temp: { 'Jan': '11-15°C', 'Feb': '11-16°C', 'Mar': '13-18°C', 'Apr': '15-20°C', 'May': '17-22°C', 'Jun': '20-26°C', 'Jul': '22-28°C', 'Aug': '22-28°C', 'Sep': '20-26°C', 'Oct': '17-22°C', 'Nov': '14-18°C', 'Dec': '12-16°C' }, flag: '🇵🇹', best: ['May', 'Jun', 'Jul', 'Aug', 'Sep'], icon: '🏄', description: 'Lisbon hills, Algarve beaches, port wine' },
    'Croatia': { temp: { 'Jan': '6-10°C', 'Feb': '7-11°C', 'Mar': '9-14°C', 'Apr': '12-17°C', 'May': '16-22°C', 'Jun': '20-26°C', 'Jul': '23-29°C', 'Aug': '23-29°C', 'Sep': '19-24°C', 'Oct': '15-20°C', 'Nov': '11-15°C', 'Dec': '8-12°C' }, flag: '🇭🇷', best: ['May', 'Jun', 'Jul', 'Aug', 'Sep'], icon: '🏖️', description: 'Dubrovnik walls, Plitvice lakes, Adriatic Sea' },
    'Thailand': { temp: { 'Jan': '22-32°C', 'Feb': '23-33°C', 'Mar': '24-34°C', 'Apr': '25-35°C', 'May': '25-34°C', 'Jun': '25-33°C', 'Jul': '24-32°C', 'Aug': '24-32°C', 'Sep': '24-32°C', 'Oct': '24-32°C', 'Nov': '23-31°C', 'Dec': '22-30°C' }, flag: '🇹🇭', best: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'], icon: '🐘', description: 'Bangkok temples, Phuket beaches, Thai food' },
    'Vietnam': { temp: { 'Jan': '20-25°C', 'Feb': '21-27°C', 'Mar': '23-30°C', 'Apr': '25-33°C', 'May': '26-34°C', 'Jun': '26-34°C', 'Jul': '25-33°C', 'Aug': '25-33°C', 'Sep': '24-31°C', 'Oct': '23-30°C', 'Nov': '22-28°C', 'Dec': '20-26°C' }, flag: '🇻🇳', best: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], icon: '🛵', description: 'Ha Long Bay, Hoi An lanterns, pho noodles' },
    'Indonesia': { temp: { 'Jan': '24-31°C', 'Feb': '24-31°C', 'Mar': '24-32°C', 'Apr': '24-32°C', 'May': '24-32°C', 'Jun': '24-31°C', 'Jul': '23-31°C', 'Aug': '23-31°C', 'Sep': '24-31°C', 'Oct': '24-32°C', 'Nov': '24-32°C', 'Dec': '24-31°C' }, flag: '🇮🇩', best: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], icon: '🏝️', description: 'Bali rice terraces, Komodo dragons, volcanoes' },
    'Maldives': { temp: { 'Jan': '27-30°C', 'Feb': '27-30°C', 'Mar': '28-31°C', 'Apr': '28-31°C', 'May': '28-31°C', 'Jun': '28-30°C', 'Jul': '27-30°C', 'Aug': '27-30°C', 'Sep': '27-30°C', 'Oct': '27-30°C', 'Nov': '27-30°C', 'Dec': '27-30°C' }, flag: '🇲🇻', best: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], icon: '🏊', description: 'Overwater villas, crystal clear waters, snorkeling' },
    'Egypt': { temp: { 'Jan': '14-22°C', 'Feb': '15-24°C', 'Mar': '18-27°C', 'Apr': '21-31°C', 'May': '24-34°C', 'Jun': '27-36°C', 'Jul': '28-37°C', 'Aug': '28-37°C', 'Sep': '26-34°C', 'Oct': '23-31°C', 'Nov': '19-27°C', 'Dec': '15-23°C' }, flag: '🇪🇬', best: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], icon: '🐫', description: 'Pyramids of Giza, Nile River, Red Sea diving' },
    'Morocco': { temp: { 'Jan': '9-18°C', 'Feb': '10-19°C', 'Mar': '12-21°C', 'Apr': '14-23°C', 'May': '17-26°C', 'Jun': '20-29°C', 'Jul': '22-33°C', 'Aug': '22-33°C', 'Sep': '20-30°C', 'Oct': '17-26°C', 'Nov': '13-21°C', 'Dec': '10-19°C' }, flag: '🇲🇦', best: ['Mar', 'Apr', 'May', 'Sep', 'Oct', 'Nov'], icon: '🐪', description: 'Marrakech markets, Sahara desert, Atlas mountains' },
    'South Africa': { temp: { 'Jan': '18-28°C', 'Feb': '18-28°C', 'Mar': '16-26°C', 'Apr': '13-23°C', 'May': '10-20°C', 'Jun': '7-18°C', 'Jul': '7-18°C', 'Aug': '8-19°C', 'Sep': '11-22°C', 'Oct': '14-24°C', 'Nov': '16-26°C', 'Dec': '17-27°C' }, flag: '🇿🇦', best: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], icon: '🦁', description: 'Safari adventures, Cape Town, wine tasting' },
    'Mexico': { temp: { 'Jan': '14-24°C', 'Feb': '15-25°C', 'Mar': '17-27°C', 'Apr': '19-29°C', 'May': '21-31°C', 'Jun': '22-31°C', 'Jul': '22-31°C', 'Aug': '22-31°C', 'Sep': '21-30°C', 'Oct': '19-28°C', 'Nov': '16-26°C', 'Dec': '14-24°C' }, flag: '🇲🇽', best: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], icon: '🌮', description: 'Cancun beaches, Chichen Itza pyramids, tacos' },
    'Australia': { temp: { 'Jan': '19-29°C', 'Feb': '19-29°C', 'Mar': '17-27°C', 'Apr': '14-24°C', 'May': '11-20°C', 'Jun': '8-17°C', 'Jul': '7-16°C', 'Aug': '8-17°C', 'Sep': '10-20°C', 'Oct': '13-23°C', 'Nov': '16-26°C', 'Dec': '18-28°C' }, flag: '🇦🇺', best: ['Sep', 'Oct', 'Nov', 'Mar', 'Apr', 'May'], icon: '🦘', description: 'Sydney Opera House, Great Barrier Reef, kangaroos' }
  };

  const getCurrentMonth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date().getMonth()];
  };

  const getWeatherAdviceForDestination = (destinationName) => {
    if (!destinationName) return null;
    const data = countryData[destinationName];
    if (!data) return null;
    const currentMonth = getCurrentMonth();
    const monthlyTemp = data.temp[currentMonth];
    const isGoodTime = data.best.includes(currentMonth);
    
    return {
      country: destinationName,
      temp: monthlyTemp,
      flag: data.flag,
      bestMonths: data.best.join(', '),
      icon: data.icon,
      description: data.description,
      currentMonth,
      isGoodTime
    };
  };

  // Get only the 8 best countries for current month (filtered and sorted)
  const getBestCountriesForCurrentMonth = () => {
    const currentMonth = getCurrentMonth();
    const bestCountries = [];
    
    for (const [country, data] of Object.entries(countryData)) {
      if (data.best.includes(currentMonth)) {
        bestCountries.push({
          country,
          temp: data.temp[currentMonth],
          flag: data.flag,
          bestMonths: data.best.join(', '),
          icon: data.icon,
          description: data.description
        });
      }
    }
    
    // Shuffle and return only 8
    const shuffled = [...bestCountries];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 8);
  };

  useEffect(() => {
    setRecommendedCountries(getBestCountriesForCurrentMonth());
  }, []);

  useEffect(() => {
    if (destination) {
      let matchedCountry = null;
      for (const country of Object.keys(countryData)) {
        if (destination.toLowerCase().includes(country.toLowerCase())) {
          matchedCountry = country;
          break;
        }
      }
      if (matchedCountry) {
        setWeatherAdvice(getWeatherAdviceForDestination(matchedCountry));
      } else {
        setWeatherAdvice(null);
      }
    } else {
      setWeatherAdvice(null);
    }
  }, [destination]);

  const currentMonth = getCurrentMonth();

  return (
    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
      {/* Weather Advice for Selected Destination */}
      {weatherAdvice && weatherAdvice.isGoodTime && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>✅</span>
            <span style={{ fontSize: '32px' }}>{weatherAdvice.flag}</span>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, fontFamily: 'inherit' }}>{weatherAdvice.country}</h4>
              <p style={{ fontSize: '12px', color: '#166534', margin: '4px 0 0', fontFamily: 'inherit' }}>
                Great time to visit! {weatherAdvice.temp}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Best Countries Section - Only 8 countries */}
      <div>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'inherit'
        }}>
          <span>🌟</span> Best Countries to Visit in {currentMonth}
          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal' }}>(Click any country to plan your trip)</span>
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}>
          {recommendedCountries.map((country, idx) => (
            <div 
              key={idx} 
              onClick={() => onSelectDestination && onSelectDestination(country.country)} 
              style={{
                cursor: 'pointer',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s ease',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#c7d2fe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={{ padding: '16px' }}>
                {/* Country Flag and Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '36px' }}>{country.flag}</span>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#1f2937', fontFamily: 'inherit' }}>
                      {country.country}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <span style={{ fontSize: '12px' }}>{country.icon}</span>
                      <span style={{ fontSize: '10px', color: '#6b7280' }}>{country.description}</span>
                    </div>
                  </div>
                </div>
                
                {/* Temperature */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fef3c7',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '12px' }}>🌡️</span>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#92400e' }}>{country.temp}</span>
                  <span style={{ fontSize: '10px', color: '#92400e' }}>in {currentMonth}</span>
                </div>
                
                {/* Best Months */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px' }}>📅</span>
                  <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '500' }}>Best: {country.bestMonths}</span>
                </div>
                
                {/* Peak Season Badge */}
                <div style={{ marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '10px',
                    background: '#dbeafe',
                    color: '#1d4ed8',
                    padding: '2px 10px',
                    borderRadius: '20px'
                  }}>
                    ⭐ Peak Season Now
                  </span>
                </div>
                
                {/* Click to Plan */}
                <div style={{ 
                  marginTop: '8px',
                  paddingTop: '10px',
                  borderTop: '1px solid #f3f4f6',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: '500', color: '#3b82f6', fontFamily: 'inherit' }}>
                    Click to plan → ✈️
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherCountryAdvisor;