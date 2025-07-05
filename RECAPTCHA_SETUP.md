# Configuración de reCAPTCHA - Solución de Problemas

## Problema: reCAPTCHA no aparece

Si no ves el widget de reCAPTCHA en el formulario, sigue estos pasos para solucionarlo:

## 1. Verificar la Consola de reCAPTCHA

### Acceder a la consola:
1. Ve a [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Inicia sesión con tu cuenta de Google
3. Selecciona tu sitio web

### Verificar dominios registrados:
- Asegúrate de que `localhost` esté incluido en los dominios para desarrollo
- Para producción, asegúrate de que `metodovende.es` esté registrado

## 2. Configurar Dominios para Desarrollo

### En la consola de reCAPTCHA:
1. Ve a la configuración de tu sitio
2. En "Domains", agrega:
   - `localhost`
   - `127.0.0.1`
   - `localhost:5173` (puerto de desarrollo de Vite)

### Ejemplo de configuración:
```
Domains:
- metodovende.es
- www.metodovende.es
- localhost
- 127.0.0.1
- localhost:5173
```

## 3. Verificar Site Key

### Site Key actual:
```
6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL
```

### Verificar que sea correcta:
1. En la consola de reCAPTCHA, copia la site key
2. Compara con la que está en el código
3. Si es diferente, actualiza el código

## 4. Probar la Implementación

### Archivo de prueba:
Se ha creado `test-recaptcha.html` para probar reCAPTCHA independientemente de React.

### Pasos:
1. Abre `test-recaptcha.html` en tu navegador
2. Verifica si aparece el widget
3. Si aparece, el problema está en la implementación de React
4. Si no aparece, el problema está en la configuración de reCAPTCHA

## 5. Debug en React

### Verificar en la consola del navegador:
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña Console
3. Busca errores relacionados con reCAPTCHA
4. Verifica que el script se cargue correctamente

### Mensajes de debug:
El código incluye logs para debug:
```javascript
console.log('reCAPTCHA token received:', token);
```

## 6. Soluciones Alternativas

### Si reCAPTCHA no funciona en desarrollo:
1. **Usar una site key de prueba**: Google proporciona keys de prueba para desarrollo
2. **Deshabilitar temporalmente**: Comentar la validación de reCAPTCHA para desarrollo
3. **Usar reCAPTCHA v3**: Menos intrusivo, no requiere interacción del usuario

### Site keys de prueba (solo para desarrollo):
```
Site Key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
Secret Key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

## 7. Implementación para Producción

### Configuración final:
1. Usar la site key real para `metodovende.es`
2. Configurar la secret key en el backend
3. Implementar validación del token en el servidor
4. Probar en el dominio de producción

### Variables de entorno:
```javascript
// En producción, usar variables de entorno
const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL';
```

## 8. Comandos Útiles

### Reiniciar el servidor de desarrollo:
```bash
cd landing-frontend
npm run dev
```

### Verificar que el servidor esté corriendo:
```bash
netstat -ano | findstr :5173
```

### Abrir el archivo de prueba:
```bash
# En el navegador, abre:
file:///path/to/landing-frontend/test-recaptcha.html
```

## 9. Contacto

Si sigues teniendo problemas:
1. Verifica la consola de reCAPTCHA
2. Revisa los logs del navegador
3. Prueba con el archivo `test-recaptcha.html`
4. Asegúrate de que los dominios estén correctamente configurados 