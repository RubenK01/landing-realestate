import { useState, useCallback, useRef } from 'react';

// Clave de reCAPTCHA hardcodeada para evitar problemas de importación
const RECAPTCHA_SITE_KEY = '6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL';

export const useRecaptcha = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadingPromiseRef = useRef(null);

  // Función para cargar el script de reCAPTCHA dinámicamente
  const loadRecaptchaScript = useCallback(() => {
    // Si ya hay una promesa de carga en curso, devolverla
    if (loadingPromiseRef.current) {
      return loadingPromiseRef.current;
    }

    // Si ya está cargado, resolver inmediatamente
    if (window.grecaptcha && window.grecaptcha.ready) {
      setIsLoaded(true);
      return Promise.resolve();
    }

    setIsLoading(true);
    setError(null);

    // Crear la promesa de carga
    loadingPromiseRef.current = new Promise((resolve, reject) => {
      // Crear el script
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;

      // Manejar eventos del script
      script.onload = () => {
        // Esperar a que grecaptcha esté completamente inicializado
        const checkReady = setInterval(() => {
          if (window.grecaptcha && window.grecaptcha.ready) {
            clearInterval(checkReady);
            setIsLoaded(true);
            setIsLoading(false);
            loadingPromiseRef.current = null;
            resolve();
          }
        }, 100);

        // Timeout de seguridad (5 segundos)
        setTimeout(() => {
          clearInterval(checkReady);
          if (!window.grecaptcha || !window.grecaptcha.ready) {
            setIsLoading(false);
            setError('Timeout al cargar reCAPTCHA');
            loadingPromiseRef.current = null;
            reject(new Error('Timeout al cargar reCAPTCHA'));
          }
        }, 5000);
      };

      script.onerror = () => {
        setIsLoading(false);
        setError('Error al cargar reCAPTCHA');
        loadingPromiseRef.current = null;
        reject(new Error('Error al cargar reCAPTCHA'));
      };

      // Agregar el script al DOM
      document.head.appendChild(script);
    });

    return loadingPromiseRef.current;
  }, []);

  // Función para ejecutar reCAPTCHA
  const executeRecaptcha = useCallback(async (action = 'submit') => {
    try {
      // Cargar el script si no está cargado
      if (!isLoaded) {
        await loadRecaptchaScript();
      }

      // Verificar que grecaptcha esté disponible
      if (!window.grecaptcha || !window.grecaptcha.ready) {
        throw new Error('reCAPTCHA no está disponible');
      }

      // Ejecutar reCAPTCHA
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      return token;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [isLoaded, loadRecaptchaScript]);

  // Función para precargar reCAPTCHA (opcional)
  const preloadRecaptcha = useCallback(() => {
    if (!isLoaded && !isLoading && !loadingPromiseRef.current) {
      loadRecaptchaScript().catch((error) => {
        // Silenciar errores en precarga
      });
    }
  }, [isLoaded, isLoading, loadRecaptchaScript]);

  return {
    isLoaded,
    isLoading,
    error,
    executeRecaptcha,
    preloadRecaptcha,
    loadRecaptchaScript
  };
}; 