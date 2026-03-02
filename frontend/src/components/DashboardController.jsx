import React, { useState, useEffect } from 'react';
import HomePage from './HomePage';
import PopulatedDashboard from './PopulatedDashboard';
import { Loader2 } from 'lucide-react';

const DashboardController = () => {
  {/*const [studySets, setStudySets] = useState([]);*/}
  const [studySets, setStudySets] = useState([]);
  // const [studySets, setStudySets] = useState([{ title: 'Test' }]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudySets = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // This makes a request to a theoretical backend route to get the user's data
        const response = await fetch('/api/get-study-sets', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStudySets(data.studySets || []); 
        } else {
          // If the route doesn't exist yet, we'll just fail gracefully
          console.log("Could not fetch study sets (Backend route might be missing).");
        }
      } catch (error) {
        console.error("Error connecting to backend:", error);
      } finally {
        // Whether it succeeds or fails, stop the loading spinner
        setIsLoading(false);
      }
    };

    fetchStudySets();
  }, []);

  // 1. Show a loading spinner while we ask the backend for data
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F7FB]">
        <div className="flex flex-col items-center text-blue-500 animate-pulse">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <h2 className="text-xl font-bold">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  // 2. THE MAGIC SWITCH
  // If the backend returns 1 or more study sets, show the dark mode grid!
  if (studySets.length > 0) {
    return <PopulatedDashboard studySets={studySets} />;
  } 
  
  // 3. If they have 0 study sets, show the light mode drag-and-drop page!
  return <HomePage />;
};

export default DashboardController;