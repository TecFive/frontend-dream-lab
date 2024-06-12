import { useReserva } from "../hooks/useLAB";
import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { FaCheck, FaChalkboardTeacher } from "react-icons/fa";
import { TbLego } from "react-icons/tb";
import { GiLaptop } from "react-icons/gi";
import { BsHeadsetVr, BsProjector } from "react-icons/bs";
import { MdOutlineVideoSettings } from "react-icons/md";
import ReactCalendar from "react-calendar";
import "../index.css";
import lab3d from "../assets/3dLab.png";
import labCompu from "../assets/compuLab.jpeg";
import labElectro from "../assets/electroLab.jpeg";
import labIos from "../assets/iosLab.jpeg";
import labServer from "../assets/serverlab.jpeg";
import labVr from "../assets/vrLab.jpeg";
import ReservationBanner from './ReservationBanner';
import axiosInstance from "../hooks/axiosInstance";
import { FaCheckCircle } from 'react-icons/fa';
import '../index.css';
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa6";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export const UI = ({ hidden, ...props }) => {

  const initialData = [
    { nombre: 'NOMBRE1', horario: 'HORARIO1' },
    { nombre: 'NOMBRE2', horario: 'HORARIO2' },
    { nombre: 'NOMBRE3', horario: 'HORARIO3' },
    { nombre: 'NOMBRE4', horario: 'HORARIO4' },
    { nombre: 'NOMBRE5', horario: 'HORARIO5' },
    { nombre: 'NOMBRE6', horario: 'HORARIO6' },
    { nombre: 'NOMBRE7', horario: 'HORARIO7' },
    { nombre: 'NOMBRE8', horario: 'HORARIO8' },
  ];

  const cardNames = [
    "PCB Factory",
    "PC Room",
    "Electric Garage",
    "Meeting Room",
    "Lego Room",
    "VR Room",
    "New Horizons",
    "Graveyard",
    "Dimension Forge"
  ];

  const input = useRef();
  const [role, setRole] = useState("ALUMNO");
  const [inputValue, setInputValue] = useState("A0");
  const { chat, message, loading, cameraZoomed, setCameraZoomed } = useReserva();
  const [matriculaValid, setMatriculaValid] = useState(false);
  const [matriculaError, setMatriculaError] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const images = [lab3d, labCompu, labElectro, labIos, labServer, labVr];
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoverIndex, setHoverIndex] = React.useState(null);
  const [showAvatarOnly, setShowAvatarOnly] = useState(false);
  const [reservationCreated, setReservationCreated] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [posterImages, setPosterImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [data, setData] = useState(initialData);
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef(null);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selected, setSelected] = useState({});
  const [selectedLab, setSelectedLab] = useState(null);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [roomImages, setRoomImages] = useState({});
  const [equipmentImages, setEquipmentImages] = useState({});
  const [counts, setCounts] = useState({
    'LEGO': 0,
    'VR Headset': 0,
    'PC': 0,
    'Projector': 0,
    'Whiteboard': 0
  });

  const labToEquipments = {
    "Lego Room": ["LEGO", "PC"],
    "VR Room": ["VR Headset"],
    "PC Room": ["VR Headset"],
    "Meeting Room": ["Whiteboard", "Projector"],
    "Electric Garage": ["Whiteboard", "Projector"],
    "PCB Factory": ["VR Headset"],
    "New Horizons": ["Whiteboard", "Projector"],
    "Graveyard": ["VR Headset"],
    "Dimension Forge": ["LEGO", "PC"]
  };

  useEffect(() => {
    setAvailableEquipments(labToEquipments[selectedLab] || []);
  }, [selectedLab]);

  const incrementCount = () => {
    if (selected) {
      setCounts(prevCounts => ({
        ...prevCounts,
        [selected]: prevCounts[selected] < 10 ? prevCounts[selected] + 1 : prevCounts[selected]
      }));
    }
  };

  const decrementCount = () => {
    if (selected) {
      setCounts(prevCounts => ({
        ...prevCounts,
        [selected]: prevCounts[selected] > 0 ? prevCounts[selected] - 1 : prevCounts[selected]
      }));
    }
  };

  const textToNumber = (text) => {
    const numbers = {
      'un': 1,
      'una': 1,
      'dos': 2,
      'tres': 3,
      'cuatro': 4,
      'cinco': 5,
      'seis': 6,
      'siete': 7,
      'ocho': 8,
      'nueve': 9,
      'diez': 10
    };
    const number = parseInt(text);
    return isNaN(number) ? numbers[text.toLowerCase()] || 0 : number;
  };

  useEffect(() => {
    if (!selectedLab) {
      // console.error("No hay una sala seleccionada");
      return;
    }

    const equipmentRegex = /(\d+|[a-záéíóúñ]+) ([a-záéíóúñ]+)/i;
    const match = transcript.toLowerCase().match(equipmentRegex);
    if (match) {
      const quantity = textToNumber(match[1]);
      let equipment = match[2];
      if (['pizarrón', 'pizarrones'].includes(equipment)) {
        equipment = 'Whiteboard';
      } else if (['proyector', 'proyectores'].includes(equipment)) {
        equipment = 'Projector';
      } else if (['lego', 'legos'].includes(equipment)) {
        equipment = 'LEGO';
      } else if (['lente', 'lentes'].includes(equipment)) {
        equipment = 'VR Headset';
      } else if (['computadora', 'computadoras', 'PC', 'pc'].includes(equipment)) {
        equipment = 'PC';
      }
      if (Object.keys(counts).includes(equipment)) {
        if (labToEquipments[selectedLab].includes(equipment)) {
          setCounts(prevCounts => ({
            ...prevCounts,
            [equipment]: quantity
          }));
        } else {
          // console.error(`El equipo ${equipment} no está disponible en la sala seleccionada`);
        }
      } else {
        // console.error(`El equipo ${equipment} no está disponible`);
      }
    }
  }, [transcript, selectedLab]);

  const times = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hour = i < 10 ? `0${i}` : i;
      const minute = j === 0 ? "00" : j;
      times.push(`${hour}:${minute}`);
    }
  }

  const convertTo12hr = (time) => {
    if (typeof time === 'object') {
      time = JSON.stringify(time);
    }
    if (typeof time !== 'string') {
      // console.error(`Invalid time format. Expected a string but received ${typeof time}.`);
      return "";
    }
    if (!time) return "";
    let [hours, minutes] = time.split(':');
    let period = +hours < 12 ? 'AM' : 'PM';
    hours = +hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  const convertTo24HourFormat = (time) => {
    if (Array.isArray(time)) {
      time = time[0];
    }
    if (typeof time === 'object') {
      time = JSON.stringify(time);
    }
    if (!time) return null;
    let match = time.match(/(\d{1,2})(?::(\d{2}))?\s*(a\.?\s*m\.?|p\.?\s*m\.?)/i);
    if (!match) return null;
    let [_, hour, minutes, period] = match;
    hour = parseInt(hour);
    minutes = minutes ? minutes : '00';
    if (period.toLowerCase().replace(/\./g, '') === 'pm' && hour !== 12) hour += 12;
    if (period.toLowerCase().replace(/\./g, '') === 'am' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  useEffect(() => {
    const timeRegex = /de las (\d{1,2}(?::\d{2})?\s*(a\.?\s*m\.?|p\.?\s*m\.?)) a las (\d{1,2}(?::\d{2})?\s*(a\.?\s*m\.?|p\.?\s*m\.?))/i;
    const match = transcript.match(timeRegex);
    if (match) {
      let startTime = convertTo24HourFormat(match[1]);
      let endTime = convertTo24HourFormat(match[3]);
      if (times.includes(startTime) && times.includes(endTime)) {
        setStartTime(startTime);
        setEndTime(endTime);
        selectTime({ start: startTime, end: endTime });
        setTimeout(() => {
          handleQuestionClick(currentQuestionIndex + 1);
        }, 2000);
      } else {
        let unavailableTimes = [];
        if (!times.includes(startTime)) unavailableTimes.push(startTime);
        if (!times.includes(endTime)) unavailableTimes.push(endTime);
        // console.error(`Los horarios ${unavailableTimes.join(' y ')} no están disponibles`);
      }
    }
  }, [transcript]);

  const mandarMatricula = (e) => {
    e.preventDefault();
    if (inputValue !== "A00830223" && inputValue !== "0005723140") {
      setMatriculaError(true);
    } else {
      setMatriculaError(false);
      setMatriculaValid(true);
      setButtonVisible(false);
    }
  };

  useEffect(() => {
    const matriculaRegex = /a00830223/i;
    const processedTranscript = transcript.replace(/\s+/g, '');
    const match = processedTranscript.match(matriculaRegex);
    if (match) {
      let matricula = match[0];
      matricula = matricula.charAt(0).toUpperCase() + matricula.slice(1);
      setInputValue(matricula);
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.click();
        }
      }, 2000);
    }
  }, [transcript]);

  useEffect(() => {
    const dateRegex = /(\d{1,2}) de ([a-zA-Z]+) del (\d{4})/;
    const match = transcript.match(dateRegex);
    if (match) {
      const day = parseInt(match[1]);
      const month = match[2];
      const year = parseInt(match[3]);
      const monthNames = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
      const monthIndex = monthNames.indexOf(month.toLowerCase());
      if (monthIndex !== -1) {
        const date = new Date(year, monthIndex, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date >= today) {
          setSelectedDate(date);
          setTimeout(() => {
            handleQuestionClick(currentQuestionIndex + 1);
          }, 2000);
        }
      }
    }
  }, [transcript]);

  useEffect(() => {
    const cardNamesRegex = new RegExp(cardNames.join("|"), "i");
    const match = transcript.match(cardNamesRegex);
    if (match) {
      const selectedCardName = match[0];
      const index = cardNames.findIndex(cardName => cardName.toLowerCase() === selectedCardName.toLowerCase());
      if (index !== -1) {
        setSelectedCard(index);
        setSelectedRoomId(roomIds[cardNames[index]]);
        setSelectedLab(cardNames[index]);
        setCounts({
          'LEGO': 0,
          'VR Headset': 0,
          'PC': 0,
          'Projector': 0,
          'Whiteboard': 0
        });
      }
    }
  }, [transcript, cardNames]);

  const startListeningHandler = () => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: false, autoStop: true });
    }
  };

  const stopListeningHandler = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
      setIsClicked(false);
    }
  }, [listening]);

  useEffect(() => {
    return () => {
      stopListeningHandler();
    };
  }, [stopListeningHandler]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Lo siento, tu navegador no soporta reconocimiento de voz.</p>
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const firstItem = prevData[0];
        return [...prevData.slice(1), firstItem];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axiosInstance.get("/reservations/")
      .then(response => {
        if (Array.isArray(response.data.data)) {
          const reservations = response.data.data.map(reservation => {
            const name = reservation.user.name;
            const time = `${new Date(reservation.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(reservation.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            // console.log(`Nombre: ${name}, Horario: ${time}`);

            return { name, time };
          });
          setReservations(reservations);
        } else {
          throw new Error('La respuesta no es un array.');
        }
      })
      .catch(error => {
        // console.error('Error fetching reservations:', error);
      });
  }, []);

  useEffect(() => {
    axiosInstance.get('/posts/')
      .then(response => {
        // console.log('API response:', response.data);
        if (Array.isArray(response.data.data)) {
          const images = response.data.data.filter(post => post.visible).map(post => ({
            file: post.file
          }));
          // console.log('Formatted images:', images);
          setPosterImages(images);
          setError(null);
        } else {
          throw new Error('Error');
        }
      })
      .catch(error => {
        // console.error('Error imagenes:', error);
        setError('Error al cargar las imágenes.');
      });
  }, []);

  useEffect(() => {
    axiosInstance.get('/rooms/')
      .then(response => {
        if (Array.isArray(response.data.data)) {
          const images = {};
          response.data.data.forEach(room => {
            images[room.name] = room.image;
          });
          setRoomImages(images);
          console.log('Todas las salas ya se les asignó su imagen.');
          setError(null);
        } else {
          throw new Error('Error');
        }
      })
      .catch(error => {
        setError('Error al cargar las imágenes de las salas.');
      });
  }, []);

  const roomIds = {
    "Lego Room": "6614aaed6d294f5d44008698",
    "VR Room": "6614aaed6d294f5d44008699",
    "PC Room": "6614aaed6d294f5d4400869a",
    "Electric Garage": "6635064964d1e813a40d1d41",
    "PCB Factory": "6635064964d1e813a40d1d44",
    "Meeting Room": "6614aaed6d294f5d4400869b",
    "New Horizons": "6635064964d1e813a40d1d45",
    "Graveyard": "6635064964d1e813a40d1d46",
    "Dimension Forge": "6635064964d1e813a40d1d47"
  };

  useEffect(() => {
    const equipmentIds = {
      "LEGO": "6614aaed6d294f5d4400869c",
      "VR Headset": "6614aaed6d294f5d4400869d",
      "PC": "6614aaed6d294f5d4400869e",
      "Projector": "6614aaed6d294f5d4400869f",
      "Whiteboard": "6614aaed6d294f5d4400869g",
    };

    axiosInstance.get('/equipment/')
      .then(response => {
        if (Array.isArray(response.data.data)) {
          const images = {};
          response.data.data.forEach(equipment => {
            const equipmentName = equipment.name.toUpperCase();
            if (Object.keys(equipmentIds).map(key => key.toUpperCase()).includes(equipmentName)) {
              images[equipment.name] = equipment.image;
              console.log(`El equipo ${equipment.name} tiene la imagen ${equipment.image}`);
            }
          });
          setEquipmentImages(images);
          setError(null);

          // Imprimir mensajes de asignación de imágenes
          Object.keys(images).forEach(equipment => {
            console.log(`A ${equipment} se le ha asignado una imagen.`);
          });

          // Imprimir el objeto equipmentImages completo
          console.log('equipmentImages:', images);
        } else {
          throw new Error('Error');
        }
      })
      .catch(error => {
        setError('Error al cargar las imágenes de los equipos.');
      });
  }, []);

  const teamIcons = {
    'LEGO': <TbLego />,
    'VR Headset': <BsHeadsetVr />,
    'PC': <GiLaptop />,
    'Projector': <BsProjector />,
    'Whiteboard': <FaChalkboardTeacher />
  };

  const equipmentIds = {
    "LEGO": "6614aaed6d294f5d4400869c",
    "VR Headset": "6614aaed6d294f5d4400869d",
    "PC": "6614aaed6d294f5d4400869e",
    "Projector": "6614aaed6d294f5d4400869f",
    "Whiteboard": "6614aaed6d294f5d4400869g",
  };

  const handleCreateReservation = async () => {
    if (!selectedRoomId) {
      alert("Por favor, selecciona una sala antes de crear la reserva.");
      return;
    }

    const startDate = new Date(selectedDate);
    const [startHours, startMinutes] = startTime.split(':');
    startDate.setHours(startHours, startMinutes);

    const endDate = new Date(selectedDate);
    const [endHours, endMinutes] = endTime.split(':');
    endDate.setHours(endHours, endMinutes);

    const reservedEquipment = Object.entries(counts)
      .filter(([equipment, count]) => count > 1)
      .map(([equipment]) => equipmentIds[equipment]);

    const payload = {
      room_id: selectedRoomId,
      start_date: startDate.toISOString().slice(0, 16).replace('T', ' '),
      end_date: endDate.toISOString().slice(0, 16).replace('T', ' '),
      reserved_equipment: reservedEquipment,
      comments: "",
      status: "6614aaed6d294f5d44008695"
    }

    console.log(payload);

    try {
      await axiosInstance.post('/reservations/', payload);
      alert("¡Reservacion creada con exito!");
      setReservationCreated(true);
      setIsVisible(true);
    } catch (error) {
      // console.error(error.response || error);
      alert(error);
    }
  };

  const toggleSelectNew = (newSelection) => {
    setSelected(newSelection);
  };

  React.useEffect(() => {
    if (selectedCard !== null) {
      input.current.value = "Laboratorio " + cardNames[selectedCard];
      sendMessage();
      setTimeout(() => {
        handleQuestionClick(currentQuestionIndex + 1);
      }, 2000);
    }
  }, [selectedCard]);

  useEffect(() => {
    if (!isButtonVisible) {
      input.current.value = "iniciar reservacion";
      sendMessage();
    }
  }, [isButtonVisible]);

  const handleDropdownChange = (e) => {
    setRole(e.target.value);
    setInputValue(e.target.value === "ALUMNO" ? "A0" : "L0");
  };

  const questions = [
    "Fecha",
    "Laboratorios",
    "Horario",
    "Equipos",
  ];

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const selectTime = (time) => {
    if (!startTime || (startTime && endTime)) {
      setStartTime(time);
      setEndTime("");
    } else if (time > startTime && getDifferenceInHours(startTime, time) < 2) {
      const endTime = addThirtyMinutes(time);
      setEndTime(endTime);
      const formattedTime = `${startTime} - ${endTime}`;
      input.current.value = formattedTime;
      sendMessage();
      handleQuestionClick(currentQuestionIndex + 1);
    }
  };

  const getDifferenceInHours = (startTime, endTime) => {
    const start = new Date(`01/01/2007 ${startTime}`);
    const end = new Date(`01/01/2007 ${endTime}`);
    let diff = end - start;
    let diffInHours = diff / 1000 / 60 / 60;
    return diffInHours;
  };

  const addThirtyMinutes = (time) => {
    const [hour, minutes] = time.split(":");
    let newHour = parseInt(hour);
    let newMinutes = parseInt(minutes);

    newMinutes += 29;
    if (newMinutes >= 60) {
      newHour += 1;
      newMinutes = 0;
    }

    return `${newHour < 10 ? "0" + newHour : newHour}:${newMinutes < 10 ? "0" + newMinutes : newMinutes
      }`;
  };

  const handleMouseEnter = (index) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const handleButtonClick = () => {
    setShowAvatarOnly(!showAvatarOnly);
  };

  useEffect(() => {
    if (posterImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % posterImages.length);
    }, 8000);

    return () => {
      clearInterval(timer);
    };
  }, [posterImages.length]);


  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };
  if (hidden) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-center w-full h-full">
      {!showAvatarOnly ? (
        <>
          <div className="flex flex-col items-start justify-start w-2/5 h-full">
            <div className="flex items-start justify-start w-full h-1/6">
              {isButtonVisible && (
                <div className="w-2/12 h-full">
                  <button
                    onClick={() => {
                      handleButtonClick();
                      setCameraZoomed(!cameraZoomed);
                    }}
                    className="flex w-6/12 h-2/6 items-center justify-center pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white rounded-md mt-2 ml-2"
                  >
                    <MdOutlineVideoSettings />
                  </button>
                </div>
              )}
              {!isButtonVisible && (
                <div className={`${isVisible ? "flex" : "hidden"} items-center justify-center w-full h-full`}>
                  <input
                    className={` w-7/12 h-2/6 placeholder:text-gray-800 placeholder:italic p-4 rounded-l-md bg-opacity-50 bg-white backdrop-blur-md`}
                    placeholder="Escribe..."
                    ref={input}
                    onKeyDown={(e) => { if (e.key === "Enter") { sendMessage(); } }}
                  />
                  <button
                    onClick={sendMessage}
                    className={` w-2/12 h-2/6 bg-blue-500 hover:bg-blue-600 text-white font-semibold uppercase rounded-r-md ${loading || message ? "cursor-not-allowed" : ""}`}
                  >
                    Enviar
                  </button>
                </div>
              )}
            </div>
            <div className="flex w-full h-3/6">
            </div>
            <div className={`flex flex-col items-center justify-center w-full h-2/6`}>
              <div className="flex flex-col items-center justify-end w-full h-4/6">
                {transcript && (
                  <>
                    <div className="flex px-4 py-2 mx-16 rounded-2xl bg-black bg-opacity-40 text-white items-center justify-center">{transcript}</div>
                    <div className="flex w-1/12 h-1/6 bg-black bg-opacity-40" style={{ clipPath: 'polygon(50% 100%, 20% 0%, 80% 0%)' }}></div>
                  </>
                )}
              </div>
              <div className="flex items-start justify-center w-full h-2/6">
                <div className="flex w-1/12 h-3/6">
                  <button
                    onClick={() => {
                      setIsClicked(true);
                      startListeningHandler();
                    }}
                    className={`flex w-full h-full bg-blue-500 text-white items-center justify-center rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 ${isClicked ? 'animate-pulse' : ''}`}
                  >
                    <div className="w-5/12 h-2/6">
                      {isClicked ? <FaMicrophone className="w-full h-full" /> : <FaMicrophoneSlash className="w-full h-full" />}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {!matriculaValid ? (
            <div className="flex flex-col items-center justify-center w-3/5">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#10069f",
                  width: "66.7%",
                  height: "15%",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              >
                <img
                  src={`/logoITESM.png`}
                  alt="Logo ITESM"
                  style={{
                    objectFit: "contain",
                    width: "50%",
                    height: "50%",
                  }}
                />
              </div>
              <div className="flex flex-col items-center justify-center text-xl pointer-events-auto w-4/6 h-2/6 mx-auto bg-opacity-50 bg-white backdrop-blur-md rounded-b">
                <div className="mb-8">
                  <label>Login para </label>
                  <select
                    onChange={handleDropdownChange}
                    className="border border-black first-line:text-black bg-transparent p-1 rounded-md"
                  >
                    <option value="ALUMNO">Alumnos</option>
                    <option value="DOCENTE">Docentes</option>
                  </select>
                </div>
                <div className="w-2/5 flex flex-col items-center">
                  <form
                    onSubmit={mandarMatricula}
                    className="flex items-center justify-between"
                  >
                    <input
                      className="placeholder:text-gray-800 placeholder:italic p-4"
                      value={inputValue}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                        }
                      }}
                      onChange={(e) => {
                        if (
                          role === "ALUMNO" &&
                          !e.target.value.startsWith("A0")
                        ) {
                          setInputValue("A0" + e.target.value.slice(2));
                        } else if (
                          role === "DOCENTE" &&
                          !e.target.value.startsWith("L0")
                        ) {
                          setInputValue("L0" + e.target.value.slice(2));
                        } else {
                          setInputValue(e.target.value);
                        }
                      }}
                    />
                    <button ref={buttonRef} className="bg-blue-500 hover:bg-blue-600 text-white w-14 h-full flex items-center justify-center">
                      <FaCheck />
                    </button>
                  </form>
                  {matriculaError && (
                    <p className="text-red-500">No existe esa matricula</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center w-3/5 h-full">
              <div className="w-3/12 h-5/6 flex flex-col justify-center items-center bg-[#10069f] relative rounded-l-md">
                {selectedDate && (
                  <div className="h-full w-full flex flex-col items-center text-white ">
                    <div className="h-3/5 w-11/12 flex flex-col items-center justify-center">
                      <span className="text-4xl uppercase">
                        {selectedDate.toLocaleString("es", { weekday: "long" })}
                      </span>
                      <span className="text-9xl">{selectedDate.getDate()}</span>
                      <span className="text-2xl uppercase">
                        {selectedDate.toLocaleString("es", { month: "long" })}
                      </span>
                    </div>
                    <div className="h-2/6 w-10/12">
                      <span className="flex h-1/5 items-center text-base underline uppercase font-bold">
                        Especificaciones :
                      </span>
                      <div className="flex flex-col justify-start h-3/5">
                        <ul className="list-disc list-inside">
                          <li>{cardNames[selectedCard] ? cardNames[selectedCard] : "Sin sala"}</li>
                          <li>
                            {startTime || endTime
                              ? `${startTime ? ` ${convertTo12hr(startTime)}` : ""} ${endTime ? `- ${convertTo12hr(endTime)}` : ""}`
                              : "Sin horario"
                            }
                          </li>
                          {Object.values(counts).some(count => count > 0) && (
                            <>
                              <li className="list-disc">Equipo seleccionado:</li>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                {Object.entries(counts).map(([team, count]) =>
                                  count > 0 ? (
                                    <div key={team} style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', width: '100%' }}>
                                      {teamIcons[team]} <span style={{ marginLeft: '5px' }}>x {count}</span>
                                    </div>
                                  ) : null
                                )}
                              </div>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white w-11/12 flex items-center justify-center text-2xl uppercase rounded-md"
                      onClick={handleCreateReservation}
                    >
                      reservar
                    </button>
                  </div>
                )}
              </div>
              <div className="border border-blue-800 flex flex-col items-center justify-center w-8/12 h-5/6 bg-opacity-50 bg-white backdrop-blur-md rounded-r-md">
                {reservationCreated ? (
                  <div className="w-full h-full flex flex-col justify-center items-center">
                    <FaCheckCircle className="checkmark-animation" size={50} color="blue" />
                    <h1 className="text-animation">RESERVACIÓN CREADA CON ÉXITO</h1>
                  </div>
                ) : (
                  <>
                    <div className="w-full h-full flex justify-center items-center">
                      {(() => {
                        switch (questions[currentQuestionIndex]) {
                          case "Fecha":
                            return (
                              <ReactCalendar
                                className="react-calendar"
                                locale="es-ES"
                                minDate={new Date()}
                                onChange={(date) => {
                                  setSelectedDate(date);
                                  setTimeout(() => {
                                    handleQuestionClick(currentQuestionIndex + 1);
                                  }, 2000);
                                  const formattedDate = date.toLocaleDateString('en-GB');
                                  input.current.value = formattedDate;
                                  sendMessage();
                                }}
                                value={selectedDate}
                                formatShortWeekday={(locale, date) => {
                                  let weekday = date.toLocaleString(locale, {
                                    weekday: "long",
                                  });
                                  weekday =
                                    weekday.charAt(0).toUpperCase() +
                                    weekday.slice(1);
                                  return weekday;
                                }}
                                formatMonthYear={(locale, date) => {
                                  let monthYear = date.toLocaleString(locale, {
                                    month: "long",
                                    year: "numeric",
                                  });
                                  monthYear =
                                    monthYear.charAt(0).toUpperCase() +
                                    monthYear.slice(1);
                                  return monthYear;
                                }}
                              />
                            );
                          case "Laboratorios":
                            return (
                              <div className="w-11/12 h-5/6 grid grid-cols-3 gap-4">
                                {cardNames.map((name, index) => (
                                  <div
                                    key={index}
                                    className={`relative bg-cover bg-center text-center flex w-auto h-auto items-center justify-center rounded-md transform transition duration-500 ease-in-out ${selectedCard === index ? 'scale-110 border-4 border-fuchsia-500' : ''}`}
                                    style={roomImages[name] ? { backgroundImage: `url(${roomImages[name]})` } : {}}
                                    onClick={() => {
                                      setSelectedCard(index);
                                      if (roomIds.hasOwnProperty(name)) {
                                        setSelectedRoomId(roomIds[name]);
                                      } else {
                                        // console.error(`No room ID found for ${name}`);
                                      }
                                      setSelectedLab(name);
                                      setCounts({
                                        'LEGO': 0,
                                        'VR Headset': 0,
                                        'PC': 0,
                                        'Projector': 0,
                                        'Whiteboard': 0
                                      });
                                    }}
                                  >
                                    <div className="absolute bottom-0 w-full flex items-center justify-center bg-blue-600 text-white rounded-b">{name}</div>
                                    {!roomImages[name] && <div className="absolute inset-0 flex items-center justify-center text-lg text-gray-500">Imagen no disponible</div>}
                                  </div>
                                ))}
                              </div>
                            );
                          case "Horario":
                            return (
                              <div className="w-11/12 h-5/6 grid grid-cols-4 gap-2">
                                {times.map((time, index) => {
                                  let [hours, minutes] = time.split(':');
                                  let period = +hours < 12 ? 'AM' : 'PM';
                                  hours = +hours % 12 || 12;
                                  let time12hr = `${hours}:${minutes} ${period}`;
                                  return (
                                    <button
                                      key={index}
                                      className={`p-1 ${time === startTime ||
                                        time === endTime ||
                                        (startTime && endTime && time > startTime && time < endTime)
                                        ? "bg-blue-500 text-white rounded-md"
                                        : "bg-gray-300 rounded-md hover:bg-blue-500 hover:text-white"
                                        }`}
                                      onClick={() => {
                                        if ((!startTime || time === startTime) || (startTime && endTime)) {
                                          setStartTime(time);
                                          setEndTime(null);
                                        } else if (!endTime || time === endTime) {
                                          setEndTime(time);
                                          if (time !== startTime) {
                                            setTimeout(() => {
                                              handleQuestionClick(currentQuestionIndex + 1);
                                            }, 2000);
                                          }
                                        }
                                        selectTime(time);
                                      }}
                                      disabled={startTime && !endTime && time < startTime}
                                    >
                                      {time12hr}
                                    </button>
                                  );
                                })}
                              </div>
                            );
                          case "Equipos":
                            return (
                              <div className="w-full h-full flex flex-col items-center justify-center">
                                <div className="flex justify-center items-center w-full h-2/6">
                                  <div className="flex justify-center items-center h-full w-4/12">
                                    <div
                                      className={`flex flex-col justify-center items-center h-4/6 w-7/12 rounded-xl ${selected === 'LEGO' ? 'border-fuchsia-500 border-4' : (!availableEquipments.includes('LEGO') ? 'border-red-500 border-4' : 'border-blue-500 border-4')}`}
                                      onClick={() => availableEquipments.includes('LEGO') && setSelected('LEGO')}
                                      style={equipmentImages['Lego'] ? { backgroundImage: `url(${equipmentImages['Lego']})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}}
                                    >
                                      {!equipmentImages['Lego'] && <TbLego style={{ fontSize: '5em', color: selected === 'LEGO' ? 'white' : 'black' }} />}
                                      <div style={{ marginTop: 'auto', backgroundColor: selected === 'LEGO' ? 'fuchsia' : (!availableEquipments.includes('LEGO') ? 'red' : 'blue'), width: '100%', padding: '2% 0', display: 'flex', justifyContent: 'center', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
                                        <span style={{ color: 'white' }}>Lego</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-around items-center w-full h-2/6">
                                  <div className="flex justify-center items-center h-full w-4/12">
                                    <div
                                      className={`flex flex-col justify-center items-center h-4/6 w-7/12 rounded-xl ${selected === 'VR Headset' ? 'border-fuchsia-500 border-4' : (!labToEquipments[selectedLab]?.includes('VR Headset') ? 'border-red-500 border-4' : 'border-blue-500 border-4')}`}
                                      onClick={() => labToEquipments[selectedLab]?.includes('VR Headset') && toggleSelectNew('VR Headset')}
                                      style={equipmentImages['VR Headset'] ? { backgroundImage: `url(${equipmentImages['VR Headset']})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}}
                                    >
                                      {!equipmentImages['VR Headset'] && <BsHeadsetVr style={{ fontSize: '5em', color: selected === 'VR Headset' ? 'white' : 'black' }} />}
                                      <div style={{ marginTop: 'auto', backgroundColor: selected === 'VR Headset' ? 'fuchsia' : (!labToEquipments[selectedLab]?.includes('VR Headset') ? 'red' : 'blue'), width: '100%', padding: '2% 0', display: 'flex', justifyContent: 'center', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
                                        <span style={{ color: 'white' }}>VR Headset</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="h-full w-4/12 flex flex-col items-center justify-center p-4 rounded-lg">
                                    <p className="text-2xl font-bold mb-4">{counts[selected] || 0}</p>
                                    <div>
                                      <button className="bg-green-500 text-white text-2xl px-4 py-2 rounded-xl mr-2" onClick={incrementCount}>+</button>
                                      <button className="bg-red-500 text-white text-2xl px-4 py-2 rounded-xl" onClick={decrementCount}>-</button>
                                    </div>
                                  </div>
                                  <div className="flex justify-center items-center h-full w-4/12">
                                    <div
                                      className={`flex flex-col justify-center items-center h-4/6 w-7/12 rounded-xl ${selected === 'PC' ? 'border-fuchsia-500 border-4' : (!labToEquipments[selectedLab]?.includes('PC') ? 'border-red-500 border-4' : 'border-blue-500 border-4')}`}
                                      onClick={() => labToEquipments[selectedLab]?.includes('PC') && toggleSelectNew('PC')}
                                      style={equipmentImages['PC'] ? { backgroundImage: `url(${equipmentImages['PC']})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}}
                                    >
                                      {!equipmentImages['PC'] && <GiLaptop style={{ fontSize: '5em', color: selected === 'PC' ? 'white' : 'black' }} />}
                                      <div style={{ marginTop: 'auto', backgroundColor: selected === 'PC' ? 'fuchsia' : (!labToEquipments[selectedLab]?.includes('PC') ? 'red' : 'blue'), width: '100%', padding: '2% 0', display: 'flex', justifyContent: 'center', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
                                        <span style={{ color: 'white' }}>PC</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-stretch items-center w-full h-2/6">
                                  <div className="flex justify-end items-center h-full w-5/12">
                                    <div
                                      className={`flex flex-col justify-center items-center h-4/6 w-6/12 rounded-xl ${selected === 'Projector' ? 'border-fuchsia-500 border-4' : (!labToEquipments[selectedLab]?.includes('Projector') ? 'border-red-500 border-4' : 'border-blue-500 border-4')}`}
                                      onClick={() => labToEquipments[selectedLab]?.includes('Projector') && toggleSelectNew('Projector')}
                                      style={equipmentImages['Projector'] ? { backgroundImage: `url(${equipmentImages['Projector']})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}}
                                    >
                                      {!equipmentImages['Projector'] && <BsProjector style={{ fontSize: '5em', color: selected === 'Projector' ? 'white' : 'black' }} />}
                                      <div style={{ marginTop: 'auto', backgroundColor: selected === 'Projector' ? 'fuchsia' : (!labToEquipments[selectedLab]?.includes('Projector') ? 'red' : 'blue'), width: '100%', padding: '2% 0', display: 'flex', justifyContent: 'center', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
                                        <span style={{ color: 'white' }}>Projector</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="h-full w-2/12"></div>
                                  <div className="flex justify-start items-center h-full w-5/12">
                                    <div
                                      className={`flex flex-col justify-center items-center h-4/6 w-6/12 rounded-xl ${selected === 'Whiteboard' ? 'border-fuchsia-500 border-4' : (!labToEquipments[selectedLab]?.includes('Whiteboard') ? 'border-red-500 border-4' : 'border-blue-500 border-4')}`}
                                      onClick={() => labToEquipments[selectedLab]?.includes('Whiteboard') && toggleSelectNew('Whiteboard')}
                                      style={equipmentImages['Whiteboard'] ? { backgroundImage: `url(${equipmentImages['Whiteboard']})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}}
                                    >
                                      {!equipmentImages['Whiteboard'] && <FaChalkboardTeacher style={{ fontSize: '5em', color: selected === 'Whiteboard' ? 'white' : 'black' }} />}
                                      <div style={{ marginTop: 'auto', backgroundColor: selected === 'Whiteboard' ? 'fuchsia' : (!labToEquipments[selectedLab]?.includes('Whiteboard') ? 'red' : 'blue'), width: '100%', padding: '2% 0', display: 'flex', justifyContent: 'center', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
                                        <span style={{ color: 'white' }}>Whiteboard</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                        }
                      })()}
                    </div>
                    <div className="w-full h-1/6 flex items-center justify-center space-x-4">
                      {questions.map((question, index) => (
                        <React.Fragment key={index}>
                          {index !== 0 && <span className="text-gray-500">•</span>}
                          <button
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleQuestionClick(index)}
                            className={`relative text-xl h-4/6 w-auto flex items-center justify-center ${currentQuestionIndex === index ? "text-blue-500" : "text-gray-500"} ${hoverIndex === index ? "hovered" : ""}`}
                          >
                            {question}
                            {currentQuestionIndex === index && <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-2 active-arrow">▼</span>}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ position: 'relative' }} className="flex justify-start w-full h-full">
          <div className="w-8/12 h-full grid grid-cols-1">
            {posterImages.length > 0 && currentImageIndex < posterImages.length ? (
              posterImages[currentImageIndex]?.file ? (
                <div
                  className="bg-cover bg-center"
                  style={{ backgroundImage: `url(${posterImages[currentImageIndex].file})` }}
                >
                </div>
              ) : (
                <div
                  className="bg-white text-black flex items-center justify-center"
                  style={{ height: '100%', width: '100%' }}
                >
                  Error al cargar las imagenes...
                </div>
              )
            ) : (
              <div
                className="bg-white text-black flex items-center justify-center"
                style={{ height: '100%', width: '100%' }}
              >
                No images available.
              </div>
            )}
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0 }} className="flex flex-col justify-center items-center h-full w-6/12">
            <div className="flex w-full h-1/6 relative">
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#014ad1',
                position: 'absolute',
                clipPath: 'polygon(25% 100%, 30% 100%, 35% 0, 30% 0)',
                zIndex: 1
              }}>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                position: 'absolute',
                clipPath: 'polygon(30% 100%, 40% 100%, 45% 0, 35% 0)',
                zIndex: 2
              }}>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#001234',
                position: 'absolute',
                clipPath: 'polygon(40% 100%, 90% 100%, 95% 0, 45% 0)',
                zIndex: 3
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '65%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white'
                }}>
                  <span style={{
                    fontSize: '1vw',
                    color: 'white',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}>Proxima Reservación</span>
                </div>
              </div>
            </div>
            <div className="flex w-full h-2/6">
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#014ad1',
                position: 'relative',
                clipPath: 'polygon(10% 100%, 100% 100%, 100% 0, 20% 0)'
              }}>
                <ReservationBanner />
              </div>
            </div>
            <div className="flex w-full h-3/6 relative">
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#002c7f',
                position: 'absolute',
                clipPath: 'polygon(13.5% 10%, 13.5% 10%, 10% 0, 15% 0)',
                zIndex: 1
              }}>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#014ad1',
                position: 'absolute',
                clipPath: 'polygon(0% 100%, 5% 100%, 20% 0, 15% 0)',
                zIndex: 2
              }}>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                position: 'absolute',
                clipPath: 'polygon(5% 100%, 15% 100%, 30% 0, 20% 0)',
                zIndex: 3
              }}>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#002c7f',
                position: 'absolute',
                clipPath: 'polygon(15% 100%, 65% 100%, 80% 0, 30% 0)',
                zIndex: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div className="flex flex-col items-start justify-center h-full w-full">
                  {data.map((item, index) => (
                    <div key={index} style={{ marginLeft: `${30 - index * 2}%` }} className="animate flex items-center justify-center w-6/12 h-1/6 text-center text-white">
                      <div className="flex h-5/6 w-6/12 items-center justify-center whitespace-nowrap font-bold">{item.nombre}</div>
                      <div className="flex border-l border-white h-3/6 w-6/12 items-center justify-center whitespace-nowrap">{item.horario}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                position: 'absolute',
                clipPath: 'polygon(10% 0%, 79.3% 5%, 80% 0%, 0% 0%)',
                zIndex: 5,
                opacity: 0.5
              }}>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};
