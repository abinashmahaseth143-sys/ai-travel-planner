// src/lib/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

// Check if API key exists
if (!apiKey) {
  console.error("❌ VITE_GOOGLE_GEMINI_AI_API_KEY is missing! Please add it to your .env file");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// ✅ CORRECTED: Use ONLY currently available Gemini models (as of 2024-2025)
const MODELS = [
  "gemini-1.5-pro",      // ✅ Most capable
  "gemini-1.5-flash",    // ✅ Fast and efficient
  "gemini-2.0-flash-exp" // ✅ Latest experimental (if available)
];

// Define the expected JSON schema for better responses
const JSON_SCHEMA = {
  destination: "string",
  days: "number",
  budget: "string",
  travelers: "string",
  hotels: [
    {
      name: "string",
      address: "string",
      price: "string",
      rating: "string",
      description: "string",
      imageUrl: "string"
    }
  ],
  itinerary: [
    {
      day: "number",
      morning: "string",
      afternoon: "string",
      evening: "string",
      recommendedPlaces: ["string"]
    }
  ],
  tips: ["string"]
};

// Fallback response templates - IMPROVED to match component expectations
const FALLBACK_RESPONSES = {
  generic: (location, days, traveler, budget) => {
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
          description: `Luxurious ${budget} hotel in the heart of ${location} with excellent amenities.`,
          imageUrl: `https://source.unsplash.com/featured/?hotel,${encodeURIComponent(location)}`
        },
        {
          name: `${location} Boutique Inn`,
          address: `Old Town, ${location}`,
          price: `$${priceRange.min}-${priceRange.max}`,
          rating: "4.2",
          description: `Charming boutique accommodation with personalized service.`,
          imageUrl: `https://source.unsplash.com/featured/?boutique,hotel,${encodeURIComponent(location)}`
        },
        {
          name: `${location} Business Hotel`,
          address: `Business District, ${location}`,
          price: `$${priceRange.min - 20}-${priceRange.max - 50}`,
          rating: "4.0",
          description: `Convenient location near major attractions and transport.`,
          imageUrl: `https://source.unsplash.com/featured/?hotel,room,${encodeURIComponent(location)}`
        }
      ],
      itinerary: Array.from({ length: Math.min(daysNum, 7) }, (_, i) => ({
        day: i + 1,
        morning: i === 0 ? `Arrive in ${location} and check into hotel` : `Explore ${location}'s famous landmarks`,
        afternoon: i === 0 ? `Walking tour of the city center` : `Visit local museums and cultural sites`,
        evening: i === daysNum - 1 ? `Farewell dinner at traditional restaurant` : `Enjoy local cuisine and nightlife`,
        recommendedPlaces: [
          `${location} City Center`,
          `${location} Museum`,
          `Local Market District`,
          `${location} Park`,
          `Historic Old Town`
        ].slice(0, 3 + i)
      })),
      tips: [
        `Best time to visit ${location} is during spring or fall`,
        "Book accommodations at least 2 weeks in advance",
        "Learn a few basic local phrases before you go",
        "Try the local cuisine - it's a highlight of any trip",
        "Pack comfortable walking shoes for sightseeing",
        "Check local events calendar before planning your dates"
      ]
    };
  }
};

// Validate response structure
const validateResponse = (data, location, days) => {
  if (!data) return false;
  
  // Check required fields
  if (!data.destination && !data.location) return false;
  if (!data.itinerary || !Array.isArray(data.itinerary) || data.itinerary.length === 0) return false;
  
  // Ensure days match
  const expectedDays = parseInt(days);
  if (data.itinerary.length !== expectedDays && data.itinerary.length < expectedDays) {
    // Pad itinerary if needed
    const lastDay = data.itinerary[data.itinerary.length - 1];
    while (data.itinerary.length < expectedDays) {
      data.itinerary.push({
        ...lastDay,
        day: data.itinerary.length + 1
      });
    }
  }
  
  return true;
};

