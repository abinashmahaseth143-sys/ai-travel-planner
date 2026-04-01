import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels'; 
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'AITrips', tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document:", docSnap.data());
        setTrip({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No Such Document");
        toast('No trip Found!');
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
      toast.error('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin'></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className='text-center mt-20'>
        <h2 className='text-2xl font-bold text-red-500'>No trip found</h2>
        <button 
          onClick={() => window.location.href = '/'}
          className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg'
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* Information Section */}
      <InfoSection trip={trip} />
      
      {/* Recommended Hotels - FIXED: Pass trip prop */}
      <Hotels trip={trip} />
      
      {/* Daily Plans */}
      <PlacesToVisit trip={trip} />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Viewtrip;