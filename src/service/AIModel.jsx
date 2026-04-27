// src/lib/gemini.js
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Create chat session
export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "Generate Travel Plan for Location: Las Vegas, NV, USA for 3 days with budget moderate and travelers: Just Me" }
      ]
    },
    {
      role: "model",
      parts: [
        { text: "I will generate a travel plan for you based on your preferences." }
      ]
    }
  ],
});

// Function to send a new message
export async function sendMessage(message) {
  try {
    const result = await chatSession.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Function to generate trip itinerary dynamically
export async function generateTripItinerary(destination, days, travelers, budget) {
  try {
    const prompt = `Generate a detailed ${days}-day travel itinerary for ${destination}. 
    Travelers: ${travelers}
    Budget: ${budget}
    
    Return the response in JSON format with the following structure:
    {
      "destination": "${destination}",
      "days": ${days},
      "itinerary": [
        {
          "day": 1,
          "activities": ["activity1", "activity2"],
          "meals": ["breakfast place", "lunch place", "dinner place"],
          "accommodation": "hotel name"
        }
      ],
      "budget": "${budget}",
      "travelers": "${travelers}"
    }`;
    
    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text();
    
    // Parse the JSON response
    try {
      return JSON.parse(response);
    } catch (e) {
      return response;
    }
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw error;
  }
}