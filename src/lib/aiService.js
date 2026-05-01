// src/lib/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ CORRECTED: Use ONLY available Gemini models
const MODELS = [
  "gemini-1.5-pro",     // ✅ Most capable, widely available
  "gemini-1.5-flash",   // ✅ Fast model
  "gemini-1.0-pro"      // ✅ Legacy fallback
];

// Fallback response templates
const FALLBACK_RESPONSES = {
  generic: (location, days, traveler, budget) => ({
    destination: location,
    days: days,
    budget: budget,
    travelers: traveler,
    hotels: [
      {
        name: `${location} Grand Hotel`,
        address: `Central District, ${location}`,
        price: budget === "Luxury" ? "$300-500" : budget === "Moderate" ? "$150-250" : "$80-120",
        rating: "4.5",
        description: `Popular hotel in the heart of ${location}`
      },
      {
        name: `${location} Boutique Inn`,
        address: `Old Town, ${location}`,
        price: budget === "Luxury" ? "$250-400" : budget === "Moderate" ? "$120-200" : "$60-90",
        rating: "4.2",
        description: `Cozy accommodation with great reviews`
      },
      {
        name: `${location} Business Hotel`,
        address: `Business District, ${location}`,
        price: budget === "Luxury" ? "$200-350" : budget === "Moderate" ? "$100-180" : "$50-80",
        rating: "4.0",
        description: `Convenient location near main attractions`
      }
    ],
    itinerary: Array.from({ length: parseInt(days) }, (_, i) => ({
      day: i + 1,
      morning: "Visit main attractions and landmarks",
      afternoon: "Explore local culture and cuisine",
      evening: "Enjoy entertainment and nightlife",
      recommendedPlaces: [
        `${location} City Center`,
        `${location} Museum`,
        `Local Market`
      ]
    })),
    tips: [
      "Book accommodations in advance",
      "Check local weather before packing",
      "Learn a few local phrases",
      "Try local cuisine"
    ]
  })
};

// Try multiple models with retry logic
const callGeminiWithRetry = async (prompt, retryCount = 0) => {
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
      
      const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      console.log(`Success with model: ${MODELS[i]}`);
      return text;
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
  
  const prompt = `Generate Travel Plan for Location: ${location}, for ${days} Days for ${traveler} with a ${budget} budget. Give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for ${days} days with each day plan with best time to visit in JSON format.`;

  try {
    const responseText = await callGeminiWithRetry(prompt);
    const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanJson);
    return { success: true, data: data, usedFallback: false };
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    if (retryCount < maxRetries) {
      const waitTime = Math.pow(2, retryCount) * 2000;
      console.log(`Retrying in ${waitTime}ms... (Attempt ${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return generateTrip(location, days, traveler, budget, retryCount + 1);
    }
    
    console.warn("Using fallback response");
    const fallbackData = FALLBACK_RESPONSES.generic(location, days, traveler, budget);
    return { 
      success: true, 
      data: fallbackData, 
      usedFallback: true,
      fallbackMessage: "✨ Using smart suggestions (AI service is currently busy)"
    };
  }
};