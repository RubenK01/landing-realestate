import { useState, useEffect, useCallback } from 'react';
import { RECAPTCHA_SITE_KEY } from '../config/recaptcha';

export const useRecaptcha = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar el script de reCAPTCHA dinámicamente
  const loadRecaptchaScript = useCallback(() => {
    return new Promise((resolve, reject) => {
      // Si ya está cargado, resolver inmediatamente
      if (window.grecaptcha && window.grecaptcha.ready) {
        setIsLoaded(true);
        resolve();
        return;
      }

      // Si ya se está cargando, esperar
      if (isLoading) {
        const checkLoaded = setInterval(() => {
          if (window.grecaptcha && window.grecaptcha.ready) {
            clearInterval(checkLoaded);
            setIsLoaded(true);
            setIsLoading(false);
            resolve();
          }
        }, 100);
        return;
      }

      setIsLoading(true);
      setError(null);

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
            resolve();
          }
        }, 100);

        // Timeout de seguridad (10 segundos)
        setTimeout(() => {
          clearInterval(checkReady);
          if (!window.grecaptcha || !window.grecaptcha.ready) {
            setIsLoading(false);
            setError('Timeout al cargar reCAPTCHA');
            reject(new Error('Timeout al cargar reCAPTCHA'));
          }
        }, 10000);
      };

      script.onerror = () => {
        setIsLoading(false);
        setError('Error al cargar reCAPTCHA');
        reject(new Error('Error al cargar reCAPTCHA'));
      };

      // Agregar el script al DOM
      document.head.appendChild(script);
    });
  }, [isLoading]);

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
    if (!isLoaded && !isLoading) {
      loadRecaptchaScript().catch(() => {
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