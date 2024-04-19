import { useState, useEffect } from "react";
import CancelPopUp from "./CancelPopUp";
import ModifyPopUp from "./ModifyPopUp";
const login_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MWQ3NmNkZmM2Y2RhNmQ1MGNmMDQ3MiIsIm5hbWUiOiJQQVRSSUNJTyBWSUxMQVJSRUFMIiwiZW1haWwiOiJBMDA4MzQ1MjZAVEVDLk1YIiwiY2FyZWVyIjoiSVRDIiwic2VtZXN0ZXIiOjYsInJvbGUiOiI2NjE0YWY5YTZkMjk0ZjVkNDQwMDg2YTEiLCJleHAiOjE3MjEzMjYzNjV9.hpah2e_4tJMDmUMOuhCkPd--63OjMDNPAnnAf8d3vyQ';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPersonShelter, faHourglassStart, faHourglassEnd, faComputer, faPen,faBan} from '@fortawesome/free-solid-svg-icons'

async function cancelReservation(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + login_token
        }
    };

    const cancelIt = async () => {
        try {
            const response = await fetch('https://dream-lab-backend.azurewebsites.net/v1/reservations/' + id, requestOptions);
            
            if (!response.ok) {
                throw new Error('Failed to cancel reservation');
            }

            const jsonData = await response.json();
            console.log(jsonData);
            
        } catch (error) {
            console.error('Error canceling reservation:', error);
        }
    };

    await cancelIt();
}

async function modifyReservation(id) {
    try {
        window.location.reload();
    } catch (error) {
        console.error('Error modifying reservation:', error);
    }
}

function ReservationCard(props){
    const [cancel,setCancel] = useState(false);
    const [modify,setModify] = useState(false);
    /*function EquipoNameFetcher(id_equipo){


    }*/

    return(
    <div className="ReservationCard">
        <img className= "ReservationCardImage" src={props.imgurl} alt="Sala reservada"></img>
        <div className="ReservationCardText">
            <h2><strong ><FontAwesomeIcon icon={faPersonShelter} /> Sala:</strong> {props.sala}</h2>
            <p><strong><FontAwesomeIcon icon={faHourglassStart} /> Horario de Inicio:</strong> {props.horainicio}</p>
            <p><strong><FontAwesomeIcon icon={faHourglassEnd} /> Horario de Fin:</strong> {props.horafin}</p>
            <p><strong><FontAwesomeIcon icon={faComputer} /> Equipo Requerido:</strong> {props.equipo}</p>
            <button className="confirmModifyButton" onClick={()=>{
                setModify(true)
            }}><FontAwesomeIcon icon={faPen} /> Modificar</button>
            <ModifyPopUp isShowing={modify} onCancel={() =>{setModify(false)}} onConfirm={()=>{modifyReservation(props.id)
                setModify(false)
            }}/>
            <button className="confirmCancelButton" onClick={()=>{
                setCancel(true)
            }}><FontAwesomeIcon icon={faBan} /> Cancelar</button>
            <CancelPopUp isShowing={cancel} onCancel={() =>{setCancel(false)}} onConfirm={()=>{cancelReservation(props.id)
                setCancel(false)
            }}/>
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

                // Map JSON data to Reservation objects
                const mappedReservations = jsonData['data'].map(row => {
                    const mappedEquipment = row.reserved_equipment.map(e => e.name);
                    console.log(mappedEquipment);
                    return new Reservations(row.id, "src/components/assets/pc-room.webp", row.name, row.start_date, row.end_date, mappedEquipment);
                });
                console.log(mappedReservations);

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
                id= {reservation.id}
                imgurl={reservation.imgurl}
                sala={reservation.sala}
                horainicio={reservation.horainicio}
                horafin={reservation.horafin}
                equipo={reservation.equipo.join(', ')}
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