// Configuración de reCAPTCHA v3 para PRODUCCIÓN
// Usar SOLO en https://metodovende.es

const RECAPTCHA_PRODUCTION_CONFIG = {
  // Site key real para metodovende.es (v3)
  siteKey: '6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL',
  secretKey: 'TU_SECRET_KEY_AQUI' // Reemplazar con tu secret key real
};

// Exportar configuración de producción
export const RECAPTCHA_SITE_KEY = RECAPTCHA_PRODUCTION_CONFIG.siteKey;
export const RECAPTCHA_SECRET_KEY = RECAPTCHA_PRODUCTION_CONFIG.secretKey;

// Función para obtener la configuración
export const getRecaptchaConfig = () => {
  console.log('🔍 reCAPTCHA Production Config:');
  console.log('📍 Hostname:', window.location.hostname);
  console.log('🔑 Using Production Site Key:', RECAPTCHA_PRODUCTION_CONFIG.siteKey);
  
  return RECAPTCHA_PRODUCTION_CONFIG;
};

export default RECAPTCHA_PRODUCTION_CONFIG; 