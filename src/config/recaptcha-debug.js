// Configuración temporal de reCAPTCHA para debugging
// Usar SOLO para desarrollo y testing

const RECAPTCHA_DEBUG_CONFIG = {
  // Site key de prueba (siempre funciona en cualquier dominio)
  siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  secretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'
};

// Exportar configuración de prueba
export const RECAPTCHA_SITE_KEY = RECAPTCHA_DEBUG_CONFIG.siteKey;
export const RECAPTCHA_SECRET_KEY = RECAPTCHA_DEBUG_CONFIG.secretKey;

// Función para obtener la configuración
export const getRecaptchaConfig = () => {
  return RECAPTCHA_DEBUG_CONFIG;
};

export default RECAPTCHA_DEBUG_CONFIG; 