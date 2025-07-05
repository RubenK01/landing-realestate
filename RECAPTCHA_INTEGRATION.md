# Integración de reCAPTCHA v2

## Descripción

Este proyecto incluye una integración completa de Google reCAPTCHA v2 para proteger el formulario de contacto contra bots y spam.

## Configuración

### 1. Script de reCAPTCHA
El script de reCAPTCHA se carga desde `index.html`:
```html
<script src="https://www.google.com/recaptcha/api.js" async defer></script>
```

### 2. Site Key
Se utiliza la siguiente site key para el dominio:
```
6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL
```

## Implementación

### Componente FormSection.jsx

#### Estados agregados:
- `recaptchaToken`: Almacena el token generado por reCAPTCHA
- `recaptchaError`: Maneja errores de validación del reCAPTCHA

#### Funciones principales:

1. **onRecaptchaChange(token)**: Callback que se ejecuta cuando el usuario completa el reCAPTCHA
2. **Validación en handleSubmit()**: Verifica que el token esté presente antes de enviar el formulario
3. **Reset automático**: El reCAPTCHA se resetea automáticamente después del envío (exitoso o con error)

#### Widget de reCAPTCHA:
```jsx
<div className="flex justify-center">
  <div 
    className="g-recaptcha" 
    data-sitekey="6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL"
    data-callback="onRecaptchaChange"
  ></div>
</div>
```

## Flujo de funcionamiento

1. **Carga inicial**: El script de reCAPTCHA se carga automáticamente
2. **Interacción del usuario**: El usuario completa el reCAPTCHA
3. **Callback**: Se ejecuta `onRecaptchaChange` y se almacena el token
4. **Validación**: Al enviar el formulario, se verifica que el token esté presente
5. **Envío**: El token se incluye en el payload enviado al backend
6. **Reset**: El reCAPTCHA se resetea automáticamente

## Backend

El backend debe validar el token de reCAPTCHA usando la API de Google. Se incluye un ejemplo completo en `backend-example/recaptcha_validation.py`.

### Implementación Básica:
```python
import requests

def verify_recaptcha(token, secret_key):
    response = requests.post('https://www.google.com/recaptcha/api/siteverify', {
        'secret': secret_key,
        'response': token
    })
    return response.json()['success']
```

### Implementación Completa:
Ver el archivo `backend-example/recaptcha_validation.py` para una implementación completa que incluye:
- Validación de campos requeridos
- Manejo de errores
- CORS headers
- Logging
- Rate limiting

## Consideraciones de seguridad

1. **Validación del lado del servidor**: Es obligatorio validar el token en el backend
2. **Secret key**: Nunca exponer la secret key en el frontend
3. **Rate limiting**: Implementar límites de tasa para prevenir abuso
4. **Logging**: Registrar intentos fallidos para detectar ataques

## Personalización

### Estilos
El widget de reCAPTCHA se centra automáticamente y se adapta al tema oscuro del formulario.

### Mensajes de error
Los mensajes de error se muestran en español y son claros para el usuario.

### Responsive
El widget es responsive y se adapta a diferentes tamaños de pantalla.

## Troubleshooting

### Problemas comunes:

1. **Widget no aparece**: Verificar que el script se cargue correctamente
2. **Callback no funciona**: Asegurar que la función esté disponible globalmente
3. **Token inválido**: Verificar que la site key sea correcta para el dominio

### Debug:
- Revisar la consola del navegador para errores de JavaScript
- Verificar que el dominio esté registrado en Google reCAPTCHA
- Comprobar que la site key corresponda al dominio de producción

## Configuración para producción

1. **Dominio de producción**: Asegurar que `metodovende.es` esté registrado en la consola de reCAPTCHA
2. **HTTPS**: El reCAPTCHA requiere HTTPS en producción
3. **Testing**: Probar en diferentes navegadores y dispositivos 