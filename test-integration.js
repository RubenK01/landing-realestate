// Script de prueba para verificar la integración de reCAPTCHA
// Ejecutar en la consola del navegador en la página del formulario

console.log('🧪 Iniciando pruebas de integración de reCAPTCHA...');

// Función para simular el envío del formulario
async function testFormSubmission() {
  console.log('📝 Simulando envío de formulario...');
  
  // Datos de prueba
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+34612345678',
    operation: 'Alquiler',
    zone: 'Centro',
    recaptchaToken: 'test_token_123'
  };
  
  try {
    // Simular la llamada a tu API
    const response = await fetch('https://api.metodovende.es/prod/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('✅ Respuesta del servidor:', result);
    
    if (response.ok) {
      console.log('🎉 Formulario enviado exitosamente');
    } else {
      console.log('❌ Error en el envío:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Error de conexión:', error);
  }
}

// Función para verificar el estado del reCAPTCHA
function checkRecaptchaStatus() {
  console.log('🔍 Verificando estado de reCAPTCHA...');
  
  // Verificar si grecaptcha está disponible
  if (typeof window.grecaptcha !== 'undefined') {
    console.log('✅ grecaptcha está disponible');
    
    // Verificar si hay un widget renderizado
    const recaptchaElement = document.querySelector('.g-recaptcha');
    if (recaptchaElement) {
      console.log('✅ Elemento de reCAPTCHA encontrado');
      
      // Verificar si tiene contenido
      if (recaptchaElement.children.length > 0) {
        console.log('✅ Widget de reCAPTCHA renderizado');
      } else {
        console.log('⚠️ Elemento de reCAPTCHA vacío');
      }
    } else {
      console.log('❌ Elemento de reCAPTCHA no encontrado');
    }
  } else {
    console.log('❌ grecaptcha no está disponible');
  }
}

// Función para verificar la función de callback
function checkCallbackFunction() {
  console.log('🔍 Verificando función de callback...');
  
  if (typeof window.onRecaptchaChange === 'function') {
    console.log('✅ Función de callback disponible');
  } else {
    console.log('❌ Función de callback no disponible');
  }
}

// Función para verificar la configuración
function checkConfiguration() {
  console.log('🔍 Verificando configuración...');
  
  // Verificar site key
  const recaptchaElement = document.querySelector('.g-recaptcha');
  if (recaptchaElement) {
    const siteKey = recaptchaElement.getAttribute('data-sitekey');
    console.log('🔑 Site Key:', siteKey);
    
    if (siteKey === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI') {
      console.log('✅ Usando site key de prueba (desarrollo)');
    } else if (siteKey === '6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL') {
      console.log('✅ Usando site key de producción');
    } else {
      console.log('⚠️ Site key desconocida');
    }
  }
  
  // Verificar callback
  const callback = recaptchaElement?.getAttribute('data-callback');
  console.log('📞 Callback:', callback);
}

// Función principal de pruebas
function runAllTests() {
  console.log('🚀 Iniciando todas las pruebas...\n');
  
  checkConfiguration();
  console.log('');
  
  checkRecaptchaStatus();
  console.log('');
  
  checkCallbackFunction();
  console.log('');
  
  console.log('📋 Resumen de pruebas completado');
  console.log('💡 Para probar el envío, ejecuta: testFormSubmission()');
}

// Ejecutar pruebas automáticamente
setTimeout(runAllTests, 2000);

// Exponer funciones para uso manual
window.testFormSubmission = testFormSubmission;
window.checkRecaptchaStatus = checkRecaptchaStatus;
window.checkCallbackFunction = checkCallbackFunction;
window.checkConfiguration = checkConfiguration;
window.runAllTests = runAllTests;

console.log('📚 Funciones de prueba disponibles:');
console.log('- testFormSubmission()');
console.log('- checkRecaptchaStatus()');
console.log('- checkCallbackFunction()');
console.log('- checkConfiguration()');
console.log('- runAllTests()'); 