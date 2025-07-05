// Configuración de reCAPTCHA v3
const RECAPTCHA_CONFIG = {
  // Site key de prueba para desarrollo v3 (siempre funciona)
  development: {
    siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    secretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
  },
  
  // Site key real para producción v3
  production: {
    siteKey: '6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL',
    secretKey: 'TU_SECRET_KEY_AQUI' // Reemplazar con tu secret key real
  }
};

// Determinar el entorno
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('localhost') ||
                     window.location.hostname.includes('127.0.0.1') ||
                     (window.location.port && (window.location.port === '5173' || window.location.port === '3000'));

// Exportar la configuración según el entorno
export const getRecaptchaConfig = () => {
  const config = isDevelopment ? RECAPTCHA_CONFIG.development : RECAPTCHA_CONFIG.production;
  

  
  return config;
};

// Exportar solo la site key para uso directo
export const RECAPTCHA_SITE_KEY = getRecaptchaConfig().siteKey;

// Función para obtener la secret key (solo para el backend)
export const getRecaptchaSecretKey = () => {
  return getRecaptchaConfig().secretKey;
};

export default RECAPTCHA_CONFIG; 