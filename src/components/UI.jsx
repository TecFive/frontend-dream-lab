import { useReserva } from "../hooks/useLAB";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { LuArrowBigRightDash, LuArrowBigLeftDash } from "react-icons/lu";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import ReactCalendar from "react-calendar";
import "../index.css";

export const UI = ({ hidden, ...props }) => {
  const [role, setRole] = useState("ALUMNO");
  const [inputValue, setInputValue] = useState("A0");
  const { cameraZoomed, setCameraZoomed } = useReserva();
  const [matriculaValid, setMatriculaValid] = useState(false);
  const [matriculaError, setMatriculaError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedTime, setSelectedTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleDropdownChange = (e) => {
    setRole(e.target.value);
    setInputValue(e.target.value === "ALUMNO" ? "A0" : "L0");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputValue !== "A00830223") {
      setMatriculaError(true);
    } else {
      setMatriculaError(false);
      setMatriculaValid(true);
    }
  };

  const questions = [
    "Elige la fecha",
    "Elige el horario",
    "¿Cuantas personas?",
    "¿Necesitas algo de lo siguiente?",
  ];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
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
  const currentTime = `${currentHour < 10 ? "0" + currentHour : currentHour}:${
    currentMinute < 30 ? "00" : "30"
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
  
    return `${newHour < 10 ? "0" + newHour : newHour}:${
      newMinutes < 10 ? "0" + newMinutes : newMinutes
    }`;
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-center p-4">
        <div className="w-2/5">
          <button
            onClick={() => setCameraZoomed(!cameraZoomed)}
            className="pointer-events-auto bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-md"
          >
            {cameraZoomed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
                />
              </svg>
            )}
          </button>
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
                    <span className="flex h-1/5 items-center text-lg underline uppercase font-bold">
                      Especificaciones :
                    </span>
                    <div className="flex flex-col justify-center h-3/5">
                      <ul className="list-disc list-inside">
                        <li>Info sala reservada</li>
                        <li>
                          {count} {count === 1 ? "persona" : "personas"}
                        </li>
                        <li>{startTime && ` ${startTime}`} {endTime && `- ${endTime}`}</li>
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
              <div className="w-full h-1/6 flex items-center justify-around">
                <button
                  onClick={handlePrevious}
                  className="h-fullw-1/12 text-blue-500 hover:text-blue-600 text-6xl"
                >
                  <LuArrowBigLeftDash />
                </button>
                <h1 className="text-3xl font-bold h-4/6 w-9/12 flex items-center justify-center">
                  {questions[currentQuestionIndex]}
                </h1>
                <button
                  onClick={handleNext}
                  className="h-full w-1/12 text-blue-500 hover:text-blue-600 text-6xl"
                >
                  <LuArrowBigRightDash />
                </button>
              </div>
              <div className="w-full h-full flex justify-center items-center">
                {(() => {
                  switch (questions[currentQuestionIndex]) {
                    case "Elige la fecha":
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
                    case "Elige el horario":
                      return (
                        <div className="w-11/12 h-5/6 grid grid-cols-4 gap-2">
                          {times.map((time, index) => (
                            <button
                              key={index}
                              className={`p-1 ${
                                time < currentTime
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
                    case "¿Cuantas personas?":
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
                    case "¿Necesitas algo de lo siguiente?":
                      return (
                        <div>
                          <p>Equipos</p>
                        </div>
                      );
                  }
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
