# Integración de reCAPTCHA en el Backend

## Descripción

Este directorio contiene ejemplos de cómo integrar la validación de reCAPTCHA en tu backend de AWS Lambda.

## Flujo Completo de reCAPTCHA

### 1. Frontend (React)
- Usuario completa el formulario
- Usuario completa el reCAPTCHA
- Se genera un token único
- Token se envía junto con los datos del formulario

### 2. Backend (AWS Lambda)
- Recibe el token de reCAPTCHA
- Valida el token con Google reCAPTCHA API
- Si es válido, procesa el formulario
- Si no es válido, devuelve error

## Archivos Incluidos

### `recaptcha_validation.py`
Función Lambda completa que:
- Valida el token de reCAPTCHA
- Procesa los datos del formulario
- Maneja errores y CORS
- Devuelve respuestas apropiadas

### `requirements.txt`
Dependencias necesarias para el backend:
- `requests`: Para hacer llamadas HTTP a Google reCAPTCHA API
- `boto3`: Para servicios de AWS (opcional)
- `python-dotenv`: Para variables de entorno

### `env.example`
Variables de entorno necesarias para el backend.

## Configuración

### 1. Obtener Secret Key de reCAPTCHA

1. Ve a [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Selecciona tu sitio web
3. Copia la **Secret Key** (diferente a la Site Key)

### 2. Configurar Variables de Entorno

Copia `env.example` a `.env` y configura:

```bash
# Para desarrollo (usar keys de prueba)
RECAPTCHA_SECRET_KEY_DEVELOPMENT=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

# Para producción (usar tu secret key real)
RECAPTCHA_SECRET_KEY_PRODUCTION=TU_SECRET_KEY_REAL_AQUI
```

### 3. Implementar en AWS Lambda

1. **Crear función Lambda**:
   ```bash
   # Crear archivo ZIP con dependencias
   pip install -r requirements.txt -t .
   zip -r lambda_function.zip .
   ```

2. **Configurar variables de entorno en Lambda**:
   - `RECAPTCHA_SECRET_KEY_PRODUCTION`: Tu secret key real
   - `RECAPTCHA_SECRET_KEY_DEVELOPMENT`: Key de prueba

3. **Configurar API Gateway**:
   - Crear endpoint POST
   - Conectar con la función Lambda
   - Configurar CORS si es necesario

## Uso

### Request desde Frontend
```javascript
const formData = {
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+34612345678",
  operation: "Alquiler",
  zone: "Centro",
  recaptchaToken: "token_del_recaptcha"
};

fetch('https://tu-api-gateway.amazonaws.com/prod/submit-form', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData)
});
```

### Response del Backend
```json
{
  "statusCode": 200,
  "body": {
    "message": "Formulario enviado exitosamente",
    "recaptcha_verified": true,
    "hostname": "metodovende.es"
  }
}
```

## Validación de reCAPTCHA

### Códigos de Error Comunes
- `missing-input-secret`: Secret key no proporcionada
- `invalid-input-secret`: Secret key inválida
- `missing-input-response`: Token no proporcionado
- `invalid-input-response`: Token inválido
- `bad-request`: Request malformada
- `timeout-or-duplicate`: Token expirado o duplicado

### Puntuación (para reCAPTCHA v3)
- `1.0`: Muy probablemente humano
- `0.9`: Probablemente humano
- `0.5`: Posiblemente bot
- `0.0`: Muy probablemente bot

## Seguridad

### Mejores Prácticas
1. **Nunca exponer la Secret Key** en el frontend
2. **Validar siempre en el backend** antes de procesar
3. **Usar HTTPS** en producción
4. **Implementar rate limiting** para prevenir abuso
5. **Logging de intentos fallidos** para detectar ataques

### Rate Limiting
```python
# Ejemplo básico de rate limiting
import time
from collections import defaultdict

request_counts = defaultdict(list)

def check_rate_limit(ip_address, max_requests=10, window_seconds=60):
    now = time.time()
    request_counts[ip_address] = [
        req_time for req_time in request_counts[ip_address] 
        if now - req_time < window_seconds
    ]
    
    if len(request_counts[ip_address]) >= max_requests:
        return False
    
    request_counts[ip_address].append(now)
    return True
```

## Testing

### Testing Local
```bash
# Instalar dependencias
pip install -r requirements.txt

# Ejecutar test
python recaptcha_validation.py
```

### Testing en AWS
1. Subir código a Lambda
2. Probar con Postman o curl
3. Verificar logs en CloudWatch

## Troubleshooting

### Problemas Comunes

1. **Token inválido**:
   - Verificar que la secret key sea correcta
   - Verificar que el dominio esté registrado en reCAPTCHA

2. **CORS errors**:
   - Configurar headers CORS en API Gateway
   - Verificar origen del request

3. **Timeout**:
   - Aumentar timeout de Lambda
   - Optimizar código de validación

4. **Dependencias faltantes**:
   - Incluir todas las dependencias en el ZIP
   - Usar Lambda Layers para dependencias grandes

## Monitoreo

### CloudWatch Metrics
- Número de requests
- Tiempo de respuesta
- Errores de reCAPTCHA
- Rate de éxito/fallo

### Logs Útiles
```python
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# En la función Lambda
logger.info(f"reCAPTCHA validation result: {recaptcha_result}")
logger.error(f"reCAPTCHA validation failed: {recaptcha_result.get('error_codes')}")
``` 