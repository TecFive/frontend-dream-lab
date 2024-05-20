import { useReserva } from "../hooks/useLAB";
import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BsUpcScan } from "react-icons/bs";
import { MdOutlineVideoSettings } from "react-icons/md";
import ReactCalendar from "react-calendar";
import "../index.css";
import lab3d from "../assets/3dLab.png";
import labCompu from "../assets/compuLab.jpeg";
import labElectro from "../assets/electroLab.jpeg";
import labIos from "../assets/iosLab.jpeg";
import labServer from "../assets/serverlab.jpeg";
import labVr from "../assets/vrLab.jpeg";
import Poster1 from "../assets/poster1.png";
import Poster2 from "../assets/poster2.jpeg";
import Poster3 from "../assets/poster3.png";
import Poster4 from "../assets/poster4.png";
import Poster5 from "../assets/poster5.png";
import Poster6 from "../assets/poster6.png";

export const UI = ({ hidden, ...props }) => {
  const [role, setRole] = useState("ALUMNO");
  const [inputValue, setInputValue] = useState("A0");
  const { cameraZoomed, setCameraZoomed } = useReserva();
  const [matriculaValid, setMatriculaValid] = useState(false);
  const [matriculaError, setMatriculaError] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const images = [lab3d, labCompu, labElectro, labIos, labServer, labVr];
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoverIndex, setHoverIndex] = React.useState(null);
  const [showAvatarOnly, setShowAvatarOnly] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const posterImages = [Poster1, Poster2, Poster3, Poster4, Poster5, Poster6];
  const [isScanning, setIsScanning] = useState(false);
  const [rfidInput, setRfidInput] = useState('');
  const [hasInput, setHasInput] = useState(false);

  const cardNames = [
    "Laboratorio de Impresion 3D",
    "Laboratorio de programacion",
    "Laboratorio de Electronica",
    "Laboratorio de iOS",
    "Laboratorio de Servidores",
    "Laboratorio de VR"
  ];

  const handleDropdownChange = (e) => {
    setRole(e.target.value);
    setInputValue(e.target.value === "ALUMNO" ? "A0" : "L0");
  };

  const questions = [
    "Fecha",
    "Horario",
    "Aforo",
    "Laboratorios",
  ];

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const times = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hour = i < 10 ? `0${i}` : i;
      const minute = j === 0 ? "00" : j;
      times.push(`${hour}:${minute}`);
    }
  }

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentTime = `${currentHour < 10 ? "0" + currentHour : currentHour}:${currentMinute < 30 ? "00" : "30"
    }`;

  const selectTime = (time) => {
    if (!startTime || (startTime && endTime)) {
      setStartTime(time);
      setEndTime("");
    } else if (time > startTime && getDifferenceInHours(startTime, time) < 2) {
      const endTime = addThirtyMinutes(time);
      setEndTime(endTime);
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
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);

    return () => {
      clearInterval(timer);
    };
  }, [images]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputValue !== "A00830223" && inputValue !== "0005723140") {
      setMatriculaError(true);
    } else {
      setMatriculaError(false);
      setMatriculaValid(true);
      setButtonVisible(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-center w-full h-full">
      {!showAvatarOnly ? (
        <>
          <div className="flex items-start justify-start w-2/5 h-1/6">
            {isButtonVisible && (
              <button
                onClick={() => {
                  handleButtonClick();
                  setCameraZoomed(!cameraZoomed);
                }}
                className="flex w-1/12 h-2/6 items-center justify-center pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white rounded-md mt-2 ml-2"
              >
                <MdOutlineVideoSettings />
              </button>
            )}
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
                {isScanning ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-black">Escaneando</p>
                    <div className="flex space-x-2">
                      <div className="animate-ping h-3 w-3 bg-blue-500 rounded-full"></div>
                      <div className="animate-ping delay-150 h-3 w-3 bg-blue-500 rounded-full"></div>
                      <div className="animate-ping delay-300 h-3 w-3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <label>Login para </label>
                      <select
                        onChange={handleDropdownChange}
                        className="text-black bg-transparent border border-black p-1 rounded-md"
                      >
                        <option value="ALUMNO">Alumnos</option>
                        <option value="DOCENTE">Docentes</option>
                      </select>
                    </div>
                    <div className="w-2/5 flex flex-col items-center">
                      <form
                        onSubmit={handleFormSubmit}
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
                        <button className="bg-blue-500 hover:bg-blue-600 text-white w-14 h-full flex items-center justify-center">
                          <FaCheck />
                        </button>
                      </form>
                      {matriculaError && (
                        <p className="text-red-500">No existe esa matricula</p>
                      )}
                    </div>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mt-5"
                      onClick={() => setIsScanning(true)}
                    >
                      <BsUpcScan />
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center w-3/5 h-full">
              <div className="w-3/12 h-5/6 flex flex-col justify-center items-center bg-[#10069f] relative">
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
                      <div className="flex flex-col justify-center h-3/5">
                        <ul className="list-disc list-inside">
                          <li>{cardNames[selectedCard] ? cardNames[selectedCard] : "Ninguna sala seleccionada"}</li>
                          <li>
                            {count} {count === 1 ? "persona" : "personas"}
                          </li>
                          <li>{startTime || endTime ? `${startTime ? ` ${startTime}` : ""} ${endTime ? `- ${endTime}` : ""}` : "Sin horario"}</li>
                        </ul>
                      </div>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white w-11/12 flex items-center justify-center text-2xl uppercase rounded-md">
                      Confirmar
                    </button>
                  </div>
                )}
              </div>
              <div className="border border-blue-800 flex flex-col items-center justify-center w-8/12 h-5/6 bg-opacity-50 bg-white backdrop-blur-md">
                <div className="w-full h-full flex justify-center items-center">
                  {(() => {
                    switch (questions[currentQuestionIndex]) {
                      case "Fecha":
                        return (
                          <ReactCalendar
                            className="react-calendar"
                            locale="es-ES"
                            minDate={new Date()}
                            onChange={setSelectedDate}
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
                      case "Horario":
                        return (
                          <div className="w-11/12 h-5/6 grid grid-cols-4 gap-2">
                            {times.map((time, index) => (
                              <button
                                key={index}
                                className={`p-1 ${time < currentTime
                                  ? "bg-gray-500 text-white"
                                  : time === startTime ||
                                    time === endTime ||
                                    (startTime &&
                                      endTime &&
                                      time > startTime &&
                                      time < endTime)
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300"
                                  }`}
                                onClick={() =>
                                  time >= currentTime && selectTime(time)
                                }
                                disabled={time < currentTime}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        );
                      case "Aforo":
                        return (
                          <div className="flex w-full h-full items-center justify-center">
                            <button
                              className="text-7xl"
                              onClick={() =>
                                count < 10 ? setCount(count + 1) : null
                              }
                            >
                              <IoIosArrowUp />
                            </button>
                            <input
                              className="w-4/12 h-2/6 flex text-center text-7xl bg-transparent border-t-8 border-b-8 border-black"
                              type="text"
                              value={count}
                              readOnly
                            />
                            <button
                              className="text-7xl"
                              onClick={() =>
                                count > 1 ? setCount(count - 1) : null
                              }
                            >
                              <IoIosArrowDown />
                            </button>
                          </div>
                        );
                      case "Laboratorios":
                        return (
                          <div className="w-11/12 h-5/6 grid grid-cols-2 gap-4">
                            {images.map((image, index) => (
                              <div
                                key={index}
                                className="relative bg-cover bg-center text-center flex w-auto h-auto items-center justify-center"
                                style={{ backgroundImage: `url(${image})` }}
                                onClick={() => setSelectedCard(selectedCard === index ? null : index)}
                              >
                                {selectedCard === index && <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">{cardNames[index]}</div>}
                              </div>
                            ))}
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
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ position: 'relative' }} className="flex justify-start w-full h-full">
          <div className="w-8/12 h-full grid grid-cols-1">
            <div
              className="bg-cover bg-center"
              style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
            >
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0 }} className="flex flex-col justify-center items-center h-full w-8/12">
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
                    fontSize: '1.5em',
                    color: 'white',
                    fontWeight: 'bold'
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
                clipPath: 'polygon(10% 100%, 100% 100%, 100% 0, 20% 0)',
                border: '0.1px solid black',
              }}>
                <div className="border border-black flex items-center justify-end w-full h-full">
                  <div className="flex flex-col w-5/12 h-5/6 mr-2">
                    <div className="flex items-baseline justify-end h-3/6">
                      <span style={{
                        fontSize: '4em',
                        color: 'white',
                        fontWeight: 'bold'
                      }}>Jose Oliva</span>
                    </div>
                    <div className="items-start justify-end flex h-3/6">
                      <span style={{
                        fontSize: '2.5em',
                        color: '#00FFF7',
                        fontWeight: 'bold'
                      }}>Lego Room</span>
                    </div>
                  </div>
                  <div className="border-l border-white flex flex-col items-center justify-center w-4/12 h-4/6 ml-2 mr-4">
                    <label style={{
                      fontSize: '2em',
                      fontFamily: 'Arial, sans-serif',
                      color: 'white'
                    }}>8:30 PM - 10:30 PM</label>
                  </div>
                </div>
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
                backgroundImage: `url(${posterImages[currentImageIndex]})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                position: 'absolute',
                clipPath: 'polygon(15% 100%, 65% 100%, 80% 0, 30% 0)',
                zIndex: 4
              }}>
              </div>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                position: 'absolute',
                clipPath: 'polygon(10% 0%, 77.8% 15%, 80% 0%, 0% 0%)',
                zIndex: 5,
                opacity: 0.5
              }}>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
