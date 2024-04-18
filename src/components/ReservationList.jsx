import { useState, useEffect } from "react";
const login_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MWQ3NmNkZmM2Y2RhNmQ1MGNmMDQ3MiIsIm5hbWUiOiJQQVRSSUNJTyBWSUxMQVJSRUFMIiwiZW1haWwiOiJBMDA4MzQ1MjZAVEVDLk1YIiwiY2FyZWVyIjoiSVRDIiwic2VtZXN0ZXIiOjYsInJvbGUiOiI2NjE0YWY5YTZkMjk0ZjVkNDQwMDg2YTEiLCJleHAiOjE3MjEyNDMzOTN9.ezghdqSwwEstALHtv048X7N9cRlApaugMxhW43ZlVWE';

function ReservationCard(props){

    /*function EquipoNameFetcher(id_equipo){


    }*/

    return(
    <div className="ReservationCard">
        <img className= "ReservationCardImage" src={props.imgurl} alt="Sala reservada"></img>
        <div className="ReservationCardText">
            <h2><strong >Sala:</strong> {props.sala}</h2>
            <p><strong>Horario de Inicio:</strong> {props.horainicio}</p>
            <p><strong>Horario de Fin:</strong> {props.horafin}</p>
            <p><strong>Equipo Requerido:</strong> {props.equipo}</p>
            <button className="ReservationCardbutton">Modificar</button>
            <button className="ReservationCardbutton">Cancelar</button>
        </div>
    </div>
    );
} 

function Reservations(id, imgurl, sala, horainicio, horafin, equipo){
    this.id= id;
    this.imgurl = imgurl;
    this.sala = sala;
    this.horainicio = horainicio;
    this.horafin = horafin;
    this.equipo = equipo;
}


function ReservationList(){
    const[reservations, setReservations]= useState([]) //se crean las variables para el fetch de las reservaciones como un array vacío

    useEffect(() => {
        // Fetch options with headers
        const requestOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + login_token
            },
        };

        const fetchReservations = async () => {
            try {
                const response = await fetch('https://dream-lab-backend.azurewebsites.net/v1/reservations/my-reservations', requestOptions);
                if (!response.ok) {
                    throw new Error('Failed to fetch reservations');
                }
                const jsonData = await response.json();
                console.log(jsonData);

                // Map JSON data to Reservation objects
                const mappedReservations = jsonData['data'].map(row => 
                    new Reservations(row.id, "src/components/assets/pc-room.webp", row.name, row.start_date, row.end_date, row.reserved_equipment)
                );

                // Update state with reservations
                setReservations(mappedReservations);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        };

        fetchReservations();
    }, []); // Run once on component mount
    
    //Funcion que crea Tarjetas de Reservaciones
    function reservationCardCreator(reservation, index) {
        return (
            <ReservationCard
                key={index} 
                imgurl={reservation.imgurl}
                sala={reservation.sala}
                horainicio={reservation.horainicio}
                horafin={reservation.horafin}
                equipo={reservation.equipo}
            />
        );
    }

    return(
        <div>
            {reservations.map(reservationCardCreator)}
        </div>
    );
}

export default ReservationList;