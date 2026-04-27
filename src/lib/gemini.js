// src/lib/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

if (!apiKey) {
  console.error("❌ Gemini API key is missing!");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Use the latest Gemini 2.5 Flash model (fast and efficient)
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash"
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});