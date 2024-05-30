// import React, { useState, useEffect } from 'react';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
// import './ReservationBanner.css';
// import axiosInstance from '../hooks/axiosInstance';

// const ReservationBanner = () => {
//   const [DBreservations, setDBReservations] = useState([]);
//   const [indexReservation, setIndexReservation] = useState(0);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     axiosInstance.get("/reservations/")
//       .then(response => {
//         if (Array.isArray(response.data.data)) {
//           const reservations = response.data.data.map(reservation => ({
//             name: reservation.user.name,
//             room: reservation.room.name,
//             time: `${new Date(reservation.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(reservation.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
//           }));
//           setDBReservations(reservations); 
//           setError(null);
//         } else {
//           throw new Error('La respuesta no es un array.');
//         }
//       })
//       .catch(error => {
//         setError('Error al cargar reservaciones.');
//       });
//   }, []);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setIndexReservation((prevIndex) => (prevIndex + 1) % DBreservations.length);
//     }, 7000);

//     return () => clearInterval(intervalId);
//   }, [DBreservations.length]);

//   const currentReservation = DBreservations[indexReservation];

//   return (
//     <div className="border border-black flex items-center justify-end w-full h-full">
//       <TransitionGroup className="reservation-container">
//         <CSSTransition
//           key={indexReservation}
//           timeout={500}
//           classNames="reservation">
//           {currentReservation ? (
//             <div className="reservation-item flex items-center justify-end w-full h-full">
//               <div className="flex flex-col w-5/12 h-5/6 mr-2">
//                 <div className="flex items-end justify-end h-3/6">
//                   <span style={{
//                     fontSize: '2vw',
//                     color: 'white',
//                     fontWeight: 'bold',
//                     whiteSpace: 'nowrap'
//                   }}>{currentReservation.name}</span>
//                 </div>
//                 <div className="items-start justify-end flex h-1/6">
//                   <span style={{
//                     fontSize: '1.5vw',
//                     color: '#00FFF7',
//                     fontWeight: 'bold',
//                     whiteSpace: 'nowrap'
//                   }}>{currentReservation.room}</span>
//                 </div>
//               </div>
//               <div className="border-l border-white flex flex-col items-center justify-center w-4/12 h-4/6 ml-2 mr-4">
//                 <label style={{
//                   fontSize: '1.5vw',
//                   fontFamily: 'Arial, sans-serif',
//                   color: 'white',
//                   whiteSpace: 'nowrap'
//                 }}>{currentReservation.time}</label>
//               </div>
//             </div>
//           ) : (
//             <div className="reservation-item flex items-center justify-center w-full h-full">
//               <span style={{ color: 'white', fontSize: '2vw' }}>
//                 {error ? error : 'Cargando reservaciones...'}
//               </span>
//             </div>
//           )}
//         </CSSTransition>
//       </TransitionGroup>
//     </div>
//   );
// };

// export default ReservationBanner;



// Datos locales

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
                  fontSize: '2vw',
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