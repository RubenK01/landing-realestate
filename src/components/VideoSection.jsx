import React, { useState, useRef } from 'react';

const VideoSection = ({ maxHeight }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => {
      videoRef.current?.play();
    }, 100); // Espera a que el video esté en el DOM
  };

  // Aplica height exacto al contenedor si maxHeight está definido
  const containerStyle = maxHeight ? { height: maxHeight } : {};
  const mediaStyle = { height: '100%', width: '100%', objectFit: 'contain' };

  return (
    <div className="w-full flex items-center justify-center relative" style={containerStyle}>
      {!playing && (
        <>
          {/* Portada para desktop */}
          <img
            src="/cover-desktop.jpg"
            alt="Portada desktop"
            className="hidden md:block rounded-lg"
            style={mediaStyle}
          />
          {/* Portada para móvil */}
          <img
            src="/cover-mobile.jpg"
            alt="Portada móvil"
            className="block md:hidden rounded-lg"
            style={mediaStyle}
          />
          {/* Botón Play centrado */}
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center focus:outline-none"
            aria-label="Reproducir video"
            style={{ pointerEvents: 'auto' }}
          >
            <span className="bg-black bg-opacity-60 rounded-full p-6 hover:bg-opacity-80 transition">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="white" fillOpacity="0.7" />
                <polygon points="20,16 34,24 20,32" fill="#1e293b" />
              </svg>
            </span>
          </button>
        </>
      )}
      {playing && (
        <video
          ref={videoRef}
          className="rounded-lg"
          style={mediaStyle}
          controls
          autoPlay
          loop
        >
          <source src="/Video.mp4" type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>
      )}
    </div>
  );
};

export default VideoSection; 