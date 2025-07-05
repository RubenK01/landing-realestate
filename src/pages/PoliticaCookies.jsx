import React from 'react';
import { useNavigate } from 'react-router-dom';

const PoliticaCookies = () => {
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
          Política de Cookies
        </h1>
        
        <div className="text-gray-200 space-y-6 text-base leading-relaxed text-left">
          <p className="text-lg text-left">
            En <span className="text-yellow-400 font-semibold">metodovende.es</span> utilizamos cookies para mejorar tu experiencia de navegación y proporcionar servicios personalizados.
          </p>
          
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              ¿Qué son las cookies?
            </h2>
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, tablet o móvil) cuando visitas nuestra web. Estas cookies nos permiten recordar tus preferencias y proporcionar una experiencia más personalizada.
            </p>
          </section>

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
              Tipos de cookies que utilizamos
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cookies técnicas (necesarias)</h3>
                <p>
                  Son esenciales para el funcionamiento de la web. Incluyen cookies que permiten recordar tus preferencias de idioma, región o configuración de accesibilidad.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cookies analíticas</h3>
                <p>
                  Nos ayudan a entender cómo interactúas con nuestra web, qué páginas visitas más y cómo llegas a nuestro sitio. Utilizamos Google Analytics para recopilar esta información de forma anónima.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Cookies de marketing</h3>
                <p>
                  Utilizamos Meta Pixel (Facebook) para mostrar anuncios relevantes basados en tu actividad en nuestra web. Estas cookies también nos ayudan a medir la efectividad de nuestras campañas publicitarias.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Cookies de terceros
            </h2>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">● Google Analytics:</span> Para analizar el tráfico web y el comportamiento de los usuarios de forma anónima.
              </p>
              <p>
                <span className="font-semibold">● Meta Pixel (Facebook):</span> Para medir la efectividad de nuestras campañas publicitarias y mostrar anuncios relevantes.
              </p>
              <p>
                <span className="font-semibold">● Google Tag Manager:</span> Para gestionar eficientemente todos nuestros scripts de análisis y marketing.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Finalidad de las cookies
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">● Mejorar la experiencia del usuario:</span> Recordar tus preferencias y personalizar el contenido.
              </p>
              <p>
                <span className="font-semibold">● Análisis web:</span> Entender cómo utilizas nuestra web para mejorarla.
              </p>
              <p>
                <span className="font-semibold">● Marketing y publicidad:</span> Mostrar anuncios relevantes y medir la efectividad de nuestras campañas.
              </p>
              <p>
                <span className="font-semibold">● Funcionalidad técnica:</span> Garantizar el correcto funcionamiento de la web.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Duración de las cookies
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">● Cookies de sesión:</span> Se eliminan automáticamente cuando cierras el navegador.
              </p>
              <p>
                <span className="font-semibold">● Cookies persistentes:</span> Permanecen en tu dispositivo hasta que las elimines manualmente o expiren (máximo 2 años).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Gestión de cookies
            </h2>
            <p>
              Puedes gestionar las cookies a través de la configuración de tu navegador. Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad de nuestra web. Para más información sobre cómo gestionar cookies en tu navegador, consulta la ayuda oficial de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Actualizaciones de esta política
            </h2>
            <p>
              Podemos actualizar esta política de cookies para reflejar cambios en nuestras prácticas o por otros motivos operativos, legales o reglamentarios. La fecha de última actualización es el{' '}
              <span className="font-semibold text-white">2 de julio de 2025</span>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 text-left border-b border-gray-700 pb-2">
              Contacto
            </h2>
            <p>
              Si tienes alguna pregunta sobre nuestra política de cookies, puedes contactarnos en{' '}
              <a href="mailto:madrid@metodovende.es" className="text-blue-400 hover:text-blue-300 underline font-semibold">
                madrid@metodovende.es
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PoliticaCookies; 