// Try multiple models with retry logic
const callGeminiWithRetry = async (prompt, retryCount = 0) => {
  if (!genAI) {
    throw new Error("Gemini API not initialized - missing API key");
  }
  
  for (let i = 0; i < MODELS.length; i++) {
    try {
      console.log(`Attempting with model: ${MODELS[i]}`);
      const model = genAI.getGenerativeModel({ model: MODELS[i] });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text || text.length < 50) {
        throw new Error("Response too short");
      }
      
      // Try to extract JSON from response
      let cleanJson = text;
      
      // Remove markdown code blocks
      cleanJson = cleanJson.replace(/```json\n?/g, '');
      cleanJson = cleanJson.replace(/```\n?/g, '');
      cleanJson = cleanJson.replace(/`/g, '');
      
      // Find JSON object in text if there's extra content
      const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanJson = jsonMatch[0];
      }
      
      const parsed = JSON.parse(cleanJson);
      
      console.log(`Success with model: ${MODELS[i]}`);
      return parsed;
    } catch (error) {
      console.warn(`Model ${MODELS[i]} failed:`, error.message);
      if (i === MODELS.length - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error("All models failed");
};

// Main function to generate trip
export const generateTrip = async (location, days, traveler, budget, retryCount = 0) => {
  const maxRetries = 2;
  
  // Validate inputs
  if (!location || location.trim() === "") {
    console.warn("No location provided, using fallback");
    const fallbackData = FALLBACK_RESPONSES.generic("Paris", days, traveler, budget);
    return { success: true, data: fallbackData, usedFallback: true, fallbackMessage: "Using smart suggestions" };
  }
  
  const daysNum = parseInt(days) || 3;
  
  // IMPROVED PROMPT with clear JSON structure example
  const prompt = `You are a travel planning AI. Generate a complete travel plan for ${location} for ${daysNum} days.

Traveler type: ${traveler}
Budget level: ${budget}

Return ONLY valid JSON in this exact format (no markdown, no extra text):

{
  "destination": "${location}",
  "days": ${daysNum},
  "budget": "${budget}",
  "travelers": "${traveler}",
  "hotels": [
    {
      "name": "Hotel Name",
      "address": "Full address",
      "price": "$100-200 per night",
      "rating": "4.5",
      "description": "Brief description of the hotel",
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "morning": "Morning activity description",
      "afternoon": "Afternoon activity description",
      "evening": "Evening activity description",
      "recommendedPlaces": ["Place 1", "Place 2", "Place 3"]
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
}

Make sure:
1. Hotels have realistic names and addresses in ${location}
2. Itinerary has exactly ${daysNum} days
3. Activities are specific to ${location}
4. All prices are in USD
5. Include 3-5 helpful travel tips

Generate realistic, specific content for ${location}.`;

  try {
    // Skip API call if no API key
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
      console.warn("No API key found, using fallback");
      throw new Error("No API key configured");
    }
    
    const data = await callGeminiWithRetry(prompt);
    
    // Validate the response
    if (!validateResponse(data, location, daysNum)) {
      console.warn("Invalid response structure, using fallback");
      throw new Error("Invalid response structure");
    }
    
    return { success: true, data: data, usedFallback: false };
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    if (retryCount < maxRetries) {
      const waitTime = Math.pow(2, retryCount) * 2000;
      console.log(`Retrying in ${waitTime}ms... (Attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return generateTrip(location, days, traveler, budget, retryCount + 1);
    }
    
    console.warn("Using fallback response for:", location);
    const fallbackData = FALLBACK_RESPONSES.generic(location, daysNum, traveler, budget);
    return { 
      success: true, 
      data: fallbackData, 
      usedFallback: true,
      fallbackMessage: "✨ Using smart suggestions (AI service is currently busy)"
    };
  }
};

// Helper function to check API health
export const checkGeminiHealth = async () => {
  if (!apiKey || !genAI) {
    return { healthy: false, error: "No API key configured" };
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say 'OK'");
    const response = await result.response;
    const text = response.text();
    return { healthy: true, response: text };
  } catch (error) {
    console.error("Health check failed:", error);
    return { healthy: false, error: error.message };
  }
};