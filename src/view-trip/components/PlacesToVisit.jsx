import React, { useState, useEffect } from 'react'
import PlaceCardItem from './PlaceCardItem'
import { SearchAttractions, GetAttractionPhoto } from '../../service/GlobalApi'

const formatRating = (rating) => {
  if (typeof rating === 'number') return rating.toFixed(1);
  if (typeof rating === 'string') {
    const num = parseFloat(rating);
    return isNaN(num) ? "4.5" : num.toFixed(1);
  }
  return "4.5";
};

function PlacesToVisit({ trip }) {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getDestination = () => {
    if (!trip?.userSelection?.location) return "USA";
    const location = trip.userSelection.location;
    if (typeof location === 'string') return location;
    return location.label || location.description || "USA";
  };

  const numberOfDays = parseInt(trip?.userSelection?.days) || 3;

  const categories = [
    { id: "all", name: "All", icon: "🌍" },
    { id: "museum", name: "Museums", icon: "🏛️" },
    { id: "national_park", name: "National Parks", icon: "🏞️" },
    { id: "landmark", name: "Landmarks", icon: "🗽" },
    { id: "cultural", name: "Cultural Sites", icon: "🎭" },
    { id: "nature", name: "Nature", icon: "🌲" },
    { id: "entertainment", name: "Entertainment", icon: "🎡" },
    { id: "beach", name: "Beaches", icon: "🏖️" },
    { id: "shopping", name: "Shopping", icon: "🛍️" },
    { id: "restaurant", name: "Famous Restaurants", icon: "🍽️" },
    { id: "nightlife", name: "Nightlife", icon: "🌙" },
    { id: "zoo", name: "Zoos", icon: "🐘" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "cinema", name: "Cinemas", icon: "🎬" }
  ];

  const handlePlaceClick = (place) => {
    const searchQuery = encodeURIComponent(`${place.placeName}, ${place.address || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  const getPriceDisplay = (place) => {
    const priceLevel = place.priceLevel;
    if (priceLevel !== undefined && priceLevel !== null) {
      switch(priceLevel) {
        case 0: return 'Free';
        case 1: return '$';
        case 2: return '$$';
        case 3: return '$$$';
        case 4: return '$$$$';
        default: return 'Check website';
      }
    }
    return '$$';
  };

  // ✅ ITINERARY GENERATION WITH PROPER LIMITS
  const generateItinerary = () => {
    let availableAttractions = [...filteredAttractions];
    const daysNum = numberOfDays;
    
    let maxPerDay = daysNum === 1 ? 5 : daysNum <= 3 ? 4 : 3;
    const maxTotal = daysNum * maxPerDay;
    
    if (availableAttractions.length > maxTotal) {
      availableAttractions = availableAttractions.slice(0, maxTotal);
    }
    
    const itinerary = [];
    let index = 0;
    for (let day = 1; day <= daysNum; day++) {
      const dayAttractions = [];
      for (let i = 0; i < maxPerDay && index < availableAttractions.length; i++) {
        dayAttractions.push(availableAttractions[index]);
        index++;
      }
      if (dayAttractions.length > 0) {
        itinerary.push({ day, places: dayAttractions, count: dayAttractions.length });
      }
    }
    
    return { itinerary, totalShown: index };
  };

  useEffect(() => {
    const fetchAllAttractions = async () => {
      const destination = getDestination();
      if (!destination) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const allResults = [];
      
      for (const category of categories) {
        if (category.id === "all") continue;
        try {
          const searchQuery = `${category.name} in ${destination}`;
          const response = await SearchAttractions(searchQuery);
          if (response && response.length > 0) {
            const formattedResults = response.slice(0, 2).map((place) => ({
              ...place,
              category: category.id,
              categoryName: category.name,
              categoryIcon: category.icon
            }));
            allResults.push(...formattedResults);
          }
        } catch (error) {
          console.error(`Error fetching ${category.name}:`, error);
        }
      }
      
      const generalResponse = await SearchAttractions(`best tourist attractions in ${destination}`);
      const generalResults = generalResponse.slice(0, 3).map((place) => ({
        ...place,
        category: "top",
        categoryName: "Must-See",
        categoryIcon: "⭐"
      }));
      allResults.push(...generalResults);
      
      const uniqueResults = [];
      const seenNames = new Set();
      for (const place of allResults) {
        const name = place.displayName?.text;
        if (name && !seenNames.has(name)) {
          seenNames.add(name);
          uniqueResults.push(place);
        }
      }
      
      const formattedAttractions = uniqueResults.map((place, index) => {
        const photoName = place.photos?.[0]?.name;
        const timeSlots = [
          "9:00 AM - 12:00 PM", "10:00 AM - 1:00 PM", "11:00 AM - 2:00 PM",
          "1:00 PM - 4:00 PM", "2:00 PM - 5:00 PM", "3:00 PM - 6:00 PM"
        ];
        const travelTimes = ["10 min", "15 min", "20 min", "25 min", "30 min"];
        const ratingNumber = place.rating !== undefined && place.rating !== null ? parseFloat(place.rating) : 4.5;
        const reviewCountNumber = place.userRatingCount !== undefined && place.userRatingCount !== null ? parseInt(place.userRatingCount) : 0;
        
        return {
          id: index + 1,
          placeName: place.displayName?.text || "Attraction",
          category: place.category || "attraction",
          categoryName: place.categoryName || "Attraction",
          categoryIcon: place.categoryIcon || "📍",
          address: place.formattedAddress || "",
          time: timeSlots[Math.floor(Math.random() * timeSlots.length)],
          timeToTravel: travelTimes[Math.floor(Math.random() * travelTimes.length)],
          description: place.editorialSummary?.text || place.displayName?.text || "Popular attraction",
          ticketPricing: getPriceDisplay(place),
          rating: formatRating(ratingNumber),
          reviewCount: reviewCountNumber,
          placeImageUrl: photoName ? GetAttractionPhoto(photoName, 500, 300) : null
        };
      });
      
      const sortedByRating = [...formattedAttractions].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
      setAttractions(sortedByRating);
      setLoading(false);
    };
    
    fetchAllAttractions();
  }, [trip?.userSelection?.location]);

  const filteredAttractions = selectedCategory === "all" 
    ? attractions 
    : attractions.filter(place => place.category === selectedCategory);

  const destinationName = getDestination();

  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") return attractions.length;
    return attractions.filter(place => place.category === categoryId).length;
  };

  if (loading) {
    return (
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '16px', color: '#64748b' }}>Loading real attractions from Google Places...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (attractions.length === 0) {
    return (
      <div style={{ marginTop: '40px', textAlign: 'center', padding: '40px' }}>
        <span style={{ fontSize: '48px' }}>🗺️</span>
        <h3 style={{ marginTop: '16px', color: '#1f2937' }}>No attractions found</h3>
        <p style={{ color: '#6b7280', marginTop: '8px' }}>Try searching for a different destination or adjust your search.</p>
      </div>
    );
  }

  const { itinerary, totalShown } = generateItinerary();

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            🗺️ Places to Visit in {destinationName}
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            {numberOfDays} Day{numberOfDays > 1 ? 's' : ''} • {totalShown} recommended attractions
          </p>
        </div>
      </div>
      
      <div style={{ overflowX: 'auto', overflowY: 'visible', WebkitOverflowScrolling: 'touch', marginBottom: '24px', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '10px', minWidth: 'min-content' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '40px',
                backgroundColor: selectedCategory === cat.id ? '#667eea' : '#f1f5f9',
                color: selectedCategory === cat.id ? 'white' : '#475569',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: selectedCategory === cat.id ? '600' : '500',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span style={{ fontSize: '11px', backgroundColor: selectedCategory === cat.id ? 'rgba(255,255,255,0.2)' : '#e2e8f0', padding: '2px 6px', borderRadius: '20px' }}>
                {getCategoryCount(cat.id)}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {itinerary.map((day, index) => (
          <div key={index} style={{ borderRadius: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                  {day.day}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>Day {day.day}</h3>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{day.places.length} {day.places.length === 1 ? 'place' : 'places'}</p>
                </div>
              </div>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {day.places.map((place, placeIndex) => (
                <PlaceCardItem key={placeIndex} place={place} onClick={handlePlaceClick} />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {attractions.length > 0 && (
        <div style={{ marginTop: '32px', padding: '20px', backgroundColor: '#fef9c3', borderRadius: '16px', border: '1px solid #fde047', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#854d0e', marginBottom: '12px' }}>
            ✨ {attractions.length} diverse attractions found including:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
            {categories.filter(c => c.id !== "all" && getCategoryCount(c.id) > 0).slice(0, 10).map(cat => (
              <span key={cat.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                {cat.icon} {cat.name} ({getCategoryCount(cat.id)})
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: '#9ca3af' }}>
        📍 Real attractions from Google Places API • Click any place for directions
      </div>
    </div>
  );
}

export default PlacesToVisit;