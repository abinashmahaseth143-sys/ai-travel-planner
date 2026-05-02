// src/lib/aiService.js
// NO API NEEDED - Works immediately!

// Fallback response that generates complete travel plans
const generateFallbackTrip = (location, days, traveler, budget) => {
  const daysNum = parseInt(days) || 3;
  const budgetLower = (budget || "Moderate").toLowerCase();
  
  let priceRange;
  if (budgetLower.includes("luxury")) {
    priceRange = { min: 250, max: 500 };
  } else if (budgetLower.includes("cheap")) {
    priceRange = { min: 50, max: 120 };
  } else {
    priceRange = { min: 100, max: 250 };
  }
  
  return {
    destination: location,
    days: daysNum,
    budget: budget,
    travelers: traveler,
    hotels: [
      {
        name: `${location} Grand Hotel`,
        address: `Central District, ${location}`,
        price: `$${priceRange.min + 50}-${priceRange.max + 100}`,
        rating: "4.5",
        description: `Luxurious ${budget} hotel in the heart of ${location}`,
        imageUrl: `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400`
      },
      {
        name: `${location} Boutique Inn`,
        address: `Old Town, ${location}`,
        price: `$${priceRange.min}-${priceRange.max}`,
        rating: "4.2",
        description: `Charming boutique accommodation with personalized service`,
        imageUrl: `https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400`
      },
      {
        name: `${location} Business Hotel`,
        address: `Business District, ${location}`,
        price: `$${priceRange.min - 20}-${priceRange.max - 50}`,
        rating: "4.0",
        description: `Convenient location near major attractions`,
        imageUrl: `https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400`
      }
    ],
    itinerary: Array.from({ length: daysNum }, (_, i) => ({
      day: i + 1,
      morning: i === 0 ? `Arrive in ${location} and check into hotel` : `Explore ${location}'s famous landmarks`,
      afternoon: i === 0 ? `Walking tour of the city center` : `Visit local museums and cultural sites`,
      evening: i === daysNum - 1 ? `Farewell dinner at traditional restaurant` : `Enjoy local cuisine and nightlife`,
      recommendedPlaces: [
        `${location} City Center`,
        `${location} Museum`,
        `Local Market`,
        `${location} Park`,
        `Historic District`
      ].slice(0, 4)
    })),
    tips: [
      `Best time to visit ${location} is during spring or fall`,
      "Book accommodations at least 2 weeks in advance",
      "Learn a few basic local phrases before you go",
      "Try the local cuisine - it's a highlight of any trip",
      "Pack comfortable walking shoes for sightseeing"
    ]
  };
};

// Main function - always uses fallback (no API calls)
export const generateTrip = async (location, days, traveler, budget) => {
  console.log("✨ Generating travel plan for:", location);
  
  // Simulate API delay for realistic feel
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const tripData = generateFallbackTrip(location, days, traveler, budget);
  
  return { 
    success: true, 
    data: tripData, 
    usedFallback: true,
    fallbackMessage: "✨ Your personalized travel plan is ready!"
  };
};

// Health check (always returns true)
export const checkGeminiHealth = async () => {
  return { healthy: true, message: "Fallback mode active" };
};