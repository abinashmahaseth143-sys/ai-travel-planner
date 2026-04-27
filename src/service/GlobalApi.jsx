// src/service/GlobalApi.jsx
import axios from "axios";

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';
const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.photos,places.primaryType,places.types,places.userRatingCount,places.priceLevel,places.editorialSummary'
    }
}

export const GetPlaceDetails = (data) => axios.post(BASE_URL, data, config);

// Function to get actual photo URL from photo name
export const GetPlacePhoto = (photoName, maxWidth = 1200, maxHeight = 400) => {
    return `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}`;
};

// ========== STEP 2: ADD THIS NEW FUNCTION ==========
// Get destination photo for trip cards
export const GetDestinationPhoto = async (query, maxWidth = 800, maxHeight = 400) => {
    try {
        const response = await GetPlaceDetails({
            textQuery: query,
            pageSize: 1,
            languageCode: 'en'
        });
        
        if (response.data?.places && response.data.places.length > 0) {
            const place = response.data.places[0];
            if (place.photos && place.photos.length > 0) {
                // Return a smaller image for trip cards (800x400)
                return GetPlacePhoto(place.photos[0].name, maxWidth, maxHeight);
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching destination photo:", error);
        return null;
    }
};
// ========== END OF STEP 2 ==========

// Search for a specific location/destination
export const SearchDestination = async (query) => {
    try {
        const response = await GetPlaceDetails({
            textQuery: query,
            pageSize: 1,
            languageCode: 'en'
        });
        
        if (response.data?.places && response.data.places.length > 0) {
            const place = response.data.places[0];
            return {
                name: place.displayName?.text || query,
                address: place.formattedAddress,
                rating: place.rating,
                photo: place.photos?.[0]?.name ? GetPlacePhoto(place.photos[0].name, 1200, 400) : null,
                type: place.primaryType || place.types?.[0]
            };
        }
        return null;
    } catch (error) {
        console.error("Error searching destination:", error);
        return null;
    }
};

// Search for hotels in a specific location
export const SearchHotels = async (location) => {
    try {
        const response = await GetPlaceDetails({
            textQuery: `hotels in ${location}`,
            pageSize: 10,
            languageCode: 'en'
        });
        return response.data?.places || [];
    } catch (error) {
        console.error("Error searching hotels:", error);
        return [];
    }
};

// Search for tourist attractions
export const SearchAttractions = async (location) => {
    try {
        const response = await GetPlaceDetails({
            textQuery: `tourist attractions in ${location}`,
            pageSize: 15,
            languageCode: 'en'
        });
        return response.data?.places || [];
    } catch (error) {
        console.error("Error searching attractions:", error);
        return [];
    }
};

// Get photo for an attraction/hotel with custom size
export const GetAttractionPhoto = (photoName, maxWidth = 400, maxHeight = 300) => {
    if (!photoName) return "/placeholder.jpg";
    return `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}`;
};