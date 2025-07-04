import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie-consent';
import { useLocation } from 'react-router-dom';

const CookieBanner = ({ onAccept, onDecline }) => {
  const [showBanner, setShowBanner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Verificar si ya existe la cookie de consentimiento
    const consent = Cookies.get('consentCookies');
    
    if (!consent) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [location.pathname]);

  const handleAccept = () => {
    // Establecer cookie de consentimiento como 'true'
    Cookies.set('consentCookies', 'true', { expires: 365 });
    setShowBanner(false);
    onAccept();
  };

  const handleDecline = () => {
    // Establecer cookie de consentimiento como 'false'
    Cookies.set('consentCookies', 'false', { expires: 365 });
    setShowBanner(false);
    onDecline();
  };

  // No mostrar en páginas de políticas
  const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const isPolicyPage =
    currentPath.startsWith('/politica-privacidad') ||
    currentPath.startsWith('/politica-cookies');
  
  if (isPolicyPage || !showBanner) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full border border-gray-700">
        <div className="p-8">
          <div className="mb-6">
            <div className="text-3xl mb-4">🍪</div>
            <h2 className="text-xl font-bold text-white mb-3">
              ¡Mejora tu experiencia!
            </h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Utilizamos cookies para personalizar contenido, analizar el tráfico y mejorar tu experiencia en{' '}
              <span className="text-yellow-400 font-semibold">metodovende.es</span>.
            </p>
            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-200">
                <strong>✨ Beneficios:</strong> Contenido personalizado, análisis mejorado y mejor servicio.
              </p>
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mb-6">
            Consulta nuestra{' '}
            <a
              href="/politica-cookies"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              política de cookies
            </a>
            {' '}y nuestra{' '}
            <a
              href="/politica-privacidad"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              política de privacidad
            </a>
            .
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAccept}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg cookie-accept-button"
              style={{
                boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.4)'
              }}
            >
              ✅ Aceptar todas las cookies
            </button>
            
            <button
              onClick={handleDecline}
              className="w-full bg-transparent text-gray-400 hover:text-gray-300 font-normal py-2 px-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300 ease-in-out cookie-decline-button"
            >
              ❌ Rechazar todas las cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner; 