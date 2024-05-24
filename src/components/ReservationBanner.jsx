import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservationBanner = () => {

  const reservations = [
    { name: "Jose Oliva", room: "Lego Room", time: "8:30 PM - 10:30 PM" },
    { name: "Patricio Villarreal", room: "VR Room", time: "9:00 AM - 11:00 AM" },
    { name: "David Faudoa", room: "Meeting Room", time: "11:30 AM - 1:30 PM" }
  ];

  const [indexReservation, setIndexReservation] = useState(0);

  useEffect(() => {
    axios.get("https://dream-lab-backend.azurewebsites.net/v1/reservations", {
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MWQ3NmNkZmM2Y2RhNmQ1MGNmMDQ3MiIsIm5hbWUiOiJQQVRSSUNJTyBWSUxMQVJSRUFMIiwiZW1haWwiOiJBMDA4MzQ1MjYiLCJjYXJlZXIiOiJJVEMiLCJzZW1lc3RlciI6Niwicm9sZSI6IlN0dWRlbnQifQ.JCPU9TCV6JEpushJ1VllSlMBMzFTPJY4dNuL0Em6SgI"
      }
    })
      .then(response => {
        console.log('Success:', response);
      })
      .catch(error => console.error('Error:', error));

    const intervalId = setInterval(() => {
      setIndexReservation((prevIndex) => (prevIndex + 1) % reservations.length);
    }, 7000);

    return () => clearInterval(intervalId);
  }, [reservations.length]);

  const currentReservation = reservations[indexReservation];

  return (
    <div className="border border-black flex items-center justify-end w-full h-full">
      <div className="flex flex-col w-5/12 h-5/6 mr-2">
        <div className="flex items-end justify-end h-3/6">
          <span style={{
            fontSize: '2.5vw',
            color: 'white',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>{currentReservation.name}</span>
        </div>
        <div className="items-start justify-end flex h-1/6">
          <span style={{
            fontSize: '1.5vw',
            color: '#00FFF7',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>{currentReservation.room}</span>
        </div>
      </div>
      <div className="border-l border-white flex flex-col items-center justify-center w-4/12 h-4/6 ml-2 mr-4">
        <label style={{
          fontSize: '1.5vw',
          fontFamily: 'Arial, sans-serif',
          color: 'white',
          whiteSpace: 'nowrap'
        }}>{currentReservation.time}</label>
      </div>
    </div>
  );
};

export default ReservationBanner;