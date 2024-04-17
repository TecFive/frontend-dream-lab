import { useReserva } from "../hooks/useLAB";
import React, { useState } from 'react';
import { FaCheck } from "react-icons/fa";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';

export const UI = ({ hidden, ...props }) => {
  const [role, setRole] = useState('ALUMNO');
  const [inputValue, setInputValue] = useState('A0');
  const { cameraZoomed, setCameraZoomed } = useReserva();
  const [matriculaValid, setMatriculaValid] = useState(false);
  const [matriculaError, setMatriculaError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDropdownChange = (e) => {
    setRole(e.target.value);
    setInputValue(e.target.value === 'ALUMNO' ? 'A0' : 'L0');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputValue !== 'A00830223') {
      setMatriculaError(true);
    } else {
      setMatriculaError(false);
      setMatriculaValid(true);
    }
  }

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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#10069f',
                width: '66.7%',
                height: '15%',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px'
              }}
            >
              <img 
                src={`/logoITESM.png`} 
                alt="Logo ITESM" 
                style={{
                  objectFit: 'contain',
                  width: '50%',
                  height: '50%'
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
                <form onSubmit={handleFormSubmit} className="flex items-center justify-between">
                  <input
                    className="placeholder:text-gray-800 placeholder:italic p-4"
                    value={inputValue}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                      }
                    }}
                    onChange={(e) => {
                      if (role === 'ALUMNO' && !e.target.value.startsWith('A0')) {
                        setInputValue('A0' + e.target.value.slice(2));
                      } else if (role === 'DOCENTE' && !e.target.value.startsWith('L0')) {
                        setInputValue('L0' + e.target.value.slice(2));
                      } else {
                        setInputValue(e.target.value);
                      }
                    }}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 flex items-center justify-center"
                  >
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
                    <span className="text-4xl uppercase">{selectedDate.toLocaleString('es', { weekday: 'long' })}</span>
                    <span className="text-9xl">{selectedDate.getDate()}</span>
                    <span className="text-2xl uppercase">{selectedDate.toLocaleString('es', { month: 'long' })}</span>
                  </div>
                  <div className="h-2/6 w-10/12">
                    <span className="flex h-1/5 items-center text-lg underline uppercase">Especificaciones :</span>
                    <div className="flex flex-col justify-center h-3/5">
                      <ul className="list-disc list-inside">
                        <li>Info sala reservada</li>
                        <li>Numero de personas</li>
                        <li>Horario</li>
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
              <h1 className="text-4xl font-bold mb-4">Que dia quieres reservar?</h1>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                className="bg-blue-100 text-blue-500 border-blue-500 rounded-lg"
                locale={es}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}