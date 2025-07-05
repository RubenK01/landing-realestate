# Ejemplos de Requests - Lambda con Consentimiento de Cookies

## Request con Cookies Aceptadas

### Frontend (Usuario acepta cookies)
```javascript
// Usuario hace clic en "Aceptar" en el banner de cookies
// Se guarda: Cookies.set('consentCookies', 'true', { expires: 365 });

// Al enviar el formulario
const formData = {
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+34612345678",
  operation: "Alquiler",
  zone: "Centro",
  recaptchaToken: "03AGdBq27...", // Token válido de reCAPTCHA
  consentCookies: "true", // ← Usuario aceptó cookies
  // Datos para Meta CAPI (solo si consentCookies === "true")
  fbp: "fb.1.1234567890.1234567890",
  fbc: "fb.1.1234567890.ABCDEF",
  event_source_url: "https://metodovende.es/",
  client_ip_address: "192.168.1.1",
  client_user_agent: "Mozilla/5.0..."
};

fetch('https://api.metodovende.es/prod/submit-form', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

### Backend (Lambda procesa)
```python
# Lambda recibe el request y:
# 1. Valida reCAPTCHA ✅
# 2. Procesa formulario ✅
# 3. Envía a Mailchimp ✅
# 4. Envía a Meta CAPI ✅ (porque consentCookies === "true")
```

### Response
```json
{
  "statusCode": 200,
  "body": {
    "message": "Formulario enviado exitosamente",
    "results": {
      "recaptcha_verified": true,
      "hostname": "metodovende.es",
      "mailchimp": {
        "success": true
      },
      "meta_capi": {
        "success": true,
        "meta_response": {
          "events_received": 1,
          "messages": [],
          "fbtrace_id": "ABC123..."
        }
      }
    }
  }
}
```

## Request con Cookies Rechazadas

### Frontend (Usuario rechaza cookies)
```javascript
// Usuario hace clic en "Rechazar" en el banner de cookies
// Se guarda: Cookies.set('consentCookies', 'false', { expires: 365 });

// Al enviar el formulario
const formData = {
  name: "María García",
  email: "maria@example.com",
  phone: "+34687654321",
  operation: "Compra",
  zone: "Salamanca",
  recaptchaToken: "03AGdBq27...", // Token válido de reCAPTCHA
  consentCookies: "false", // ← Usuario rechazó cookies
  // NO se envían datos para Meta CAPI
};

fetch('https://api.metodovende.es/prod/submit-form', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

### Backend (Lambda procesa)
```python
# Lambda recibe el request y:
# 1. Valida reCAPTCHA ✅
# 2. Procesa formulario ✅
# 3. Envía a Mailchimp ✅
# 4. SKIPEA Meta CAPI ❌ (porque consentCookies === "false")
```

### Response
```json
{
  "statusCode": 200,
  "body": {
    "message": "Formulario enviado exitosamente",
    "results": {
      "recaptcha_verified": true,
      "hostname": "metodovende.es",
      "mailchimp": {
        "success": true
      },
      "meta_capi": {
        "success": false,
        "skipped": true,
        "reason": "User did not accept cookies"
      }
    }
  }
}
```

## Request sin Consentimiento Definido

### Frontend (Usuario no ha tomado decisión)
```javascript
// Usuario no ha interactuado con el banner de cookies
// No hay cookie 'consentCookies'

// Al enviar el formulario
const formData = {
  name: "Pedro López",
  email: "pedro@example.com",
  phone: "+34611111111",
  operation: "Alquiler",
  zone: "Chamartín",
  recaptchaToken: "03AGdBq27...", // Token válido de reCAPTCHA
  consentCookies: "false", // ← Valor por defecto
  // NO se envían datos para Meta CAPI
};

fetch('https://api.metodovende.es/prod/submit-form', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

### Backend (Lambda procesa)
```python
# Lambda recibe el request y:
# 1. Valida reCAPTCHA ✅
# 2. Procesa formulario ✅
# 3. Envía a Mailchimp ✅
# 4. SKIPEA Meta CAPI ❌ (porque consentCookies === "false")
```

## Logs del Lambda

### Con Cookies Aceptadas
```
INFO: Lambda function started
INFO: Received request body: {"name": "Juan Pérez", "email": "juan@example.com", ...}
INFO: Validating reCAPTCHA...
INFO: reCAPTCHA validation successful for hostname: metodovende.es
INFO: User consent for cookies: true
INFO: Sending to Mailchimp...
INFO: Mailchimp subscription successful
INFO: User accepted cookies - sending to Meta CAPI...
INFO: Meta CAPI event sent successfully
INFO: Form processing completed successfully
```

### Con Cookies Rechazadas
```
INFO: Lambda function started
INFO: Received request body: {"name": "María García", "email": "maria@example.com", ...}
INFO: Validating reCAPTCHA...
INFO: reCAPTCHA validation successful for hostname: metodovende.es
INFO: User consent for cookies: false
INFO: Sending to Mailchimp...
INFO: Mailchimp subscription successful
INFO: User did not accept cookies - skipping Meta CAPI
INFO: Form processing completed successfully
```

## Testing con cURL

### Test con Cookies Aceptadas
```bash
curl -X POST https://api.metodovende.es/prod/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+34612345678",
    "operation": "Alquiler",
    "zone": "Centro",
    "recaptchaToken": "test_token",
    "consentCookies": "true",
    "fbp": "fb.1.1234567890.1234567890",
    "fbc": "fb.1.1234567890.ABCDEF",
    "event_source_url": "https://metodovende.es/",
    "client_ip_address": "192.168.1.1",
    "client_user_agent": "Mozilla/5.0..."
  }'
```

### Test con Cookies Rechazadas
```bash
curl -X POST https://api.metodovende.es/prod/submit-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+34612345678",
    "operation": "Alquiler",
    "zone": "Centro",
    "recaptchaToken": "test_token",
    "consentCookies": "false"
  }'
```

## Validaciones del Lambda

### Campos Requeridos
- `name`: Nombre del usuario
- `email`: Email válido
- `operation`: Tipo de operación (Alquiler/Compra)
- `zone`: Zona de Madrid
- `recaptchaToken`: Token válido de reCAPTCHA

### Campo de Consentimiento
- `consentCookies`: 
  - `"true"` = Usuario aceptó cookies → Enviar a Meta CAPI
  - `"false"` = Usuario rechazó cookies → NO enviar a Meta CAPI
  - Por defecto: `"false"`

### Campos Opcionales para Meta CAPI
Solo se procesan si `consentCookies === "true"`:
- `fbp`: Facebook Browser ID
- `fbc`: Facebook Click ID
- `event_source_url`: URL de la página
- `client_ip_address`: IP del cliente
- `client_user_agent`: User Agent del navegador 