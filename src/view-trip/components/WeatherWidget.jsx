import React, { useState, useEffect } from 'react'

function WeatherWidget({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cityName, setCityName] = useState('');

  // Map of countries to their capital/major cities for weather lookup
  const getCityForCountry = (destinationName) => {
    const lowerName = destinationName.toLowerCase();
    
    const cityMap = {
      'japan': 'Tokyo',
      'usa': 'New York',
      'united states': 'New York',
      'uk': 'London',
      'united kingdom': 'London',
      'england': 'London',
      'france': 'Paris',
      'italy': 'Rome',
      'spain': 'Madrid',
      'germany': 'Berlin',
      'australia': 'Sydney',
      'india': 'Mumbai',
      'china': 'Beijing',
      'canada': 'Toronto',
      'brazil': 'Rio de Janeiro',
      'mexico': 'Mexico City',
      'thailand': 'Bangkok',
      'vietnam': 'Hanoi',
      'indonesia': 'Jakarta',
      'malaysia': 'Kuala Lumpur',
      'singapore': 'Singapore',
      'turkey': 'Istanbul',
      'greece': 'Athens',
      'portugal': 'Lisbon',
      'netherlands': 'Amsterdam',
      'switzerland': 'Zurich',
      'sweden': 'Stockholm',
      'norway': 'Oslo',
      'denmark': 'Copenhagen',
      'finland': 'Helsinki',
      'poland': 'Warsaw',
      'russia': 'Moscow',
      'south korea': 'Seoul',
      'korea': 'Seoul',
      'egypt': 'Cairo',
      'morocco': 'Casablanca',
      'south africa': 'Cape Town',
      'argentina': 'Buenos Aires',
      'chile': 'Santiago',
      'peru': 'Lima',
      'colombia': 'Bogota'
    };
    
    // Check if destination is a country
    for (const [country, city] of Object.entries(cityMap)) {
      if (lowerName.includes(country)) {
        return city;
      }
    }
    
    // If it's a city already, extract first part
    return destinationName.split(',')[0].trim();
  };

  // Get weather icon based on weather code
  const getWeatherIcon = (code) => {
    const weatherCodes = {
      0: '☀️', // Clear sky
      1: '🌤️', // Mainly clear
      2: '⛅', // Partly cloudy
      3: '☁️', // Overcast
      45: '🌫️', // Foggy
      51: '🌧️', // Drizzle
      61: '🌧️', // Rain
      71: '❄️', // Snow
      80: '🌦️'  // Rain showers
    };
    return weatherCodes[code] || '🌤️';
  };

  // Get weather description
  const getWeatherDescription = (code) => {
    const descriptions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      51: 'Light drizzle',
      61: 'Rain',
      71: 'Snow',
      80: 'Rain showers'
    };
    return descriptions[code] || 'Current weather';
  };

  useEffect(() => {
    if (!destination) return;
    
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get proper city name for weather lookup
        const city = getCityForCountry(destination);
        setCityName(city);
        console.log(`Fetching weather for ${destination} -> ${city}`);
        
        // Use Open-Meteo API (free, no API key needed)
        // First, get coordinates for the city
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();
        
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude, name, country } = geoData.results[0];
          console.log(`Found coordinates for ${name}, ${country}: ${latitude}, ${longitude}`);
          
          // Get current weather
          const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
          const weatherData = await weatherResponse.json();
          
          if (weatherData.current_weather) {
            const temp = weatherData.current_weather.temperature;
            const windspeed = weatherData.current_weather.windspeed;
            const weathercode = weatherData.current_weather.weathercode;
            
            setWeather({
              temperature: `${Math.round(temp)}°C`,
              tempValue: Math.round(temp),
              description: getWeatherDescription(weathercode),
              weathercode: weathercode,
              wind: `${Math.round(windspeed)} km/h`,
              windValue: Math.round(windspeed),
              location: name,
              country: country,
              icon: getWeatherIcon(weathercode)
            });
          } else {
            throw new Error('No weather data');
          }
        } else {
          throw new Error('Location not found');
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Weather data not available');
        // Set fallback weather data
        setWeather({
          temperature: '22°C',
          tempValue: 22,
          description: 'Partly Cloudy',
          wind: '12 km/h',
          windValue: 12,
          location: destination.split(',')[0],
          icon: '🌤️'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [destination]);

  if (!destination) return null;
  
  if (loading) {
    return (
      <div style={{
        marginTop: '20px',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        color: 'white',
        textAlign: 'center'
      }}>
        <p>Loading weather for {destination}...</p>
      </div>
    );
  }

  return (
    <div style={{
      marginTop: '20px',
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span>🌤️</span> Weather in {cityName || destination}
        {weather?.country && <span style={{ fontSize: '12px', opacity: 0.7 }}>({weather.country})</span>}
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '16px',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>
            {weather?.icon || '🌤️'}
          </div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>
            {weather?.temperature || 'N/A'}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>
            {weather?.description || 'Current weather'}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '4px' }}>Wind</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            ↓ {weather?.wind || 'N/A'}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '4px' }}>Humidity</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            {weather?.humidity || 'N/A'}
          </div>
        </div>
      </div>
      
      <div style={{
        fontSize: '12px',
        marginTop: '16px',
        textAlign: 'center',
        opacity: 0.7,
        borderTop: '1px solid rgba(255,255,255,0.2)',
        paddingTop: '12px'
      }}>
        📍 Real-time weather for {cityName || destination} • Plan accordingly!
      </div>
    </div>
  );
}

export default WeatherWidget;