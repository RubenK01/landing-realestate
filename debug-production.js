// Script de diagnóstico para PRODUCCIÓN (metodovende.es) - reCAPTCHA v3
// Ejecutar en la consola del navegador en https://metodovende.es

console.log('🔍 Diagnóstico de reCAPTCHA v3 en PRODUCCIÓN...');

// Verificar que estamos en el dominio correcto
if (window.location.hostname !== 'metodovende.es') {
    console.warn('⚠️ Este script está diseñado para metodovende.es');
    console.warn('📍 Actualmente en:', window.location.hostname);
}

// Verificar configuración
console.log('📍 Hostname:', window.location.hostname);
console.log('🔗 URL completa:', window.location.href);
console.log('🌍 Protocolo:', window.location.protocol);
console.log('🚪 Puerto:', window.location.port);

// Verificar si grecaptcha v3 está disponible
if (typeof window.grecaptcha !== 'undefined') {
    console.log('✅ grecaptcha está disponible');
    console.log('📋 Versión de grecaptcha:', window.grecaptcha.version);
    
    // Verificar si tiene la función ready (específica de v3)
    if (typeof window.grecaptcha.ready === 'function') {
        console.log('✅ reCAPTCHA v3 detectado (función ready disponible)');
    } else {
        console.log('⚠️ reCAPTCHA v3 no detectado (función ready no disponible)');
    }
} else {
    console.log('❌ grecaptcha NO está disponible');
    console.log('💡 Posibles causas:');
    console.log('   1. Script de reCAPTCHA no se cargó');
    console.log('   2. Problema de red');
    console.log('   3. Bloqueador de anuncios');
}

// Verificar script de reCAPTCHA v3
const recaptchaScript = document.querySelector('script[src*="recaptcha/api.js"]');
if (recaptchaScript) {
    console.log('✅ Script de reCAPTCHA encontrado');
    const src = recaptchaScript.getAttribute('src');
    console.log('🔗 URL del script:', src);
    
    // Verificar si incluye el render parameter
    if (src.includes('render=')) {
        console.log('✅ Script configurado para reCAPTCHA v3');
        const siteKey = src.split('render=')[1];
        console.log('🔑 Site key en el script:', siteKey);
        
        // Verificar si es la site key correcta
        const expectedSiteKey = '6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL';
        if (siteKey === expectedSiteKey) {
            console.log('✅ Site key correcta para metodovende.es');
        } else {
            console.error('❌ Site key incorrecta!');
            console.log('   Esperada:', expectedSiteKey);
            console.log('   Encontrada:', siteKey);
        }
    } else {
        console.log('⚠️ Script no parece estar configurado para v3');
    }
} else {
    console.log('❌ Script de reCAPTCHA NO encontrado');
}

// Verificar errores en la consola
console.log('📋 Revisando errores en la consola...');
const errors = [];
const originalError = console.error;
console.error = function(...args) {
    errors.push(args.join(' '));
    originalError.apply(console, args);
};

// Función para probar reCAPTCHA v3
window.testRecaptchaV3Production = function() {
    console.log('🧪 Probando reCAPTCHA v3 en producción...');
    
    if (typeof window.grecaptcha !== 'undefined' && window.grecaptcha.ready) {
        try {
            window.grecaptcha.ready(function() {
                console.log('✅ reCAPTCHA v3 está listo');
                
                window.grecaptcha.execute('6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL', {action: 'submit'})
                    .then(function(token) {
                        console.log('🎯 Token reCAPTCHA v3 recibido exitosamente');
                        console.log('📊 Longitud del token:', token.length);
                        console.log('🔍 Preview del token:', token.substring(0, 20) + '...');
                        console.log('✅ reCAPTCHA v3 funcionando correctamente');
                    })
                    .catch(function(error) {
                        console.error('❌ Error ejecutando reCAPTCHA v3:', error);
                        console.log('💡 Posibles causas:');
                        console.log('   1. Site key incorrecta');
                        console.log('   2. Dominio no autorizado');
                        console.log('   3. Problema de red');
                    });
            });
        } catch (error) {
            console.error('❌ Error en test de reCAPTCHA v3:', error);
        }
    } else {
        console.log('❌ reCAPTCHA v3 no disponible para testing');
        console.log('💡 Verifica que el script se haya cargado correctamente');
    }
};

// Mostrar errores después de un delay
setTimeout(() => {
    if (errors.length > 0) {
        console.log('❌ Errores encontrados:');
        errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    } else {
        console.log('✅ No se encontraron errores en la consola');
    }
}, 2000);

console.log('💡 Ejecuta testRecaptchaV3Production() para probar reCAPTCHA v3');
console.log('💡 Si ves errores, verifica:');
console.log('   1. Que la site key esté registrada para metodovende.es');
console.log('   2. Que el dominio esté en la lista de dominios permitidos');
console.log('   3. Que no haya bloqueadores de anuncios activos');
console.log('   4. Que estés usando reCAPTCHA v3, no v2'); 