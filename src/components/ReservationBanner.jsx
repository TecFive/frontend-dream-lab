import React, {useState, useEffect} from 'react';
import axiosInstance from '../hooks/axiosInstance';

const ReservationBanner = () => {
  const reservations = [
      {name: "Jose Oliva", room: "Lego Room", time: "8:30 PM - 10:30 PM"},
      {name: "Patricio Villarreal", room: "VR Room", time: "9:00 AM - 11:00 AM"},
      {name: "David Faudoa", room: "Meeting Room", time: "11:30 AM - 1:30 PM"}
  ];

  const [indexReservation, setIndexReservation] = useState(0);

  useEffect(() => {
      const intervalId = setInterval(() => {
        setIndexReservation((prevIndex) => (prevIndex + 1) % reservations.length);
      }, 6000);
  
      return () => clearInterval(intervalId);
    }, [reservations.length]);

    const currentReservation = reservations[indexReservation];

    return (
      <div className="border border-black flex items-center justify-end w-full h-full">
        <div className="flex flex-col w-5/12 h-5/6 mr-2">
          <div className="flex items-end justify-end h-3/6">
            <span style={{
              fontSize: '2vw',
              color: 'white',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>{currentReservation.name}</span>
          </div>
          <div className="items-start justify-end flex h-1/6">
            <span style={{
              fontSize: '1vw',
              color: '#00FFF7',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}>{currentReservation.room}</span>
          </div>
        </div>
        <div className="border-l border-white flex flex-col items-center justify-center w-4/12 h-4/6 ml-2 mr-4">
          <label style={{
            fontSize: '1vw',
            fontFamily: 'Arial, sans-serif',
            color: 'white',
            whiteSpace: 'nowrap'
          }}>{currentReservation.time}</label>
        </div>
      </div>
    );
};

export default ReservationBanner;