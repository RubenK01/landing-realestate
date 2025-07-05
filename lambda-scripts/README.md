# Lambda Unificado con reCAPTCHA

## Descripción

Este Lambda unifica todas las funcionalidades de tu landing page:
- ✅ Validación de reCAPTCHA
- ✅ Procesamiento del formulario principal
- ✅ Envío a Mailchimp
- ✅ Envío a Meta Conversion API

## Archivos

### `submit-form-integrated.py`
Lambda unificado que maneja todo el flujo del formulario.

### `requirements.txt`
Dependencias necesarias para el Lambda.

## Configuración

### 1. Variables de Entorno Requeridas

```bash
# reCAPTCHA
RECAPTCHA_SECRET_KEY=tu_secret_key_aqui

# Mailchimp
MAILCHIMP_API_KEY=tu_mailchimp_api_key
MAILCHIMP_LIST_ID=tu_mailchimp_list_id

# Meta Conversion API
PIXEL_ID=tu_pixel_id
ACCESS_TOKEN=tu_access_token
```

### 2. Obtener Secret Key de reCAPTCHA

1. Ve a [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Selecciona tu sitio web
3. Copia la **Secret Key** (diferente a la Site Key)

### 3. Implementación en AWS

#### Opción A: Reemplazar Lambda Existente
1. Subir `submit-form-integrated.py` como tu Lambda principal
2. Configurar variables de entorno
3. Actualizar API Gateway para usar este Lambda

#### Opción B: Crear Nuevo Lambda
1. Crear nueva función Lambda
2. Subir código con dependencias
3. Configurar endpoint en API Gateway

### 4. Instalación de Dependencias

```bash
# En el directorio del Lambda
pip install -r requirements.txt -t .
zip -r lambda_function.zip .
```

## Flujo de Funcionamiento

### 1. Frontend Envía Datos
```javascript
const formData = {
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+34612345678",
  operation: "Alquiler",
  zone: "Centro",
  recaptchaToken: "token_del_recaptcha",
  consentCookies: "true", // o "false" según la elección del usuario
  // Campos opcionales para Meta CAPI (solo si consentCookies === "true")
  fbp: "_fbp_cookie_value",
  fbc: "_fbc_cookie_value",
  event_source_url: window.location.href,
  client_ip_address: "ip_del_cliente",
  client_user_agent: navigator.userAgent
};
```

### 2. Lambda Procesa
1. **Valida campos requeridos**
2. **Verifica formato de email**
3. **Valida reCAPTCHA con Google**
4. **Envía a Mailchimp** (si configurado)
5. **Envía a Meta CAPI** (solo si `consentCookies === "true"`)
6. **Devuelve respuesta**

### 3. Respuesta
```json
{
  "statusCode": 200,
  "body": {
    "message": "Formulario enviado exitosamente",
    "results": {
      "recaptcha_verified": true,
      "hostname": "metodovende.es",
      "mailchimp": {"success": true},
      "meta_capi": {
        "success": false,
        "skipped": true,
        "reason": "User did not accept cookies"
      }
    }
  }
}
```

## Ventajas de la Implementación Unificada

### ✅ **Una sola llamada HTTP**
- Más rápido para el usuario
- Menos complejidad en el frontend
- Mejor experiencia de usuario

### ✅ **Validación centralizada**
- reCAPTCHA validado antes de procesar
- Validación de campos en un lugar
- Manejo de errores consistente

### ✅ **Logging unificado**
- Todos los logs en un lugar
- Fácil debugging
- Monitoreo centralizado

### ✅ **Configuración simplificada**
- Una sola función Lambda
- Variables de entorno centralizadas
- Menos endpoints que mantener

## Migración desde Lambdas Separados

### Si tienes Lambdas separados:

1. **Backup de Lambdas actuales**
   ```bash
   # Guardar copias de seguridad
   cp CAPI/lambda_function.py CAPI/lambda_function_backup.py
   cp mailchimp/lambda_function.py mailchimp/lambda_function_backup.py
   ```

2. **Reemplazar con Lambda unificado**
   ```bash
   # Usar el nuevo Lambda
   cp submit-form-integrated.py lambda_function.py
   ```

3. **Actualizar API Gateway**
   - Cambiar endpoint `/submit-form` para usar el nuevo Lambda
   - Mantener endpoints separados si es necesario

## Testing

### Testing Local
```bash
# Instalar dependencias
pip install -r requirements.txt

# Crear evento de prueba
python -c "
import json
event = {
    'body': json.dumps({
        'name': 'Test User',
        'email': 'test@example.com',
        'phone': '+34612345678',
        'operation': 'Alquiler',
        'zone': 'Centro',
        'recaptchaToken': 'test_token'
    })
}
print(json.dumps(event))
"
```

### Testing en AWS
1. Subir código a Lambda
2. Configurar variables de entorno
3. Probar con Postman o curl
4. Verificar logs en CloudWatch

## Troubleshooting

### Problemas Comunes

1. **reCAPTCHA validation failed**
   - Verificar que la secret key sea correcta
   - Verificar que el dominio esté registrado en reCAPTCHA

2. **Mailchimp error**
   - Verificar MAILCHIMP_API_KEY y MAILCHIMP_LIST_ID
   - Verificar que la API key tenga permisos correctos

3. **Meta CAPI error**
   - Verificar PIXEL_ID y ACCESS_TOKEN
   - Verificar que el pixel esté activo

4. **Dependencias faltantes**
   - Asegurar que `requests` esté incluido en el ZIP
   - Verificar que el Lambda tenga suficiente memoria

### Logs Útiles
```python
# En CloudWatch, buscar:
"reCAPTCHA validation successful"
"Mailchimp subscription successful"
"Meta CAPI event sent successfully"
```

## Monitoreo

### CloudWatch Metrics
- Número de requests
- Tiempo de respuesta
- Errores por servicio
- Rate de éxito/fallo

### Alertas Recomendadas
- Error rate > 5%
- Response time > 10s
- reCAPTCHA failures > 10%
- Mailchimp/Meta CAPI failures > 20%

## Seguridad

### Mejores Prácticas
1. **Nunca exponer secret keys** en logs
2. **Validar siempre reCAPTCHA** antes de procesar
3. **Usar HTTPS** en producción
4. **Implementar rate limiting** en API Gateway
5. **Logging de intentos fallidos** para detectar ataques

### Rate Limiting
```yaml
# En API Gateway
rate_limit: 10
burst_limit: 20
```

## Costos

### Estimación de Costos (AWS Lambda)
- **Requests**: ~$0.20 por 1M requests
- **Duration**: ~$0.0000166667 por GB-second
- **Típico**: ~$1-5/mes para tráfico moderado

### Optimización
- Usar Lambda Layers para dependencias grandes
- Optimizar código para menor duración
- Implementar caching si es necesario 