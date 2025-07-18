import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecaptcha } from '../hooks/useRecaptcha';

const zonasMadrid = [
  {
    label: 'Madrid Capital',
    options: [
      'Centro', 'Arganzuela', 'Retiro', 'Salamanca', 'Chamartín', 'Tetuán', 'Chamberí',
      'Fuencarral-El Pardo', 'Moncloa-Aravaca', 'Latina', 'Carabanchel', 'Usera',
      'Puente de Vallecas', 'Moratalaz', 'Ciudad Lineal', 'Hortaleza', 'Villaverde',
      'Villa de Vallecas', 'Vicálvaro', 'San Blas-Canillejas', 'Barajas'
    ].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
  },
  {
    label: 'Municipios de Madrid',
    options: [
      'Alcobendas', 'San Sebastián de los Reyes', 'Tres Cantos', 'Colmenar Viejo', 'Getafe',
      'Leganés', 'Fuenlabrada', 'Parla', 'Pinto', 'Coslada', 'San Fernando de Henares',
      'Torrejón de Ardoz', 'Rivas-Vaciamadrid', 'Alcorcón', 'Móstoles', 'Pozuelo de Alarcón',
      'Majadahonda', 'Las Rozas de Madrid', 'Boadilla del Monte'
    ].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
  }
];

