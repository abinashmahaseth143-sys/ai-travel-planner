import React, { useState, useEffect } from 'react'

function WeatherCountryAdvisor({ destination, onSelectDestination }) {
  const [weatherAdvice, setWeatherAdvice] = useState(null);
  const [recommendedCountries, setRecommendedCountries] = useState([]);

  // Complete monthly temperature data for each country (average highs)
  const countryMonthlyTemp = {
    'France': {
      'Jan': '5-8°C', 'Feb': '6-10°C', 'Mar': '8-13°C', 'Apr': '13-18°C',
      'May': '17-22°C', 'Jun': '20-25°C', 'Jul': '22-27°C', 'Aug': '22-27°C',
      'Sep': '18-23°C', 'Oct': '13-18°C', 'Nov': '8-12°C', 'Dec': '5-9°C'
    },
    'Italy': {
      'Jan': '6-12°C', 'Feb': '7-13°C', 'Mar': '10-16°C', 'Apr': '13-19°C',
      'May': '17-23°C', 'Jun': '21-27°C', 'Jul': '24-30°C', 'Aug': '24-30°C',
      'Sep': '20-26°C', 'Oct': '15-21°C', 'Nov': '10-16°C', 'Dec': '7-13°C'
    },
    'Spain': {
      'Jan': '8-15°C', 'Feb': '9-16°C', 'Mar': '11-18°C', 'Apr': '13-20°C',
      'May': '16-23°C', 'Jun': '20-28°C', 'Jul': '23-31°C', 'Aug': '23-31°C',
      'Sep': '20-27°C', 'Oct': '16-22°C', 'Nov': '11-17°C', 'Dec': '9-15°C'
    },
    'Greece': {
      'Jan': '8-14°C', 'Feb': '8-15°C', 'Mar': '10-17°C', 'Apr': '13-20°C',
      'May': '17-24°C', 'Jun': '21-29°C', 'Jul': '24-32°C', 'Aug': '24-32°C',
      'Sep': '20-28°C', 'Oct': '16-23°C', 'Nov': '12-18°C', 'Dec': '9-15°C'
    },
    'Japan': {
      'Jan': '2-10°C', 'Feb': '3-11°C', 'Mar': '6-15°C', 'Apr': '11-20°C',
      'May': '16-24°C', 'Jun': '20-27°C', 'Jul': '24-30°C', 'Aug': '25-31°C',
      'Sep': '21-27°C', 'Oct': '15-22°C', 'Nov': '9-17°C', 'Dec': '4-12°C'
    },
    'Thailand': {
      'Jan': '22-32°C', 'Feb': '23-33°C', 'Mar': '24-34°C', 'Apr': '25-35°C',
      'May': '25-34°C', 'Jun': '25-33°C', 'Jul': '24-32°C', 'Aug': '24-32°C',
      'Sep': '24-32°C', 'Oct': '24-32°C', 'Nov': '23-31°C', 'Dec': '22-30°C'
    },
    'Turkey': {
      'Jan': '4-10°C', 'Feb': '5-11°C', 'Mar': '7-14°C', 'Apr': '11-18°C',
      'May': '15-23°C', 'Jun': '19-28°C', 'Jul': '22-31°C', 'Aug': '22-31°C',
      'Sep': '18-27°C', 'Oct': '14-21°C', 'Nov': '9-15°C', 'Dec': '6-11°C'
    },
    'Vietnam': {
      'Jan': '20-25°C', 'Feb': '21-27°C', 'Mar': '23-30°C', 'Apr': '25-33°C',
      'May': '26-34°C', 'Jun': '26-34°C', 'Jul': '25-33°C', 'Aug': '25-33°C',
      'Sep': '24-31°C', 'Oct': '23-30°C', 'Nov': '22-28°C', 'Dec': '20-26°C'
    },
    'Morocco': {
      'Jan': '9-18°C', 'Feb': '10-19°C', 'Mar': '12-21°C', 'Apr': '14-23°C',
      'May': '17-26°C', 'Jun': '20-29°C', 'Jul': '22-33°C', 'Aug': '22-33°C',
      'Sep': '20-30°C', 'Oct': '17-26°C', 'Nov': '13-21°C', 'Dec': '10-19°C'
    },
    'Switzerland': {
      'Jan': '-2-4°C', 'Feb': '-1-5°C', 'Mar': '2-9°C', 'Apr': '5-13°C',
      'May': '9-18°C', 'Jun': '12-21°C', 'Jul': '14-24°C', 'Aug': '14-23°C',
      'Sep': '11-19°C', 'Oct': '7-14°C', 'Nov': '2-8°C', 'Dec': '-1-4°C'
    },
    'UK': {
      'Jan': '4-8°C', 'Feb': '4-9°C', 'Mar': '6-11°C', 'Apr': '8-14°C',
      'May': '11-17°C', 'Jun': '14-20°C', 'Jul': '16-22°C', 'Aug': '16-22°C',
      'Sep': '13-18°C', 'Oct': '10-15°C', 'Nov': '7-11°C', 'Dec': '5-9°C'
    },
    'Germany': {
      'Jan': '0-4°C', 'Feb': '1-6°C', 'Mar': '4-10°C', 'Apr': '8-15°C',
      'May': '12-19°C', 'Jun': '15-22°C', 'Jul': '17-24°C', 'Aug': '17-24°C',
      'Sep': '13-19°C', 'Oct': '9-14°C', 'Nov': '4-9°C', 'Dec': '1-5°C'
    },
    'Portugal': {
      'Jan': '11-15°C', 'Feb': '11-16°C', 'Mar': '13-18°C', 'Apr': '15-20°C',
      'May': '17-22°C', 'Jun': '20-26°C', 'Jul': '22-28°C', 'Aug': '22-28°C',
      'Sep': '20-26°C', 'Oct': '17-22°C', 'Nov': '14-18°C', 'Dec': '12-16°C'
    },
    'Croatia': {
      'Jan': '6-10°C', 'Feb': '7-11°C', 'Mar': '9-14°C', 'Apr': '12-17°C',
      'May': '16-22°C', 'Jun': '20-26°C', 'Jul': '23-29°C', 'Aug': '23-29°C',
      'Sep': '19-24°C', 'Oct': '15-20°C', 'Nov': '11-15°C', 'Dec': '8-12°C'
    },
    'Egypt': {
      'Jan': '14-22°C', 'Feb': '15-24°C', 'Mar': '18-27°C', 'Apr': '21-31°C',
      'May': '24-34°C', 'Jun': '27-36°C', 'Jul': '28-37°C', 'Aug': '28-37°C',
      'Sep': '26-34°C', 'Oct': '23-31°C', 'Nov': '19-27°C', 'Dec': '15-23°C'
    }
  };

  const getCurrentMonth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[new Date().getMonth()];
  };

  const getBestMonthsForCountry = (countryName) => {
    // Define best months for each country
    const bestMonthsMap = {
      'France': 'Apr-Jun, Sep-Oct',
      'Italy': 'Apr-Jun, Sep-Oct',
      'Spain': 'May-Sep',
      'Greece': 'Apr-Oct',
      'Japan': 'Mar-May, Sep-Nov',
      'Thailand': 'Nov-Mar',
      'Turkey': 'Apr-Oct',
      'Vietnam': 'Nov-Apr',
      'Morocco': 'Mar-May, Sep-Nov',
      'Switzerland': 'Jun-Sep',
      'UK': 'May-Sep',
      'Germany': 'May-Sep',
      'Portugal': 'May-Sep',
      'Croatia': 'May-Sep',
      'Egypt': 'Oct-Apr'
    };
    return bestMonthsMap[countryName] || 'Apr-Oct';
  };

  const getConditionForCountry = (countryName) => {
    const conditions = {
      'Thailand': 'sunny', 'Spain': 'sunny', 'Greece': 'sunny', 'Japan': 'mild',
      'France': 'mild', 'Italy': 'sunny', 'UK': 'mild', 'Morocco': 'sunny',
      'Vietnam': 'sunny', 'Switzerland': 'cold', 'Turkey': 'sunny',
      'Germany': 'mild', 'Portugal': 'sunny', 'Croatia': 'sunny', 'Egypt': 'sunny'
    };
    return conditions[countryName] || 'mild';
  };

  const getWarningForCountry = (countryName) => {
    const warnings = {
      'Thailand': 'Avoid Apr-May (hottest)',
      'Spain': 'Avoid Aug (too crowded)',
      'Greece': 'Avoid Jul-Aug (very crowded)',
      'Japan': 'Avoid Aug (humid, typhoons)',
      'France': 'Avoid Aug (many closures)',
      'Italy': 'Jul-Aug is very hot',
      'Morocco': 'Jul-Aug extremely hot',
      'Vietnam': 'May-Oct rainy season'
    };
    return warnings[countryName] || 'Check local conditions';
  };

  const getWeatherAdviceForDestination = (destinationName) => {
    if (!destinationName) return null;
    
    const currentMonth = getCurrentMonth();
    const monthlyTemp = countryMonthlyTemp[destinationName]?.[currentMonth];
    const bestMonths = getBestMonthsForCountry(destinationName);
    const condition = getConditionForCountry(destinationName);
    const warning = getWarningForCountry(destinationName);
    
    // Check if current month is in best months
    const isGoodTime = bestMonths.includes(currentMonth);
    
    return {
      country: destinationName,
      temp: monthlyTemp || '15-25°C',
      condition: condition,
      bestMonths: bestMonths,
      warning: warning,
      currentMonth,
      isGoodTime,
      recommendation: isGoodTime ? '✅ GOOD TIME TO VISIT' : '⚠️ NOT IDEAL TIME',
      advice: isGoodTime ? 
        `Great time to visit ${destinationName}! ${condition} weather, ${monthlyTemp || 'pleasant temperatures'}. ${warning}` :
        `Not the best time for ${destinationName}. ${warning}. Best months: ${bestMonths}`
    };
  };

  const getRandomRecommendations = () => {
    const countries = Object.keys(countryMonthlyTemp);
    const shuffled = [...countries];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 8).map(country => getWeatherAdviceForDestination(country)).filter(c => c !== null);
  };

  useEffect(() => {
    setRecommendedCountries(getRandomRecommendations());
  }, []);

  useEffect(() => {
    if (destination) {
      // Find matching country
      let matchedCountry = null;
      for (const country of Object.keys(countryMonthlyTemp)) {
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
            🌡️ {weatherAdvice.temp} • {weatherAdvice.condition === 'sunny' ? '☀️' : weatherAdvice.condition === 'cold' ? '❄️' : '🌤️'}
          </div>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          🌍 Best Countries to Visit in {currentMonth}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
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
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{country.country}</div>
                <span style={{ fontSize: '24px' }}>
                  {country.condition === 'sunny' ? '☀️' : country.condition === 'cold' ? '❄️' : '🌤️'}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                🌡️ {country.temp} (Expected in {currentMonth})
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                📅 Best: {country.bestMonths}
              </div>
              <div style={{ fontSize: '12px', color: '#10b981' }}>✨ Click to plan →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeatherCountryAdvisor;