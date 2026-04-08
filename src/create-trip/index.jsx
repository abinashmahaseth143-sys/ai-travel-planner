import React, { useState } from 'react'
import { useLoadScript, Autocomplete } from '@react-google-maps/api'
import { Input } from '@/components/ui/input'
import { SelectTravelesList, SelectBudgetOptions } from '../constants/options'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { chatSession } from '../lib/gemini'
import { db } from '../service/firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import VoiceButton from '../components/VoiceButton'
import WeatherCountryAdvisor from '../components/WeatherCountryAdvisor'

const libraries = ['places'];

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [days, setDays] = useState('');
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAnJwDgg2l5yJJUPL69v4qtS0uzoYcFpj0",
    libraries,
  });

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const selectedPlace = autocomplete.getPlace();
      if (selectedPlace?.formatted_address) {
        setPlace({
          label: selectedPlace.formatted_address,
          value: selectedPlace
        });
        console.log("Selected place:", selectedPlace);
      }
    }
  };

  // Voice Handlers for ALL sections
  const handleVoiceDestination = (voiceText) => {
    console.log("Voice destination:", voiceText);
    setPlace({
      label: voiceText,
      value: { formatted_address: voiceText }
    });
    const inputElement = document.querySelector('input[placeholder*="Search"]');
    if (inputElement) {
      inputElement.value = voiceText;
    }
    toast.success(`Destination set to ${voiceText}`);
  };

  const handleVoiceDays = (voiceText) => {
    console.log("Voice days:", voiceText);
    const numberMatch = voiceText.match(/\d+/);
    if (numberMatch) {
      setDays(numberMatch[0]);
      toast.success(`Days set to ${numberMatch[0]}`);
    } else {
      toast("Please say a number like '3 days' or '5 days'");
    }
  };

  const handleVoiceBudget = (voiceText) => {
    console.log("Voice budget:", voiceText);
    const lowerText = voiceText.toLowerCase();
    if (lowerText.includes('cheap') || lowerText.includes('budget')) {
      setSelectedBudget(1);
      toast.success("Budget set to Cheap");
    } else if (lowerText.includes('moderate') || lowerText.includes('medium')) {
      setSelectedBudget(2);
      toast.success("Budget set to Moderate");
    } else if (lowerText.includes('luxury') || lowerText.includes('expensive')) {
      setSelectedBudget(3);
      toast.success("Budget set to Luxury");
    } else {
      toast("Please say 'cheap', 'moderate', or 'luxury'");
    }
  };

  const handleVoiceTraveler = (voiceText) => {
    console.log("Voice traveler:", voiceText);
    const lowerText = voiceText.toLowerCase();
    if (lowerText.includes('just me') || lowerText.includes('alone') || lowerText.includes('solo')) {
      setSelectedTraveler(1);
      toast.success("Traveler set to Just Me");
    } else if (lowerText.includes('couple') || lowerText.includes('two people') || lowerText.includes('2 people')) {
      setSelectedTraveler(2);
      toast.success("Traveler set to Couple");
    } else if (lowerText.includes('family')) {
      setSelectedTraveler(3);
      toast.success("Traveler set to Family");
    } else if (lowerText.includes('friends') || lowerText.includes('group')) {
      setSelectedTraveler(4);
      toast.success("Traveler set to Friends");
    } else {
      toast("Please say 'just me', 'couple', 'family', or 'friends'");
    }
  };

  const handleCountrySelect = (countryName) => {
    console.log("Selected country from weather advisor:", countryName);
    setPlace({
      label: countryName,
      value: { formatted_address: countryName }
    });
    toast.success(`Selected ${countryName}! Now set your trip details.`);
    
    const inputElement = document.querySelector('input[placeholder*="Search"]');
    if (inputElement) {
      inputElement.value = countryName;
    }
  };

  const SaveAiTrip = async (TripData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const docId = Date.now().toString();
      
      const formData = {
        location: place?.label,
        days: days,
        traveler: SelectTravelesList.find(t => t.id === selectedTraveler)?.title,
        budget: SelectBudgetOptions.find(b => b.id === selectedBudget)?.title,
        timestamp: new Date().toISOString()
      };
      
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: TripData,
        userEmail: user?.email || 'anonymous',
        userId: user?.uid || 'guest',
        id: docId,
        createdAt: new Date().toISOString()
      });
      navigate('/view-trip/' + docId);
      
      console.log("Trip saved successfully!");
      return true;
    } catch (error) {
      console.error("Error saving trip:", error);
      return false;
    }
  };

  const handleGenerateTrip = async () => {
    if (!place || !days || !selectedTraveler || !selectedBudget) {
      toast("Please fill all details")
      return
    }

    setLoading(true)
    toast.loading("Generating your personalized itinerary...")

    try {
      const travelerType = SelectTravelesList.find(t => t.id === selectedTraveler)?.title
      const budgetType = SelectBudgetOptions.find(b => b.id === selectedBudget)?.title

      const AI_PROMPT = `Generate Travel Plan for Location: {{location}}, for {{totalDays}} Days for {{traveler}} with a {{budget}} budget. Give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for {{totalDays}} days with each day plan with best time to visit in JSON format.`

      const FINAL_PROMPT = AI_PROMPT
        .replace('{{location}}', place?.label)
        .replace('{{totalDays}}', days)
        .replace('{{traveler}}', travelerType)
        .replace('{{budget}}', budgetType)

      const result = await chatSession.sendMessage(FINAL_PROMPT)
      const responseText = result?.response?.text()
      
      let itineraryData
      try {
        const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        itineraryData = JSON.parse(cleanJson)
      } catch (parseError) {
        toast.error("Failed to parse itinerary data")
        setLoading(false)
        return
      }
      
      const saved = await SaveAiTrip(itineraryData)
      
      localStorage.setItem('itinerary', JSON.stringify(itineraryData))
      
      toast.dismiss()
      if (saved) {
        toast.success("Trip generated and saved successfully! 🎉")
      } else {
        toast.warning("Trip generated but could not save to database")
      }
      
    } catch (error) {
      console.error("Error:", error)
      toast.dismiss()
      toast.error("Failed to generate itinerary. Please try again.")
    } finally {
      setLoading(false)
    }
  };

  if (!isLoaded) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading Google Maps...</div>;
  }

  return (
    <div style={{width: '100%', marginTop: '40px'}}>
      <Toaster />
      
      <div style={{textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '0 16px'}}>
        <h2 style={{fontWeight: 'bold', fontSize: '30px'}}>Tell us your travel preference</h2>
        <p style={{marginTop: '12px', color: '#6b7280', fontSize: '20px'}}>
          Just provide some basic information, and our trip planner will generate customized itinerary based on your preferences.
        </p>
      </div>
      
      {/* Weather Country Advisor */}
      <WeatherCountryAdvisor 
        destination={place?.label} 
        onSelectDestination={handleCountrySelect}
      />
      
      {/* 1. DESTINATION Section with Voice */}
      <div style={{textAlign: 'center', marginTop: '40px'}}>
        <h2 style={{fontSize: '20px', margin: '12px 0', fontWeight: 'bold'}}>What is destination of choice?</h2>
        <div style={{maxWidth: '500px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <div style={{flex: 1, position: 'relative'}}>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                placeholder="Search or speak to find any city, country, or place..."
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none'
                }}
              />
            </Autocomplete>
          </div>
          <VoiceButton onResult={handleVoiceDestination} label="destination" />
        </div>
      </div>

      {/* 2. NUMBER OF DAYS Section */}
      <div style={{textAlign: 'center', marginTop: '40px'}}>
        <h2 style={{fontSize: '20px', margin: '12px 0', fontWeight: 'bold'}}>How many days are you planning your trip?</h2>
        <div style={{maxWidth: '500px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Input 
            type="number"
            placeholder="Ex: 3"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            style={{ flex: 1, padding: '12px', fontSize: '16px', border: '1px solid #d1d5db', borderRadius: '8px' }}
          />
          <VoiceButton onResult={handleVoiceDays} label="days" />
        </div>
      </div>

      {/* 3. BUDGET Section */}
      <div style={{textAlign: 'center', marginTop: '40px'}}>
        <h2 style={{fontSize: '20px', margin: '12px 0', fontWeight: 'bold'}}>What is Your Budget?</h2>
        <div style={{maxWidth: '900px', margin: '0 auto', padding: '0 20px'}}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
            {SelectBudgetOptions.map((item, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedBudget(item.id)}
                style={{
                  cursor: 'pointer',
                  padding: '20px',
                  flex: 1,
                  minWidth: '150px',
                  border: selectedBudget === item.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: selectedBudget === item.id ? '#eff6ff' : 'white',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{fontSize: '40px', marginBottom: '8px'}}>{item.icon}</div>
                <h3 style={{fontWeight: 'bold', fontSize: '18px'}}>{item.title}</h3>
                <p style={{fontSize: '14px', color: '#6b7280'}}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <VoiceButton onResult={handleVoiceBudget} label="budget" />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>🎤 Say: "cheap", "moderate", or "luxury"</span>
          </div>
        </div>
      </div>

      {/* 4. TRAVELER Section */}
      <div style={{textAlign: 'center', marginTop: '40px'}}>
        <h2 style={{fontSize: '20px', margin: '12px 0', fontWeight: 'bold'}}>Who do you plan on traveling with on your next adventure?</h2>
        <div style={{maxWidth: '900px', margin: '0 auto', padding: '0 20px'}}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
            {SelectTravelesList.map((item, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedTraveler(item.id)}
                style={{
                  cursor: 'pointer',
                  padding: '20px',
                  flex: 1,
                  minWidth: '120px',
                  border: selectedTraveler === item.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: selectedTraveler === item.id ? '#eff6ff' : 'white',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{fontSize: '40px', marginBottom: '8px'}}>{item.icon}</div>
                <h3 style={{fontWeight: 'bold', fontSize: '18px'}}>{item.title}</h3>
                <p style={{fontSize: '14px', color: '#6b7280'}}>{item.desc}</p>
                <p style={{fontSize: '12px', color: '#9ca3af', marginTop: '8px'}}>{item.people}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <VoiceButton onResult={handleVoiceTraveler} label="traveler type" />
            <span style={{ fontSize: '12px', color: '#6b7280' }}>🎤 Say: "just me", "couple", "family", or "friends"</span>
          </div>
        </div>
      </div>

      {/* Generate Trip Button */}
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '40px', marginBottom: '40px', paddingRight: '20px'}}>
        <button 
          onClick={handleGenerateTrip}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9ca3af' : '#3b82f6',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {loading ? (
            <>
              <AiOutlineLoading3Quarters style={{ animation: 'spin 1s linear infinite' }} />
              Generating...
            </>
          ) : (
            'Generate My Trip'
          )}
        </button>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default CreateTrip