const FormSection = ({ onHeightChange }) => {
  const navigate = useNavigate();
  const { executeRecaptcha, isLoaded: recaptchaLoaded, error: recaptchaError, preloadRecaptcha } = useRecaptcha();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    operation: '', // Alquiler o Compra
    zone: ''    // zone de Madrid
  });
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [recaptchaErrorState, setRecaptchaErrorState] = useState('');
  const formRef = useRef(null);
  const [zonaInput, setZonaInput] = useState('');
  const [zonaDropdownOpen, setZonaDropdownOpen] = useState(false);
  const [zonaFiltered, setZonaFiltered] = useState(zonasMadrid);
  const zonaInputRef = useRef(null);
  const [clientIp, setClientIp] = useState('');

  // Precargar reCAPTCHA automáticamente cuando se monte el componente
  useEffect(() => {
    preloadRecaptcha();
  }, [preloadRecaptcha]);

  // Sanitiza y limita la entrada
  const sanitizeZona = (value) => {
    // Permite letras, números, espacios, tildes y guiones
    return value.replace(/[^\p{L}\p{N} \-áéíóúÁÉÍÓÚüÜñÑ]/gu, '').slice(0, 40);
  };

  useEffect(() => {
    if (zonaInput === '') {
      setZonaFiltered(zonasMadrid);
    } else {
      const lower = zonaInput.toLowerCase();
      setZonaFiltered(
        zonasMadrid
          .map(grupo => ({
            ...grupo,
            options: grupo.options.filter(zona => zona.toLowerCase().includes(lower))
          }))
          .filter(grupo => grupo.options.length > 0)
      );
    }
  }, [zonaInput]);

  // Cuando selecciona una zona del dropdown
  const handleZonaSelect = (zone) => {
    setFormData({ ...formData, zone: zone });
    setZonaInput(zone);
    setZonaDropdownOpen(false);
  };

  // Cuando escribe en el input
  const handleZonaInput = (e) => {
    const value = sanitizeZona(e.target.value);
    setZonaInput(value);
    setFormData({ ...formData, zone: value });
    setZonaDropdownOpen(true);
  };

  // Cierra el dropdown al perder foco
  const handleZonaBlur = () => {
    setTimeout(() => setZonaDropdownOpen(false), 120);
  };

  useEffect(() => {
    if (formRef.current && onHeightChange) {
      onHeightChange(formRef.current.offsetHeight);
    }
  }, [onHeightChange, formData, accepted]);

  useEffect(() => {
    // Obtener IP pública al cargar el componente
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setClientIp(data.ip))
      .catch(() => setClientIp(''));
  }, []);

  // Obtiene fbp y fbc de cookies si existen
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return undefined;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Eliminamos la precarga manual aquí ya que se hace automáticamente
  };

  const handleCheckbox = (e) => {
    setAccepted(e.target.checked);
  };

  // Función para ejecutar reCAPTCHA v3 (actualizada)
  const handleExecuteRecaptcha = async () => {
    try {
      const token = await executeRecaptcha('submit');
      
      setRecaptchaToken(token);
      setRecaptchaErrorState('');
      return token;
    } catch (error) {
      setRecaptchaErrorState('Error de verificación de seguridad');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!accepted) {
      alert('Debes aceptar recibir comunicaciones comerciales y la política de privacidad.');
      return;
    }

    // Ejecutar reCAPTCHA v3 antes de enviar
    try {
      const token = await handleExecuteRecaptcha();
      
      if (!token) {
        return; // Ya se muestra el error en handleExecuteRecaptcha
      }
      
      setIsSubmitting(true);
      setRecaptchaErrorState('');
      
      // Agregar el token de reCAPTCHA v3 y toda la info necesaria al payload
      const formDataWithRecaptcha = {
        ...formData,
        recaptchaToken: token,
        consentCookies: getCookie('consentCookies') || 'false',
        client_ip_address: clientIp,
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
        event_source_url: window.location.href,
        client_user_agent: navigator.userAgent
      };

      fetch(`https://api.metodovende.es/prod/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithRecaptcha)
      })
        .then(response => {
          if (response.ok) {
            // alert('Formulario enviado exitosamente!');
            setFormData({ name: '', email: '', phone: '', operation: '', zone: '' });
            setZonaInput('');
            setAccepted(false);
            setRecaptchaToken('');
            // Redirigir a la página de agradecimiento
            navigate('/thank-you');
          } else {
            // alert('Error al enviar el formulario');
            setIsSubmitting(false);
            setRecaptchaToken('');
          }
        })
        .catch(error => {
          setIsSubmitting(false);
          setRecaptchaToken('');
        });
    } catch (error) {
      alert('Error de conexión');
      setIsSubmitting(false);
      setRecaptchaToken('');
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="rounded-lg p-6 pb-8 w-full max-w-lg" ref={formRef}>
        <h3 className="text-lg md:text-2xl text-white mb-4 text-left leading-tight text-justify">
          <span className="font-extrabold">Vende</span> o <span className="font-extrabold">Alquila</span> tu propiedad en Madrid rápido y sin perder valor con un método profesional <span className="font-extrabold">VERIFICADO</span>
        </h3>
        <p className="text-gray-300 mb-3 text-left text-xs md:text-sm leading-tight text-justify">
          Vende o alquila tu propiedad en Madrid en menos de 45 días al mejor precio y con gestión 100% profesional, gracias al <span className="font-semibold text-yellow-400">Método V.E.N.D.E.</span>: visibilidad total, estrategia precisa y control absoluto de todo el proceso.
        </p>
        <h2 className="text-lg md:text-xl font-bold text-white mb-4 text-left">
          Contáctanos
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <select
              id="operation"
              name="operation"
              value={formData.operation}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>Selecciona tu operación</option>
              <option value="Alquiler">Vender mi inmueble</option>
              <option value="Compra">Alquilar mi inmueble</option>
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              id="zone"
              name="zone"
              autoComplete="off"
              value={zonaInput}
              onChange={handleZonaInput}
              onFocus={() => setZonaDropdownOpen(true)}
              onBlur={handleZonaBlur}
              maxLength={40}
              required
              ref={zonaInputRef}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Zona (Madrid y alrededores)"
            />
            {zonaDropdownOpen && zonaFiltered.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-48 overflow-auto left-0 text-left">
                {zonaFiltered.map(grupo => (
                  <div key={grupo.label}>
                    <div className="px-3 py-1 text-xs text-gray-400 font-semibold select-none">{grupo.label}</div>
                    {[...grupo.options].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })).map(zona => (
                      <div
                        key={zona}
                        className="px-3 py-2 cursor-pointer hover:bg-blue-600 hover:text-white text-xs text-gray-200"
                        onMouseDown={() => handleZonaSelect(zona)}
                      >
                        {zona}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <div className="text-right text-[10px] text-gray-400 mt-1">Máx. 40 caracteres</div>
          </div>

          <div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email"
            />
          </div>

          <div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Teléfono"
            />
          </div>

          <div className="flex items-start justify-start">
            <input
              type="checkbox"
              id="accept"
              checked={accepted}
              onChange={handleCheckbox}
              className="mt-1 mr-2 accent-blue-600"
              required
            />
            <label htmlFor="accept" className="text-xs text-gray-400 select-none cursor-pointer text-left">
              He leído y acepto la{' '}
              <a
                href="/politica-privacidad"
                rel="noopener noreferrer"
                className="underline text-blue-400 hover:text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                política de privacidad
              </a>{' '}
              y acepto recibir comunicaciones comerciales.
            </label>
          </div>

          {/* reCAPTCHA v3 - Invisible */}
          
          {/* Indicador sutil de carga de reCAPTCHA */}
          {!recaptchaLoaded && !recaptchaError && (
            <div className="text-blue-400 text-xs text-center mb-2">
              <div className="inline-flex items-center space-x-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
                <span>Preparando verificación de seguridad...</span>
              </div>
            </div>
          )}
          
          {recaptchaErrorState && (
            <div className="text-red-400 text-xs text-center">
              {recaptchaErrorState}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (!recaptchaLoaded && !recaptchaError)}
            className={`w-full font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out transform text-xs md:text-sm ${
              isSubmitting || (!recaptchaLoaded && !recaptchaError)
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Enviando...</span>
              </div>
            ) : !recaptchaLoaded && !recaptchaError ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Preparando...</span>
              </div>
            ) : (
              'Enviar Mensaje'
            )}
          </button>
          <p className="mt-1 w-full text-[10px] md:text-xs text-gray-400 text-left leading-tight break-words whitespace-normal">
            ¿Quieres saber más sobre el <span className="text-yellow-400">Método V.E.N.D.E.</span> o sobre mí?
            <a href="/metodo-inmobiliario" className="block w-full text-blue-400 underline hover:text-blue-600 transition-colors mt-1">Click aquí</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default FormSection; 