// DATOS LOCALES

import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './ReservationBanner.css';
import axiosInstance from '../hooks/axiosInstance';

const ReservationBanner = () => {
  const [DBreservations, setReservations] = useState([]);
  const reservations = [
    { name: "Jose Oliva", room: "Lego Room", time: "8:30 PM - 10:30 PM" },
    { name: "Patricio Villarreal", room: "VR Room", time: "9:00 AM - 11:00 AM" },
    { name: "David Faudoa", room: "Meeting Room", time: "11:30 AM - 1:30 PM" }
  ];

  const [indexReservation, setIndexReservation] = useState(0); 

  useEffect(() => {
    axiosInstance.get("/reservations/") 
      .then(response => {
        console.log('Success:', response);
        setReservations(response.data); 
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
      <TransitionGroup className="reservation-container">
        <CSSTransition
          key={indexReservation}
          timeout={500}
          classNames="reservation">
          <div className="reservation-item flex items-center justify-end w-full h-full">
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
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default ReservationBanner;


// DATOS DE BACK

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ReservationBanner = () => {
//   // Estado para reservaciones obtenidas de la API
//   const [reservations, setReservations] = useState([]);
//   const [indexReservation, setIndexReservation] = useState(0);
//   const [loading, setLoading] = useState(true); // Estado para indicar que los datos están cargando
//   const [error, setError] = useState(null); // Estado para manejar errores

//   useEffect(() => {
//     const fetchReservations = async () => {
//       try {
//         const response = await axios.get("/v1/reservations/", {
//           headers: {
//             Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MWQ3NmNkZmM2Y2RhNmQ1MGNmMDQ3MiIsIm5hbWUiOiJQQVRSSUNJTyBWSUxMQVJSRUFMIiwiZW1haWwiOiJBMDA4MzQ1MjYiLCJjYXJlZXIiOiJJVEMiLCJzZW1lc3RlciI6Niwicm9sZSI6IlN0dWRlbnQifQ.JCPU9TCV6JEpushJ1VllSlMBMzFTPJY4dNuL0Em6SgI"
//           }
//         });

//         console.log('Success:', response.data);

//         if (Array.isArray(response.data.data)) {
//           // Transformar los datos de la API al formato necesario
//           const formattedReservations = response.data.data.map(reservation => ({
//             name: reservation.user.name,
//             room: reservation.room.name,
//             time: `${new Date(reservation.start_date).toLocaleTimeString()} - ${new Date(reservation.end_date).toLocaleTimeString()}`
//           }));
//           setReservations(formattedReservations);
//         } else {
//           console.error('Error: Response data is not an array');
//           setError('Response data is not an array');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         setError('Failed to fetch reservations');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReservations();

//     const intervalId = setInterval(() => {
//       setIndexReservation((prevIndex) => (prevIndex + 1) % reservations.length);
//     }, 7000);

//     return () => clearInterval(intervalId);
//   }, [reservations.length]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (reservations.length === 0) {
//     return <div>No reservations available</div>;
//   }

//   const currentReservation = reservations[indexReservation];

//   return (
//     <div className="border border-black flex items-center justify-end w-full h-full">
//       <div className="flex flex-col w-5/12 h-5/6 mr-2">
//         <div className="flex items-end justify-end h-3/6">
//           <span style={{
//             fontSize: '2.5vw',
//             color: 'white',
//             fontWeight: 'bold',
//             whiteSpace: 'nowrap'
//           }}>{currentReservation.name}</span>
//         </div>
//         <div className="items-start justify-end flex h-1/6">
//           <span style={{
//             fontSize: '1.5vw',
//             color: '#00FFF7',
//             fontWeight: 'bold',
//             whiteSpace: 'nowrap'
//           }}>{currentReservation.room}</span>
//         </div>
//       </div>
//       <div className="border-l border-white flex flex-col items-center justify-center w-4/12 h-4/6 ml-2 mr-4">
//         <label style={{
//           fontSize: '1.5vw',
//           fontFamily: 'Arial, sans-serif',
//           color: 'white',
//           whiteSpace: 'nowrap'
//         }}>{currentReservation.time}</label>
//       </div>
//     </div>
//   );
// };

// export default ReservationBanner;
