import HOST from "../utils/routes";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const createSessionDB = async (treat) => {
    return await fetch(HOST + 'api/session', {  
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        method: "POST", 
        body: JSON.stringify({treat: treat}) })
        .then(res => res.json())
        .then(data => {
            console.log('data createSessionDB: ', data)
            // sessionStorage.setItem('disesSession', JSON.stringify(data));
            return data
        })
        .catch(err => console.log(err))
}

export const useTrackPageTime = () => {
  const location = useLocation();
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    // Reset start time when location changes
    setStartTime(Date.now());

    return () => {
      // On unmount, calculate the time spent on this page
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      console.log(`User spent ${timeSpent} seconds on ${location.pathname}.`);
      // Here you can also store the timeSpent if needed
    };
  }, [location]); // Trigger effect on location change

  return startTime; // Optional: return startTime if needed
};




