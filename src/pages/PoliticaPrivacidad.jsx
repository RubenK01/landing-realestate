import React from 'react';
import { useNavigate } from 'react-router-dom';

const PoliticaPrivacidad = () => {
  const navigate = useNavigate();
  
  return (
    <div className="h-screen bg-black text-white overflow-y-auto scrollbar-hide">
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

      <div className="max-w-4xl w-full mx-auto p-6 pt-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-left text-white">
          Política de Privacidad
        </h1>
        
        <div className="text-gray-200 space-y-6 text-base leading-relaxed text-left">
          <p className="text-lg text-left">
            En <span className="text-yellow-400 font-semibold">metodovende.es</span> respetamos la privacidad de nuestros usuarios y nos comprometemos a proteger sus datos personales.
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Responsable del tratamiento
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">● Nombre o razón social:</span> Franco Diego Marcó – NIF Z-1108935-H
              </p>
              <p>
                <span className="font-semibold">● Email de contacto:</span>{' '}
                <a href="mailto:madrid@metodovende.es" className="text-blue-400 hover:text-blue-300 underline">
                  madrid@metodovende.es
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Datos que recogemos
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">● Datos facilitados en el formulario de contacto:</span> operación, zona, nombre, email, teléfono.
              </p>
              <p>
                <span className="font-semibold">● Datos recogidos mediante cookies</span> (Google Analytics, Meta Pixel) para analizar el uso de la web y mejorar nuestros servicios.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Finalidad del tratamiento
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">● Gestionar y responder</span> a las consultas recibidas a través del formulario.
              </p>
              <p>
                <span className="font-semibold">● Analizar el tráfico web</span> y comportamientos para mejorar la experiencia del usuario.
              </p>
              <p>
                <span className="font-semibold">● Realizar campañas de marketing</span> y remarketing (con tu consentimiento).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Base legal
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">● Consentimiento explícito</span> del usuario.
              </p>
              <p>
                <span className="font-semibold">● Cumplimiento de obligaciones</span> legales.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Destinatarios
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">● Meta Platforms Inc.</span> (Pixel)
              </p>
              <p>
                <span className="font-semibold">● Google LLC</span> (Analytics)
              </p>
              <p>
                <span className="font-semibold">● No compartimos datos</span> con terceros sin tu consentimiento, salvo obligación legal.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Derechos del usuario
            </h2>
            <p>
              Puedes solicitar acceso, rectificación, supresión, oposición, limitación o portabilidad de tus datos enviando un email a{' '}
              <a href="mailto:madrid@metodovende.es" className="text-blue-400 hover:text-blue-300 underline font-semibold">
                madrid@metodovende.es
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Conservación de datos
            </h2>
            <p>
              Los datos se conservarán mientras sea necesario para la finalidad para la que se recogen o mientras no solicites su supresión.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Cambios en la política
            </h2>
            <p>
              Podemos actualizar esta política para adaptarnos a cambios legales o técnicos. La fecha de última actualización es el{' '}
              <span className="font-semibold text-white">2 de julio de 2025</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PoliticaPrivacidad; 