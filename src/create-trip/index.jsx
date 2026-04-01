import React, { useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { Input } from '@/components/ui/input'
import { SelectTravelesList, SelectBudgetOptions } from '../constants/options'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { chatSession } from '../lib/gemini'
import { db } from '../service/firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { GetDestinationPhoto } from '../service/GlobalApi' // Add this import

function CreateTrip() {
  const [place, setPlace] = useState();
  const [days, setDays] = useState('');
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [destinationImage, setDestinationImage] = useState(null); // Add this state
  const navigate = useNavigate();

  // Fetch destination image when place changes
  const fetchDestinationImage = async (locationName) => {
    if (!locationName) return;
    try {
      const imageUrl = await GetDestinationPhoto(locationName);
      if (imageUrl) {
        setDestinationImage(imageUrl);
        console.log("Destination image fetched:", imageUrl);
      }
    } catch (error) {
      console.error("Error fetching destination image:", error);
    }
  };

  // Handle place selection
  const handlePlaceChange = (value) => {
    setPlace(value);
    if (value?.label) {
      fetchDestinationImage(value.label);
    }
  };

  // SaveAiTrip function - saves trip to Firebase with image
  const SaveAiTrip = async (TripData) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const docId = Date.now().toString();
      
      const formData = {
        location: place?.label,
        days: days,
        traveler: SelectTravelesList.find(t => t.id === selectedTraveler)?.title,
        budget: SelectBudgetOptions.find(b => b.id === selectedBudget)?.title,
        timestamp: new Date().toISOString(),
        destinationImage: destinationImage // Store the actual destination image
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

      console.log("Step 1: Sending prompt to Gemini...")
      
      const result = await chatSession.sendMessage(FINAL_PROMPT)
      const responseText = result?.response?.text()
      console.log("Step 2: Received response from Gemini")
      
      if (!responseText) {
        throw new Error("Empty response from AI")
      }
      
      let itineraryData
      try {
        const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        itineraryData = JSON.parse(cleanJson)
        console.log("Step 3: Parsed JSON successfully")
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError)
        toast.error("Failed to parse itinerary data")
        setLoading(false)
        return
      }
      
      console.log("Step 4: Saving to Firebase...")
      const saved = await SaveAiTrip(itineraryData)
      
      localStorage.setItem('itinerary', JSON.stringify(itineraryData))
      console.log("Step 5: Saved to localStorage")
      
      toast.dismiss()
      if (saved) {
        toast.success("Trip generated and saved successfully! 🎉")
      } else {
        toast.warning("Trip generated but could not save to database")
      }
      
    } catch (error) {
      console.error("Error:", error)
      toast.dismiss()
      
      if (error.message?.includes("API key")) {
        toast.error("Invalid or missing API key. Check your .env file.")
      } else if (error.message?.includes("network")) {
        toast.error("Network error. Check your internet connection.")
      } else if (error.message?.includes("Empty response")) {
        toast.error("No response from AI. Please try again.")
      } else {
        toast.error("Failed to generate itinerary. Please try again.")
      }
    } finally {
      setLoading(false)
      console.log("Step 6: Loading finished")
    }
  }

  return (
    <div style={{width: '100%', marginTop: '40px'}}>
      <Toaster />
      
      {/* Title Section */}
      <div style={{textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '0 16px'}}>
        <h2 style={{fontWeight: 'bold', fontSize: '30px'}}>Tell us your travel preference</h2>
        <p style={{marginTop: '12px', color: '#6b7280', fontSize: '20px'}}>
          Just provide some basic information, and our trip planner will generate customized itinerary based on your preferences.
        </p>
      </div>
      
      {/* Destination Section - UPDATED with handlePlaceChange */}
      <div style={{textAlign: 'center', marginTop: '40px'}}>
        <h2 style={{fontSize: '20px', margin: '12px 0', fontWeight: 'bold'}}>What is destination of choice?</h2>
        <div style={{maxWidth: '500px', margin: '0 auto'}}>
          <GooglePlacesAutocomplete
            apiKey="AIzaSyAnJwDgg2l5yJJUPL69v4qtS0uzoYcFpj0"
            selectProps={{
              placeholder: "Search for any city, country, or place...",
              isClearable: true,
              value: place,
              onChange: handlePlaceChange, // Updated to fetch image
              styles: {
                control: (provided) => ({
                  ...provided,
                  padding: '8px',
                  borderRadius: '8px',
                  borderColor: '#d1d5db'
                })
              }
            }}
          />
        </div>
      </div>

      {/* Number of Days Section */}
      <div style={{textAlign: 'center', marginTop: '40px'}}>
        <h2 style={{fontSize: '20px', margin: '12px 0', fontWeight: 'bold'}}>How many days are you planning your trip?</h2>
        <div style={{maxWidth: '500px', margin: '0 auto'}}>
          <Input 
            type="number"
            placeholder="Ex: 3"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px'
            }}
          />
        </div>
      </div>

      {/* Budget Section */}
      <div style={{textAlign: 'center', marginTop: '40px'}}>
        <h2 style={{fontSize: '20px', margin: '12px 0', fontWeight: 'bold'}}>What is Your Budget?</h2>
        <div style={{maxWidth: '900px', margin: '0 auto', padding: '0 20px'}}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            marginTop: '20px'
          }}>
            {SelectBudgetOptions.map((item, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedBudget(item.id)}
                style={{
                  cursor: 'pointer',
                  padding: '20px',
                  border: selectedBudget === item.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: selectedBudget === item.id ? '#eff6ff' : 'white',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
              >
                <div style={{fontSize: '40px', marginBottom: '8px'}}>{item.icon}</div>
                <h3 style={{fontWeight: 'bold', fontSize: '18px', marginBottom: '4px'}}>{item.title}</h3>
                <p style={{fontSize: '14px', color: '#6b7280'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traveler Section */}
      <div style={{textAlign: 'center', marginTop: '40px'}}>
        <h2 style={{fontSize: '20px', margin: '12px 0', fontWeight: 'bold'}}>Who do you plan on traveling with on your next adventure?</h2>
        <div style={{maxWidth: '900px', margin: '0 auto', padding: '0 20px'}}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginTop: '20px'
          }}>
            {SelectTravelesList.map((item, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedTraveler(item.id)}
                style={{
                  cursor: 'pointer',
                  padding: '20px',
                  border: selectedTraveler === item.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: selectedTraveler === item.id ? '#eff6ff' : 'white',
                  transition: 'all 0.2s',
                  textAlign: 'center'
                }}
              >
                <div style={{fontSize: '40px', marginBottom: '8px'}}>{item.icon}</div>
                <h3 style={{fontWeight: 'bold', fontSize: '18px', marginBottom: '4px'}}>{item.title}</h3>
                <p style={{fontSize: '14px', color: '#6b7280'}}>{item.desc}</p>
                <p style={{fontSize: '12px', color: '#9ca3af', marginTop: '8px'}}>{item.people}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Trip Button */}
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '40px', marginBottom: '40px', paddingRight: '20px'}}>
        <button 
          id="Button"
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
            gap: '10px',
            transition: 'all 0.2s'
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
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  )
}

export default CreateTrip