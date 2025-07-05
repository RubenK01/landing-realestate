# Acciones Automáticas de reCAPTCHA v3

## Resumen

Este documento explica las acciones automáticas que se ejecutan según la evaluación de reCAPTCHA v3 en el formulario de contacto.

## Evaluación de Scores

### 🔵 EXCELLENT (≥0.9) - Muy probablemente humano
- **Acción**: `ALLOW`
- **Descripción**: Permitir acceso completo
- **Comportamiento**:
  - ✅ Enviar a Mailchimp
  - ✅ Enviar a Meta CAPI (si aceptó cookies)
  - ✅ Acceso completo sin restricciones

### 🟢 GOOD (0.7-0.9) - Probablemente humano
- **Acción**: `ALLOW`
- **Descripción**: Permitir acceso completo
- **Comportamiento**:
  - ✅ Enviar a Mailchimp
  - ✅ Enviar a Meta CAPI (si aceptó cookies)
  - ✅ Acceso completo sin restricciones

### 🟡 MEDIUM (0.5-0.7) - Posiblemente humano
- **Acción**: `ALLOW_WITH_MONITORING`
- **Descripción**: Permitir pero monitorear
- **Comportamiento**:
  - ✅ Enviar a Mailchimp
  - ✅ Enviar a Meta CAPI (si aceptó cookies)
  - 👁️ Habilitar monitoreo adicional
  - 📊 Logging detallado

### 🟠 LOW (0.3-0.5) - Posiblemente bot
- **Acción**: `CHALLENGE`
- **Descripción**: Solicitar verificación adicional
- **Comportamiento**:
  - ✅ Enviar a Mailchimp
  - ✅ Enviar a Meta CAPI (si aceptó cookies)
  - ⚠️ Marcar para revisión
  - 🚨 Logging de alerta

### 🔴 VERY_LOW (<0.3) - Muy probablemente bot
- **Acción**: `BLOCK`
- **Descripción**: Bloquear acceso
- **Comportamiento**:
  - 🚫 Bloquear completamente
  - ❌ No enviar a servicios externos
  - 🚫 Retornar error 403

## Acciones Específicas por Servicio

### Mailchimp
- **Siempre se envía** (excepto si está bloqueado)
- **Propósito**: Lista de contactos
- **Condición**: Solo si no está bloqueado

### Meta Conversion API
- **Se envía condicionalmente**
- **Propósito**: Tracking de conversiones
- **Condiciones**:
  1. Usuario aceptó cookies (`consentCookies: 'true'`)
  2. No está bloqueado por reCAPTCHA

## Logs y Monitoreo

### Logs Automáticos
Cada evaluación genera logs detallados:
```
=== EXECUTING reCAPTCHA ACTION: ALLOW_WITH_MONITORING ===
Score: 0.6 - MEDIUM
Action Description: Permitir pero monitorear
👁️ MONITORING: Score medium (0.6) - Allowing with monitoring
📧 Sending to Mailchimp...
📊 Sending to Meta CAPI...
🔍 Adding monitoring data...
=== COMPLETED reCAPTCHA ACTIONS ===
Actions taken: ['MONITORING_ENABLED', 'MAILCHIMP_SUCCESS', 'META_CAPI_SUCCESS', 'MONITORING_DATA_LOGGED']
```

### Métricas Recomendadas
Para implementar monitoreo avanzado:

1. **CloudWatch Metrics**:
   - `recaptcha_score_distribution`
   - `recaptcha_actions_taken`
   - `blocked_submissions`

2. **Alertas**:
   - Score promedio < 0.5
   - Tasa de bloqueos > 10%
   - Patrones sospechosos

## Personalización de Umbrales

### Umbrales Actuales
```python
if score >= 0.9:      # EXCELLENT
elif score >= 0.7:    # GOOD
elif score >= 0.5:    # MEDIUM
elif score >= 0.3:    # LOW
else:                 # VERY_LOW
```

### Ajustar Umbrales
Para cambiar los umbrales, modifica la función `generate_recaptcha_report()`:

```python
# Más estricto
if score >= 0.95:     # EXCELLENT
elif score >= 0.8:    # GOOD
elif score >= 0.6:    # MEDIUM
elif score >= 0.4:    # LOW
else:                 # VERY_LOW

# Más permisivo
if score >= 0.8:      # EXCELLENT
elif score >= 0.6:    # GOOD
elif score >= 0.4:    # MEDIUM
elif score >= 0.2:    # LOW
else:                 # VERY_LOW
```

## Acciones Adicionales Recomendadas

### Para Scores MEDIUM (0.5-0.7)
- Implementar rate limiting
- Añadir delay artificial (1-3 segundos)
- Logging detallado de IP y User Agent

### Para Scores LOW (0.3-0.5)
- Enviar email de alerta al admin
- Guardar en base de datos para revisión manual
- Implementar captcha adicional

### Para Scores VERY_LOW (<0.3)
- Bloquear IP temporalmente
- Enviar alerta inmediata
- Registrar en blacklist

## Respuestas del API

### Respuesta Exitosa (200)
```json
{
  "success": true,
  "message": "Formulario enviado exitosamente",
  "recaptcha_evaluation": {
    "score": {
      "value": 0.8,
      "category": "GOOD",
      "description": "Likely human",
      "emoji": "🟢",
      "recommended_action": "ALLOW",
      "action_description": "Permitir acceso completo"
    }
  },
  "actions_taken": {
    "recommended_action": "ALLOW",
    "action_description": "Permitir acceso completo",
    "actions_executed": ["FULL_ACCESS_GRANTED", "MAILCHIMP_SUCCESS", "META_CAPI_SUCCESS"]
  }
}
```

### Respuesta Bloqueada (403)
```json
{
  "success": false,
  "error": "Access denied due to security check",
  "recaptcha_evaluation": {
    "score": {
      "value": 0.1,
      "category": "VERY_LOW",
      "description": "Very likely bot",
      "emoji": "🔴",
      "recommended_action": "BLOCK",
      "action_description": "Bloquear acceso"
    }
  },
  "actions_taken": {
    "recommended_action": "BLOCK",
    "action_description": "Bloquear acceso",
    "actions_executed": ["BLOCKED_ACCESS"]
  }
}
```

## Testing

### Página de Prueba
Usa `test-recaptcha-evaluation.html` para probar diferentes scores y ver las acciones ejecutadas.

### Comandos de Debug
```javascript
// En la consola del navegador
console.log('reCAPTCHA Score:', grecaptcha.getResponse());
```

## Consideraciones de Seguridad

1. **Nunca confíes solo en reCAPTCHA**: Combina con otras medidas
2. **Monitorea patrones**: Busca ataques coordinados
3. **Ajusta umbrales gradualmente**: Basado en datos reales
4. **Mantén logs**: Para análisis forense
5. **Respetar GDPR**: Solo enviar a Meta si hay consentimiento

## Próximos Pasos

1. Implementar métricas en CloudWatch
2. Configurar alertas automáticas
3. Añadir rate limiting por IP
4. Implementar blacklist/whitelist
5. Crear dashboard de monitoreo 