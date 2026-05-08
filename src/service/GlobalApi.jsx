import axios from "axios";

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';
const API_KEY = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

const config = {
    headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.photos,places.userRatingCount'
    }
};

export const GetPlaceDetails = (data) => axios.post(BASE_URL, data, config);

export const GetPlacePhoto = (photoName, maxWidth = 1200, maxHeight = 400) => {
    if (!photoName) return null;
    return `https://places.googleapis.com/v1/${photoName}/media?key=${API_KEY}&maxWidthPx=${maxWidth}&maxHeightPx=${maxHeight}`;
};

// ✅ Extract location from natural language queries (e.g., "museums in Tokyo" → "Tokyo")
const extractLocationFromQuery = (query) => {
    let location = query;
    const prefixes = [
        "hotels in ", "tourist attractions in ", "museums in ", "national parks in ",
        "landmarks in ", "cultural sites in ", "nature in ", "entertainment in ",
        "beaches in ", "shopping in ", "famous restaurants in ", "nightlife in ",
        "zoos in ", "sports in ", "cinemas in ", "best tourist attractions in "
    ];
    for (const prefix of prefixes) {
        if (location.toLowerCase().startsWith(prefix)) {
            location = location.slice(prefix.length);
            break;
        }
    }
    return location.trim() || "Tokyo";
};

// ✅ Mock data generator that uses the actual destination
const getMockPlaces = (query, type = 'attraction', count = 8) => {
    const location = extractLocationFromQuery(query);
    const mockNames = {
        attraction: [
            `${location} Central Square`,
            `${location} History Museum`,
            `${location} Cathedral`,
            `${location} Royal Park`,
            `${location} Old Town`,
            `${location} Art Gallery`,
            `${location} Castle`,
            `${location} Main Market`
        ],
        hotel: [
            `Grand ${location} Hotel`,
            `${location} Plaza Inn`,
            `The ${location} Palace`,
            `${location} Central Hotel`,
            `${location} Boutique Suites`,
            `${location} Business Lodge`,
            `${location} Riverside Resort`,
            `${location} City Stay`
        ]
    };
    const typeKey = type === 'hotel' ? 'hotel' : 'attraction';
    const names = mockNames[typeKey];
    return Array.from({ length: Math.min(count, names.length) }, (_, i) => ({
        displayName: { text: names[i] },
        formattedAddress: `${names[i]}, ${location}`,
        rating: Math.random() * 2 + 3,
        userRatingCount: Math.floor(Math.random() * 500) + 50,
        photos: [{ name: `mock-photo-${i}` }]
    }));
};

export const GetDestinationPhoto = async (query, maxWidth = 800, maxHeight = 400) => {
    try {
        const response = await GetPlaceDetails({ textQuery: query, pageSize: 1, languageCode: 'en' });
        const place = response.data?.places?.[0];
        if (place?.photos?.length) return GetPlacePhoto(place.photos[0].name, maxWidth, maxHeight);
        return null;
    } catch (error) {
        console.warn("Using fallback for destination photo");
        return null;
    }
};

export const SearchDestination = async (query) => {
    try {
        const response = await GetPlaceDetails({ textQuery: query, pageSize: 1, languageCode: 'en' });
        const place = response.data?.places?.[0];
        if (place) {
            return {
                name: place.displayName?.text || query,
                address: place.formattedAddress,
                rating: place.rating,
                photo: place.photos?.[0]?.name ? GetPlacePhoto(place.photos[0].name, 1200, 400) : null,
                type: 'city'
            };
        }
        throw new Error('No place');
    } catch (error) {
        console.warn(`Mock destination for ${query}`);
        return { name: query, address: query, rating: 4.2, photo: null, type: 'city' };
    }
};

export const SearchHotels = async (location) => {
    try {
        const response = await GetPlaceDetails({ textQuery: `hotels in ${location}`, pageSize: 10, languageCode: 'en' });
        return response.data?.places || [];
    } catch (error) {
        console.warn(`Mock hotels for ${location}`);
        return getMockPlaces(`hotels in ${location}`, 'hotel', 10);
    }
};

export const SearchAttractions = async (location) => {
    try {
        const response = await GetPlaceDetails({ textQuery: location, pageSize: 15, languageCode: 'en' });
        return response.data?.places || [];
    } catch (error) {
        console.warn(`Mock attractions for ${location}`);
        return getMockPlaces(location, 'attraction', 15);
    }
};

export const GetAttractionPhoto = (photoName, maxWidth = 400, maxHeight = 300) => {
    if (!photoName || photoName.startsWith('mock')) {
        return `https://picsum.photos/${maxWidth}/${maxHeight}?random=${Math.random()}`;
    }
    return GetPlacePhoto(photoName, maxWidth, maxHeight);
};