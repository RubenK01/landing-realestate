import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Cookies } from 'react-cookie-consent';

// Pages
import Home from './pages/Home';
import ThankYouSection from './components/ThankYouSection';
import MetodoInmobiliarioSection from './components/MetodoInmobiliarioSection';
import PoliticaCookies from './pages/PoliticaCookies';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';

// Components
import CookieBanner from './components/CookieBanner';

// Hooks
import { useAnalytics } from './hooks/useAnalytics';

import './App.css';




function App() {
  // Estado para saber si el usuario ha aceptado cookies
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  // Estado para la altura del formulario
  const [formHeight, setFormHeight] = useState(null);

  useEffect(() => {
    // Leer la cookie de consentimiento
    const consent = Cookies.get('consentCookies');
    if (consent === 'true') {
      setCookiesAccepted(true);
    } else if (consent === 'false') {
      setCookiesAccepted(false);
    }
    // Si no existe la cookie, se mantiene el estado inicial (false)
  }, []);

  // Usar el hook personalizado para analytics
  useAnalytics(cookiesAccepted);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Área principal siempre centrada */}
      <div className="flex-1 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Home formHeight={formHeight} setFormHeight={setFormHeight} />} />
          <Route path="/politica-cookies" element={<PoliticaCookies />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/thank-you" element={<ThankYouSection />} />
          <Route path="/metodo-inmobiliario" element={<MetodoInmobiliarioSection />} />
        </Routes>
      </div>
      
      {/* Banner de cookies siempre fixed abajo */}
      <CookieBanner 
        onAccept={() => setCookiesAccepted(true)}
        onDecline={() => setCookiesAccepted(false)}
      />
    </div>
  );
}

export default App;
