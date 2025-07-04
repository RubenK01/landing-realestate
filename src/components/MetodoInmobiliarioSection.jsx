import React from 'react';
import { useNavigate } from 'react-router-dom';

const MetodoInmobiliarioSection = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-black">
      {/* Iframe container - full screen */}
      <iframe
        src="https://metodoinmobiliario.ju.mp/"
        title="Método Inmobiliario - Fran Marcó"
        className="w-full h-full border-0"
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
      
      {/* Floating back button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 bg-black bg-opacity-75 text-white hover:text-blue-400 transition-colors px-3 py-2 rounded-lg backdrop-blur-sm"
        aria-label="Volver a la página principal"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        Volver
      </button>
    </div>
  );
};

export default MetodoInmobiliarioSection; 