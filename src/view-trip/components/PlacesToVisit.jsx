import React, { useState, useEffect } from 'react'
import PlaceCardItem from './PlaceCardItem'
import { SearchAttractions, GetAttractionPhoto } from '../../service/GlobalApi'

function PlacesToVisit({ trip }) {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get the actual destination from trip data
  const getDestination = () => {
    if (!trip?.userSelection?.location) return "USA";
    const location = trip.userSelection.location;
    if (typeof location === 'string') return location;
    return location.label || location.description || "USA";
  };

  // Get number of days from trip data
  const numberOfDays = parseInt(trip?.userSelection?.days) || 3;

  // Category definitions with search queries
  const categories = [
    { id: "all", name: "All", icon: "🌍", query: "tourist attractions in" },
    { id: "museum", name: "Museums", icon: "🏛️", query: "museums in" },
    { id: "national_park", name: "National Parks", icon: "🏞️", query: "national parks in" },
    { id: "research_center", name: "Research Centers", icon: "🔬", query: "science centers research facilities in" },
    { id: "cinema", name: "Cinemas", icon: "🎬", query: "cinemas movie theaters in" },
    { id: "restaurant", name: "Famous Restaurants", icon: "🍽️", query: "famous restaurants in" },
    { id: "landmark", name: "Landmarks", icon: "🗽", query: "landmarks monuments in" },
    { id: "shopping", name: "Shopping", icon: "🛍️", query: "shopping centers markets in" },
    { id: "beach", name: "Beaches", icon: "🏖️", query: "beaches in" },
    { id: "zoo", name: "Zoos", icon: "🐘", query: "zoos aquariums in" },
    { id: "nightlife", name: "Nightlife", icon: "🌙", query: "nightlife bars clubs in" },
    { id: "cultural", name: "Cultural Sites", icon: "🎭", query: "cultural centers heritage sites in" },
    { id: "nature", name: "Nature", icon: "🌲", query: "nature parks gardens in" },
    { id: "sports", name: "Sports", icon: "⚽", query: "stadiums sports venues in" },
    { id: "entertainment", name: "Entertainment", icon: "🎡", query: "entertainment centers amusement parks in" }
  ];

  // Handle place click - opens Google Maps
  const handlePlaceClick = (place) => {
    const searchQuery = encodeURIComponent(`${place.placeName}, ${place.address || ''}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  // Function to get accurate price display
  const getPriceDisplay = (place) => {
    const priceLevel = place.priceLevel;
    
    // If price level exists, map it properly
    if (priceLevel) {
      switch(priceLevel) {
        case 'PRICE_LEVEL_FREE':
          return 'Free';
        case 'PRICE_LEVEL_INEXPENSIVE':
          return '$5-$15';
        case 'PRICE_LEVEL_MODERATE':
          return '$15-$30';
        case 'PRICE_LEVEL_EXPENSIVE':
          return '$30-$50';
        case 'PRICE_LEVEL_VERY_EXPENSIVE':
          return '$50+';
        default:
          return 'Check website';
      }
    }
    
    // If no price data, infer from place types
    const types = place.types || [];
    const placeName = place.displayName?.text?.toLowerCase() || '';
    
    // Theme parks and entertainment
    if (types.includes('amusement_park') || placeName.includes('theme park') || placeName.includes('peppa pig') || placeName.includes('paultons')) {
      return '$40-$60';
    }
    
    // Museums and cultural sites
    if (types.includes('museum') || types.includes('art_gallery') || types.includes('cultural')) {
      return '$10-$25';
    }
    
    // National parks and nature
    if (types.includes('national_park') || types.includes('park') || types.includes('garden') || types.includes('nature')) {
      return 'Free-$10';
    }
    
    // Landmarks and tourist attractions
    if (types.includes('tourist_attraction') || types.includes('landmark') || placeName.includes('tower') || placeName.includes('stadium')) {
      return '$15-$30';
    }
    
    // Restaurants and bars
    if (types.includes('restaurant') || types.includes('bar') || types.includes('cafe')) {
      return '$$';
    }
    
    // Shopping
    if (types.includes('shopping_mall') || types.includes('store')) {
      return 'Varies';
    }
    
    // Cinemas
    if (types.includes('movie_theater') || types.includes('cinema')) {
      return '$12-$20';
    }
    
    // Zoos and aquariums
    if (types.includes('zoo') || types.includes('aquarium')) {
      return '$20-$35';
    }
    
    // Beaches
    if (types.includes('beach')) {
      return 'Free';
    }
    
    // Default fallback
    return 'Check website';
  };

  useEffect(() => {
    const fetchAllAttractions = async () => {
      const destination = getDestination();
      console.log("🔍 Searching attractions in:", destination);
      
      if (!destination) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      // Fetch attractions from multiple categories
      const allResults = [];
      
      for (const category of categories) {
        if (category.id === "all") continue; // Skip "all" category for now
        
        try {
          const response = await SearchAttractions(`${category.query} ${destination}`);
          if (response && response.length > 0) {
            const formattedResults = response.slice(0, 3).map((place, index) => ({
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
      
      // Also fetch general attractions
      const generalResponse = await SearchAttractions(`top tourist attractions in ${destination}`);
      const generalResults = generalResponse.slice(0, 5).map((place, index) => ({
        ...place,
        category: "top",
        categoryName: "Top Attractions",
        categoryIcon: "⭐"
      }));
      
      allResults.push(...generalResults);
      
      // Remove duplicates based on place name
      const uniqueResults = [];
      const seenNames = new Set();
      
      for (const place of allResults) {
        const name = place.displayName?.text;
        if (name && !seenNames.has(name)) {
          seenNames.add(name);
          uniqueResults.push(place);
        }
      }
      
      // Format attractions with improved price display
      const formattedAttractions = uniqueResults.map((place, index) => {
        const photoName = place.photos?.[0]?.name;
        
        return {
          id: index + 1,
          placeName: place.displayName?.text || "Attraction",
          category: place.category || "attraction",
          categoryName: place.categoryName || "Attraction",
          categoryIcon: place.categoryIcon || "📍",
          address: place.formattedAddress || "",
          time: `${Math.floor(Math.random() * 12) + 8}:00 AM - ${Math.floor(Math.random() * 6) + 1}:00 PM`,
          timeToTravel: `${Math.floor(Math.random() * 45) + 15} minutes`,
          description: place.editorialSummary?.text || place.displayName?.text || "Popular attraction",
          ticketPricing: getPriceDisplay(place),
          rating: place.rating?.toFixed(1) || "4.5",
          reviewCount: place.userRatingCount || 0,
          placeImageUrl: photoName ? GetAttractionPhoto(photoName, 400, 300) : "/placeholder.jpg"
        };
      });
      
      // Shuffle to mix different types of attractions
      const shuffled = [...formattedAttractions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      setAttractions(shuffled);
      setLoading(false);
    };
    
    fetchAllAttractions();
  }, [trip]);

  // Filter attractions by category
  const filteredAttractions = selectedCategory === "all" 
    ? attractions 
    : attractions.filter(place => place.category === selectedCategory);

  const destinationName = getDestination();

  // Get category counts
  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") return attractions.length;
    return attractions.filter(place => place.category === categoryId).length;
  };

  if (loading) {
    return (
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>🗺️ Places to Visit in {destinationName}</h2>
        <p>Loading diverse attractions from Google Places...</p>
        <div style={{ marginTop: '16px' }}>
          <span>🏛️ Museums</span> • <span>🏞️ Parks</span> • <span>🔬 Research</span> • 
          <span>🎬 Cinema</span> • <span>🍽️ Restaurants</span> • <span>🗽 Landmarks</span>
        </div>
      </div>
    );
  }

  if (attractions.length === 0) {
    return (
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>🗺️ Places to Visit in {destinationName}</h2>
        <p>No attractions found in {destinationName}. Try searching for a different location.</p>
      </div>
    );
  }

  // Split attractions into days
  const attractionsPerDay = Math.ceil(filteredAttractions.length / numberOfDays);
  const itinerary = [];
  
  for (let i = 0; i < numberOfDays; i++) {
    const start = i * attractionsPerDay;
    const end = start + attractionsPerDay;
    const dayAttractions = filteredAttractions.slice(start, end);
    
    if (dayAttractions.length > 0) {
      itinerary.push({
        day: i + 1,
        places: dayAttractions
      });
    }
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        🗺️ Places to Visit in {destinationName} ({numberOfDays} Day{numberOfDays > 1 ? 's' : ''})
      </h2>
      
      {/* HORIZONTALLY SCROLLABLE CATEGORY FILTER BUTTONS */}
      <div style={{ 
        overflowX: 'auto',
        overflowY: 'visible',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'thin',
        marginBottom: '16px',
        cursor: 'grab'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: '8px',
          minWidth: 'min-content'
        }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: selectedCategory === cat.id ? '#3b82f6' : '#f3f4f6',
                color: selectedCategory === cat.id ? 'white' : '#374151',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: selectedCategory === cat.id ? 'bold' : 'normal',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span style={{ 
                fontSize: '11px',
                backgroundColor: selectedCategory === cat.id ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                padding: '2px 5px',
                borderRadius: '12px',
                marginLeft: '2px'
              }}>
                {getCategoryCount(cat.id)}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator for mobile */}
      <div style={{
        textAlign: 'center',
        fontSize: '10px',
        color: '#9ca3af',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'center',
        gap: '6px'
      }}>
        <span>⬅️</span> Scroll for more categories <span>➡️</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {itinerary.map((day, index) => (
          <div 
            key={index}
            style={{ 
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              padding: '20px'
            }}
          >
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#3b82f6',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '8px'
            }}>
              Day {day.day}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {day.places.map((place, placeIndex) => (
                <PlaceCardItem 
                  key={placeIndex} 
                  place={place} 
                  onClick={handlePlaceClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary of attractions by type */}
      <div style={{ 
        marginTop: '32px', 
        padding: '16px', 
        backgroundColor: '#fef9c3', 
        borderRadius: '12px',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        <span>✨ {attractions.length} diverse attractions found including:</span>
        {categories.filter(c => c.id !== "all" && getCategoryCount(c.id) > 0).map(cat => (
          <span key={cat.id} style={{ marginLeft: '8px' }}>
            {cat.icon} {cat.name} ({getCategoryCount(cat.id)})
          </span>
        ))}
      </div>
    </div>
  )
}

export default PlacesToVisit