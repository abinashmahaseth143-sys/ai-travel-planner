// src/lib/apiHealth.js
export const checkGeminiHealth = async () => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: {
        'x-goog-api-key': import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY
      }
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Show warning if API is down
export const showApiWarning = async () => {
  const isHealthy = await checkGeminiHealth();
  if (!isHealthy) {
    console.warn("⚠️ Gemini API is currently unavailable. Using fallback responses.");
    return true;
  }
  return false;
};