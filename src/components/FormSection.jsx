import React, { useState } from 'react';

const barriosMadrid = [
  'Centro', 'Arganzuela', 'Retiro', 'Salamanca', 'Chamartín', 'Tetuán', 'Chamberí',
  'Fuencarral-El Pardo', 'Moncloa-Aravaca', 'Latina', 'Carabanchel', 'Usera',
  'Puente de Vallecas', 'Moratalaz', 'Ciudad Lineal', 'Hortaleza', 'Villaverde',
  'Villa de Vallecas', 'Vicálvaro', 'San Blas-Canillejas', 'Barajas'
];

const FormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    operation: '', // Alquiler o Compra
    barrio: ''    // Barrio de Madrid
  });
  const [accepted, setAccepted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckbox = (e) => {
    setAccepted(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) {
      alert('Debes aceptar recibir comunicaciones comerciales y la política de privacidad.');
      return;
    }
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Formulario enviado exitosamente!');
        setFormData({ name: '', email: '', phone: '', operation: '', barrio: '' });
        setAccepted(false);
      } else {
        alert('Error al enviar el formulario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg md:text-2xl text-white mb-4 text-left leading-tight">
          <span className="font-extrabold">Vende</span> o <span className="font-extrabold">Alquila</span> tu propiedad en Madrid rápido, y sin perder valor con un método profesional <span className="font-extrabold">VERIFICADO</span>
        </h3>
        <p className="text-gray-300 mb-3 text-left text-xs md:text-sm leading-tight text-justify">
          Vende o alquila tu propiedad en Madrid en menos de 45 días, al mejor precio y con gestión 100% profesional, gracias al Método <span className="font-semibold">V.E.N.D.E.®</span>: visibilidad total, estrategia precisa y control absoluto de todo el proceso.
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
              <option value="" disabled>Operación (alquiler o venta)</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Compra">Compra</option>
            </select>
          </div>

          <div>
            <select
              id="barrio"
              name="barrio"
              value={formData.barrio}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>Zona (barrios de Madrid)</option>
              {barriosMadrid.map((barrio) => (
                <option key={barrio} value={barrio}>{barrio}</option>
              ))}
            </select>
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
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Teléfono"
            />
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="accept"
              checked={accepted}
              onChange={handleCheckbox}
              className="mt-1 mr-2 accent-blue-600"
              required
            />
            <label htmlFor="accept" className="text-xs text-gray-400 select-none cursor-pointer">
              Acepto recibir comunicaciones comerciales.
            </label>
          </div>
          <p className="mt-1 text-[11px] text-gray-400 text-left">
            Consulta nuestra{' '}
            <a
              href="/politica-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400 hover:text-blue-600"
            >
              política de privacidad
            </a>{' '}y{' '}
            <a
              href="/politica-cookies"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400 hover:text-blue-600"
            >
              política de cookies
            </a>.
          </p>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105 text-xs md:text-sm"
          >
            Enviar Mensaje
          </button>
          <p className="mt-2 text-xs text-gray-400 text-left">
            ¿Quieres saber más sobre el Método V.E.N.D.E. o sobre mi?{' '}
            <a href="#" className="text-blue-400 underline hover:text-blue-600 transition-colors">Click aquí</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default FormSection; 