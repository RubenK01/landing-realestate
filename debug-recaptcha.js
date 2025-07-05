// Script de diagnóstico para reCAPTCHA
// Ejecutar en la consola del navegador

console.log('🔍 Diagnóstico de reCAPTCHA...');

// Verificar configuración
console.log('📍 Hostname:', window.location.hostname);
console.log('🔗 URL completa:', window.location.href);
console.log('🌍 Protocolo:', window.location.protocol);
console.log('🚪 Puerto:', window.location.port);

// Verificar si grecaptcha está disponible
if (typeof window.grecaptcha !== 'undefined') {
    console.log('✅ grecaptcha está disponible');
    console.log('📋 Versión de grecaptcha:', window.grecaptcha.version);
} else {
    console.log('❌ grecaptcha NO está disponible');
}

// Verificar elemento de reCAPTCHA
const recaptchaElement = document.querySelector('.g-recaptcha');
if (recaptchaElement) {
    console.log('✅ Elemento de reCAPTCHA encontrado');
    console.log('🔑 Site key en el elemento:', recaptchaElement.getAttribute('data-sitekey'));
    
    // Verificar si tiene contenido
    if (recaptchaElement.children.length > 0) {
        console.log('✅ Widget de reCAPTCHA renderizado');
    } else {
        console.log('⚠️ Elemento de reCAPTCHA vacío');
    }
} else {
    console.log('❌ Elemento de reCAPTCHA NO encontrado');
}

// Verificar función de callback
if (typeof window.onRecaptchaChange === 'function') {
    console.log('✅ Función de callback disponible');
} else {
    console.log('❌ Función de callback NO disponible');
}

// Verificar cookies de consentimiento
const consentCookie = document.cookie.split('; ').find(row => row.startsWith('consentCookies='));
if (consentCookie) {
    console.log('🍪 Cookie de consentimiento:', consentCookie.split('=')[1]);
} else {
    console.log('🍪 No hay cookie de consentimiento');
}

// Verificar errores en la consola
console.log('📋 Para verificar errores, revisa la pestaña Console');
console.log('💡 Si ves errores de reCAPTCHA, el problema puede ser:');
console.log('   1. Site key no válida para este dominio');
console.log('   2. Dominio no registrado en la consola de reCAPTCHA');
console.log('   3. Problema de red o carga del script');

// Función para probar reCAPTCHA
window.testRecaptcha = function() {
    console.log('🧪 Probando reCAPTCHA...');
    
    if (typeof window.grecaptcha !== 'undefined') {
        try {
            // Intentar resetear reCAPTCHA
            window.grecaptcha.reset();
            console.log('✅ reCAPTCHA reset exitoso');
        } catch (error) {
            console.error('❌ Error reseteando reCAPTCHA:', error);
        }
    } else {
        console.log('❌ grecaptcha no disponible para testing');
    }
};

console.log('💡 Ejecuta testRecaptcha() para probar el widget'); 