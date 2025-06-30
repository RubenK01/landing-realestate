import React from 'react';

const VideoSection = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        className="w-full h-full object-contain rounded-lg"
        controls
        autoPlay
        loop
      >
        <source src="/video.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  );
};

export default VideoSection; 