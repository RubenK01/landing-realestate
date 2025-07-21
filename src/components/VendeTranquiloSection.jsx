import React from 'react';

const VendeTranquiloSection = () => {

  return (
    <div className="h-screen w-screen bg-black">
      {/* Iframe container - full screen */}
      <iframe
        src="https://testab321.carrd.co/"
        title="Método Inmobiliario - Fran Marcó"
        className="w-full h-full border-0"
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
      
    </div>
  );
};

export default VendeTranquiloSection; 