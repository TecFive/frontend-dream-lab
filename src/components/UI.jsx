import { useChat } from "../hooks/useChat";
import React, { useState } from 'react';
import { FaCheck } from "react-icons/fa";

export const UI = ({ hidden, ...props }) => {
  const [role, setRole] = useState('ALUMNO');
  const [inputValue, setInputValue] = useState('A0');
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();

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

  const handleDropdownChange = (e) => {
    setRole(e.target.value);
    setInputValue(e.target.value === 'ALUMNO' ? 'A0' : 'L0');
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-center p-4 pointer-events-none">
        <div className="w-1/2">
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
        <div className="flex flex-col items-center justify-center w-1/2 h-full">
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#10069f',
              width: '80%',
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
          <div className="flex flex-col items-center justify-center pointer-events-auto w-4/5 h-1/5 mx-auto bg-opacity-50 bg-white backdrop-blur-md rounded-b">
            <div className="mb-6">
              <label>Login para </label>
              <select 
                onChange={handleDropdownChange} 
                className="text-black bg-transparent border border-black p-1 rounded-md"
              >
                <option value="ALUMNO">Alumnos</option>
                <option value="DOCENTE">Docentes</option>
              </select>
            </div>
            <div className="flex justify-between w-1/2 items-center">
              <input
                className="placeholder:text-gray-800 placeholder:italic p-4 rounded-md"
                value={inputValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
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
                disabled={loading || message}
                onClick={sendMessage}
                className={`bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center ${
                  loading || message ? "cursor-not-allowed opacity-30" : ""
                }`}
              >
                <FaCheck />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
