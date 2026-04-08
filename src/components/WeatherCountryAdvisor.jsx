import React, { useState, useEffect } from 'react'

function WeatherCountryAdvisor({ destination, onSelectDestination }) {
  const [weatherAdvice, setWeatherAdvice] = useState(null);
  const [recommendedCountries, setRecommendedCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Complete country weather data for all months
  const countryWeatherData = {
    // January - Best for winter sun and snow
    'Thailand': { bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'], temp: '28-32°C', condition: '☀️ Sunny', description: 'Perfect beach weather' },
    'Spain': { bestMonths: ['May', 'Jun', 'Sep', 'Oct'], temp: '22-28°C', condition: '☀️ Sunny', description: 'Great for sightseeing' },
    'Japan': { bestMonths: ['Mar', 'Apr', 'May', 'Oct', 'Nov'], temp: '15-22°C', condition: '🌸 Cherry blossom', description: 'Beautiful scenery' },
    'Italy': { bestMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct'], temp: '20-28°C', condition: '☀️ Sunny', description: 'Perfect for exploring' },
    'Australia': { bestMonths: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], temp: '25-35°C', condition: '☀️ Sunny', description: 'Summer paradise' },
    'Switzerland': { bestMonths: ['Jun', 'Jul', 'Aug', 'Sep'], temp: '15-22°C', condition: '🏔️ Mountain', description: 'Hiking and views' },
    'Greece': { bestMonths: ['May', 'Jun', 'Sep', 'Oct'], temp: '24-30°C', condition: '☀️ Sunny', description: 'Island hopping' },
    'France': { bestMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct'], temp: '18-25°C', condition: '☀️ Sunny', description: 'Romantic getaways' },
    'Morocco': { bestMonths: ['Mar', 'Apr', 'May', 'Sep', 'Oct', 'Nov'], temp: '20-30°C', condition: '☀️ Sunny', description: 'Desert adventures' },
    'Vietnam': { bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], temp: '25-30°C', condition: '☀️ Sunny', description: 'Beautiful landscapes' },
    'Croatia': { bestMonths: ['May', 'Jun', 'Sep', 'Oct'], temp: '22-28°C', condition: '☀️ Sunny', description: 'Stunning coastline' },
    'Portugal': { bestMonths: ['May', 'Jun', 'Sep', 'Oct'], temp: '22-28°C', condition: '☀️ Sunny', description: 'Beautiful beaches' },
    'Turkey': { bestMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct'], temp: '22-30°C', condition: '☀️ Sunny', description: 'History and beaches' },
    'Indonesia': { bestMonths: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], temp: '27-32°C', condition: '☀️ Sunny', description: 'Tropical paradise' },
    'Mexico': { bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], temp: '25-32°C', condition: '☀️ Sunny', description: 'Beaches and culture' },
    'Costa Rica': { bestMonths: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr'], temp: '25-30°C', condition: '☀️ Sunny', description: 'Rainforest adventures' },
    'South Africa': { bestMonths: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], temp: '20-28°C', condition: '☀️ Sunny', description: 'Safari and wine' },
    'New Zealand': { bestMonths: ['Dec', 'Jan', 'Feb', 'Mar'], temp: '18-25°C', condition: '☀️ Sunny', description: 'Outdoor adventures' },
    'Peru': { bestMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], temp: '15-22°C', condition: '☀️ Sunny', description: 'Machu Picchu' },
    'Chile': { bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'], temp: '18-25°C', condition: '☀️ Sunny', description: 'Atacama and Patagonia' },
    'Nepal': { bestMonths: ['Mar', 'Apr', 'May', 'Sep', 'Oct', 'Nov'], temp: '15-22°C', condition: '🏔️ Mountain', description: 'Himalayan views' },
    'Bhutan': { bestMonths: ['Mar', 'Apr', 'May', 'Sep', 'Oct', 'Nov'], temp: '15-22°C', condition: '🌸 Spring', description: 'Happiness kingdom' },
    'Sri Lanka': { bestMonths: ['Dec', 'Jan', 'Feb', 'Mar'], temp: '25-30°C', condition: '☀️ Sunny', description: 'Beach and wildlife' },
    'Maldives': { bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], temp: '27-30°C', condition: '☀️ Sunny', description: 'Overwater bungalows' },
    'UAE': { bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'], temp: '22-28°C', condition: '☀️ Sunny', description: 'Luxury and shopping' },
    'Egypt': { bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], temp: '20-28°C', condition: '☀️ Sunny', description: 'Pyramids and Nile' },
    'Kenya': { bestMonths: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep'], temp: '20-28°C', condition: '☀️ Sunny', description: 'Safari adventure' },
    'Tanzania': { bestMonths: ['Jan', 'Feb', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], temp: '20-28°C', condition: '☀️ Sunny', description: 'Serengeti and Zanzibar' },
    'India': { bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], temp: '20-30°C', condition: '☀️ Sunny', description: 'Incredible diversity' },
    'Brazil': { bestMonths: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], temp: '25-32°C', condition: '☀️ Sunny', description: 'Amazon and beaches' }
  };

  // Get current month
  const getCurrentMonth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date().getMonth()];
  };

  // Get countries with best weather for current month
  const getBestCountriesForCurrentMonth = () => {
    const currentMonth = getCurrentMonth();
    const bestCountries = [];
    
    for (const [country, data] of Object.entries(countryWeatherData)) {
      if (data.bestMonths.includes(currentMonth)) {
        bestCountries.push({
          country: country,
          temp: data.temp,
          condition: data.condition,
          description: data.description,
          bestMonths: data.bestMonths.join(', ')
        });
      }
    }
    
    // Shuffle and return random 6
    const shuffled = [...bestCountries].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  };

  // Get weather advice for selected destination
  const getWeatherAdviceForDestination = (destinationName) => {
    // Find matching country
    let matchedCountry = null;
    let matchedData = null;
    
    for (const [country, data] of Object.entries(countryWeatherData)) {
      if (destinationName.toLowerCase().includes(country.toLowerCase())) {
        matchedCountry = country;
        matchedData = data;
        break;
      }
    }
    
    if (matchedData) {
      const currentMonth = getCurrentMonth();
      const isGoodTime = matchedData.bestMonths.includes(currentMonth);
      
      return {
        country: matchedCountry,
        temp: matchedData.temp,
        condition: matchedData.condition,
        bestMonths: matchedData.bestMonths.join(', '),
        description: matchedData.description,
        currentMonth,
        isGoodTime,
        recommendation: isGoodTime ? '✅ GOOD TIME TO VISIT' : '⚠️ NOT IDEAL TIME',
        advice: isGoodTime ? 
          `Great time to visit ${matchedCountry}! ${matchedData.condition} weather, ${matchedData.temp}. ${matchedData.description}` :
          `Not the best time for ${matchedCountry}. Best months: ${matchedData.bestMonths.join(', ')}. ${matchedData.description}`
      };
    }
    return null;
  };

  useEffect(() => {
    const bestCountries = getBestCountriesForCurrentMonth();
    setRecommendedCountries(bestCountries);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (destination) {
      const advice = getWeatherAdviceForDestination(destination);
      setWeatherAdvice(advice);
    } else {
      setWeatherAdvice(null);
    }
  }, [destination]);

  const currentMonth = getCurrentMonth();

  if (loading) {
    return (
      <div style={{ marginTop: '30px', marginBottom: '20px', textAlign: 'center' }}>
        <p>Loading best destinations for {currentMonth}...</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
      {/* Weather Advice for Selected Destination */}
      {weatherAdvice && (
        <div style={{
          backgroundColor: weatherAdvice.isGoodTime ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${weatherAdvice.isGoodTime ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px' }}>{weatherAdvice.isGoodTime ? '✅' : '⚠️'}</span>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: weatherAdvice.isGoodTime ? '#166534' : '#991b1b' }}>
              {weatherAdvice.recommendation}
            </h3>
          </div>
          <p style={{ marginBottom: '12px', color: '#4b5563' }}>{weatherAdvice.advice}</p>
          <div style={{ 
            display: 'inline-block', 
            padding: '4px 12px', 
            backgroundColor: weatherAdvice.isGoodTime ? '#dcfce7' : '#fee2e2', 
            borderRadius: '20px',
            fontSize: '12px'
          }}>
            🌡️ {weatherAdvice.temp} • {weatherAdvice.condition}
          </div>
        </div>
      )}

      {/* Best Countries to Visit Now */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🌍</span> Best Countries to Visit in {currentMonth}
        </h3>
        {recommendedCountries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f3f4f6', borderRadius: '16px' }}>
            <p>No recommendations available for {currentMonth}</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {recommendedCountries.map((country, idx) => (
              <div
                key={idx}
                onClick={() => onSelectDestination && onSelectDestination(country.country)}
                style={{
                  cursor: 'pointer',
                  padding: '16px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  transition: 'transform 0.2s, boxShadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{country.country}</div>
                  <span style={{ fontSize: '24px' }}>{country.condition}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                  🌡️ {country.temp}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  📅 Best: {country.bestMonths}
                </div>
                <div style={{ fontSize: '12px', color: '#10b981', marginTop: '8px' }}>
                  ✨ Click to plan your trip →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherCountryAdvisor;