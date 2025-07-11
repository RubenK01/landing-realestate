# 🏠 Método V.E.N.D.E. - Landing Page

Una landing page moderna y profesional para el sector inmobiliario, construida con React, Tailwind CSS y optimizada para conversiones.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Desarrollo](#-desarrollo)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración](#-configuración)
- [Gestión de reCAPTCHA v3](#️-gestión-de-recaptcha-v3)
- [Buenas Prácticas](#-buenas-prácticas)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

- 🎨 **Diseño Moderno**: Interfaz limpia y profesional con Tailwind CSS
- 📱 **Responsive**: Optimizado para todos los dispositivos
- 🍪 **Gestión de Cookies**: Banner de consentimiento GDPR compliant
- 📊 **Analytics**: Integración con Google Analytics, Meta Pixel y GTM
- 🔄 **Conversiones**: API de conversiones de Meta para tracking avanzado
- 🛡️ **reCAPTCHA v3**: Protección invisible contra bots con evaluación inteligente
- 🎥 **Contenido Multimedia**: Videos optimizados y secciones interactivas
- 📝 **Formularios Inteligentes**: Autocompletado y validación avanzada
- 🚀 **Performance**: Optimizado para velocidad y SEO

## 🏗️ Arquitectura del Proyecto

```
landing-frontend/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── CookieBanner.jsx
│   │   ├── FormSection.jsx
│   │   ├── VideoSection.jsx
│   │   └── ...
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── PoliticaPrivacidad.jsx
│   │   └── ...
│   ├── hooks/               # Custom hooks
│   │   └── useAnalytics.js
│   └── assets/              # Recursos estáticos
├── public/                  # Archivos públicos
├── lambda-scripts/          # Funciones Lambda para APIs
│   ├── submit-form-integrated.py  # Lambda unificado con reCAPTCHA
│   ├── CAPI/               # Meta Conversions API
│   └── mailchimp/          # Integración Mailchimp
├── package.json
├── README.md
├── LICENSE
├── CONTRIBUTING.md
└── env.example
```

### Flujo de Datos

```
Usuario → Formulario → reCAPTCHA v3 → Evaluación → Acciones Automáticas
                                    ├── Score ≥ 0.9: ALLOW
                                    ├── Score 0.7-0.9: ALLOW
                                    ├── Score 0.5-0.7: MONITORING
                                    ├── Score 0.3-0.5: CHALLENGE
                                    └── Score < 0.3: BLOCK
                                    ↓
                                    APIs Paralelas
                                    ├── Mailchimp (siempre)
                                    └── Meta CAPI (si consentimiento)
```

### Arquitectura AWS

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Route53       │    │   AWS Amplify   │    │   API Gateway   │
│   DNS & SSL     │───▶│   Hosting & CDN │───▶│   REST API      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   S3 Bucket     │    │   Lambda        │
                       │   Static Files  │    │   Functions     │
                       └─────────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   Meta CAPI     │
                                              │   Lambda        │
                                              └─────────────────┘
```

**Componentes AWS:**
- **AWS Amplify**: Hosting, CDN y CI/CD automático
- **Route53**: DNS management y SSL certificates
- **API Gateway**: REST API endpoints
- **Lambda**: Serverless functions para procesamiento
- **S3**: Almacenamiento de archivos estáticos

## 🛠️ Tecnologías

### Frontend
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **React Router** - Navegación SPA
- **React Cookie Consent** - Gestión de cookies

### Analytics & Tracking
- **Google Analytics 4** - Analytics web
- **Meta Pixel** - Tracking de Facebook
- **Google Tag Manager** - Gestión de tags
- **Meta Conversions API** - Tracking server-side

### Seguridad
- **reCAPTCHA v3** - Protección invisible contra bots
- **Evaluación Inteligente** - Score-based actions automáticas
- **Validación Server-side** - Verificación en Lambda

### Infraestructura AWS
- **AWS Amplify** - Hosting, CDN y CI/CD automático
- **Route53** - DNS management y SSL certificates
- **API Gateway** - REST API endpoints
- **Lambda** - Serverless functions para procesamiento
- **S3** - Almacenamiento de archivos estáticos

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/RubenK01/landing-realstate.git
cd landing-realstate
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp env.example .env.local
```

4. **Iniciar desarrollo**
```bash
npm run dev
```

## 💻 Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código
```

### Estructura de Componentes

```jsx
// Ejemplo de estructura de componente
import React from 'react';

const MiComponente = ({ prop1, prop2 }) => {
  // Lógica del componente
  
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
};

export default MiComponente;
```

## 🌐 Despliegue

### Despliegue en AWS Amplify (Recomendado)

1. **Conectar repositorio a AWS Amplify**
```bash
# En AWS Amplify Console:
# 1. Conectar repositorio de GitHub
# 2. Configurar build settings
# 3. Configurar variables de entorno
```

2. **Configurar variables de entorno en Amplify**
   - `VITE_GA_ID`
   - `VITE_META_PIXEL_ID`
   - `VITE_GTM_ID`
   - `VITE_API_URL`
   - `VITE_META_CONVERSIONS_API`

3. **Configurar Route53 para dominio personalizado**
   - Crear hosted zone
   - Configurar registros A y CNAME
   - Configurar SSL certificate

4. **Despliegue automático**
```bash
git push origin main
```

### Despliegue en Vercel (Alternativa)

1. **Conectar repositorio**
```bash
npm install -g vercel
vercel login
vercel
```

2. **Configurar variables de entorno en Vercel Dashboard**
   - `VITE_GA_ID`
   - `VITE_META_PIXEL_ID`
   - `VITE_GTM_ID`
   - `VITE_API_URL`

3. **Despliegue automático**
```bash
git push origin main
```

### Despliegue en Netlify

1. **Build y deploy**
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Despliegue Manual

1. **Generar build**
```bash
npm run build
```

2. **Subir archivos a servidor web**
   - Subir contenido de `dist/` al directorio raíz del servidor
   - Configurar redirecciones para SPA

## 📁 Estructura del Proyecto

```
landing-frontend/
├── src/
│   ├── components/           # Componentes reutilizables
│   │   ├── CookieBanner.jsx  # Banner de consentimiento
│   │   ├── FormSection.jsx   # Formulario principal
│   │   ├── VideoSection.jsx  # Sección de video
│   │   └── ...
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Home.jsx         # Página principal
│   │   ├── PoliticaPrivacidad.jsx
│   │   ├── PoliticaCookies.jsx
│   │   └── ...
│   ├── hooks/               # Custom hooks
│   │   └── useAnalytics.js  # Hook para analytics
│   ├── assets/              # Recursos estáticos
│   ├── App.jsx              # Componente raíz
│   └── main.jsx             # Punto de entrada
├── public/                  # Archivos públicos
├── lambda-scripts/          # Funciones Lambda
├── package.json
├── README.md
├── LICENSE
├── CONTRIBUTING.md
└── env.example
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env.local`:

```env
# Analytics
VITE_GA_ID=G-XXXXXXXXXX
VITE_META_PIXEL_ID=XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX

# APIs
VITE_API_URL=https://tu-api.com
VITE_META_CONVERSIONS_API=https://tu-lambda.com

# reCAPTCHA v3
RECAPTCHA_SITE_KEY=6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL
RECAPTCHA_SECRET_KEY=TU_SECRET_KEY_REAL

# Configuración
VITE_APP_NAME=Método V.E.N.D.E.
VITE_APP_URL=https://metodovende.es
```

### Configuración de Tailwind

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937',
        secondary: '#fbbf24',
      }
    }
  },
  plugins: []
}
```

### Configuración AWS

#### AWS Amplify
```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### API Gateway
```json
{
  "swagger": "2.0",
  "info": {
    "title": "Método V.E.N.D.E. API",
    "version": "1.0.0"
  },
  "paths": {
    "/contact": {
      "post": {
        "summary": "Enviar formulario de contacto",
        "responses": {
          "200": {
            "description": "Formulario enviado correctamente"
          }
        }
      }
    }
  }
}
```

#### Lambda Functions
```javascript
// lambda-scripts/CAPI/lambda_function.py
import json
import requests

def lambda_handler(event, context):
    # Lógica para Meta Conversions API
    return {
        'statusCode': 200,
        'body': json.dumps('Success')
    }
```

## 🛡️ Gestión de reCAPTCHA v3

### Configuración

El proyecto utiliza **reCAPTCHA v3** para protección invisible contra bots. La implementación incluye:

#### Frontend (React)
```javascript
// src/config/recaptcha.js
const RECAPTCHA_CONFIG = {
  development: {
    siteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Test key
  },
  production: {
    siteKey: '6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL', // Real key
  }
};
```

#### Backend (Lambda)
```python
# lambda-scripts/submit-form-integrated.py
def validate_recaptcha_v3(token: str, client_ip: str) -> dict:
    """Valida token de reCAPTCHA v3 con Google"""
    # Validación server-side
    # Retorna score, action, hostname, etc.
```

### Sistema de Evaluación

#### Scores y Acciones Automáticas

| Score | Categoría | Acción | Comportamiento |
|-------|-----------|--------|----------------|
| ≥0.9 | 🔵 EXCELLENT | `ALLOW` | Acceso completo |
| 0.7-0.9 | 🟢 GOOD | `ALLOW` | Acceso completo |
| 0.5-0.7 | 🟡 MEDIUM | `MONITORING` | Permitir + monitorear |
| 0.3-0.5 | 🟠 LOW | `CHALLENGE` | Permitir + revisar |
| <0.3 | 🔴 VERY_LOW | `BLOCK` | Bloquear acceso |

#### Acciones Específicas por Servicio

- **Mailchimp**: Se envía siempre (excepto si está bloqueado)
- **Meta CAPI**: Solo si aceptó cookies Y no está bloqueado
- **Logs**: Detallados con emojis y categorías

### Configuración de Claves

#### Desarrollo
```env
# Usar claves de prueba de Google
RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

#### Producción
```env
# Claves reales para metodovende.es
RECAPTCHA_SITE_KEY=6LcvpngrAAAAANqmo28MvQayGcfjEatSBT7C_ziL
RECAPTCHA_SECRET_KEY=TU_SECRET_KEY_REAL
```

### Implementación en el Formulario

```jsx
// src/components/FormSection.jsx
const executeRecaptcha = async () => {
  try {
    if (window.grecaptcha && window.grecaptcha.ready) {
      const token = await window.grecaptcha.execute(
        RECAPTCHA_SITE_KEY, 
        {action: 'submit'}
      );
      return token;
    }
  } catch (error) {
    setRecaptchaError('Error de verificación de seguridad');
    return null;
  }
};
```

### Logs y Monitoreo

#### Logs Automáticos
```
=== EXECUTING reCAPTCHA ACTION: ALLOW_WITH_MONITORING ===
Score: 0.6 - MEDIUM
Action Description: Permitir pero monitorear
👁️ MONITORING: Score medium (0.6) - Allowing with monitoring
📧 Sending to Mailchimp...
📊 Sending to Meta CAPI...
🔍 Adding monitoring data...
=== COMPLETED reCAPTCHA ACTIONS ===
Actions taken: ['MONITORING_ENABLED', 'MAILCHIMP_SUCCESS', 'META_CAPI_SUCCESS']
```

#### Métricas Recomendadas
- `recaptcha_score_distribution` - Distribución de scores
- `recaptcha_actions_taken` - Acciones ejecutadas
- `blocked_submissions` - Envíos bloqueados

### Personalización

#### Ajustar Umbrales
```python
# En lambda-scripts/submit-form-integrated.py
if score >= 0.95:      # Más estricto
elif score >= 0.8:    
elif score >= 0.6:    
elif score >= 0.4:    
else:                 

# O más permisivo
if score >= 0.8:      
elif score >= 0.6:    
elif score >= 0.4:    
elif score >= 0.2:    
else:                 
```

#### Acciones Adicionales
- **Rate Limiting** por IP
- **Alertas** por email para scores bajos
- **Blacklist/Whitelist** de IPs
- **Métricas** en CloudWatch

### Consideraciones de Seguridad

1. **Nunca confíes solo en reCAPTCHA** - Combina con otras medidas
2. **Monitorea patrones** - Busca ataques coordinados
3. **Ajusta umbrales gradualmente** - Basado en datos reales
4. **Mantén logs** - Para análisis forense
5. **Respetar GDPR** - Solo enviar a Meta si hay consentimiento

## 📚 Buenas Prácticas

### React
- [React Documentation](https://react.dev/)
- [React Best Practices](https://react.dev/learn)
- [React Performance](https://react.dev/learn/render-and-commit)
- [React Hooks](https://react.dev/reference/react)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind Best Practices](https://tailwindcss.com/docs/guides/best-practices)
- [Tailwind Components](https://tailwindui.com/)

### Performance
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals](https://web.dev/core-web-vitals/)

### SEO
- [Meta Tags](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
- [Structured Data](https://developers.google.com/search/docs/advanced/structured-data)
- [Sitemap](https://developers.google.com/search/docs/advanced/sitemaps/overview)

### Analytics
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Meta Pixel](https://developers.facebook.com/docs/facebook-pixel/)
- [GTM](https://developers.google.com/tag-manager)

### AWS
- [AWS Amplify](https://docs.aws.amazon.com/amplify/)
- [Route53](https://docs.aws.amazon.com/route53/)
- [API Gateway](https://docs.aws.amazon.com/apigateway/)
- [Lambda](https://docs.aws.amazon.com/lambda/)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)

## 🤝 Contribución

### Guías de Contribución

1. **Fork del repositorio**
2. **Crear rama feature**
```bash
git checkout -b feature/nueva-funcionalidad
```

3. **Desarrollar cambios**
   - Seguir las buenas prácticas de React
   - Usar Tailwind CSS para estilos
   - Mantener consistencia en el código

4. **Testing**
```bash
npm run lint
npm run build
```

5. **Commit y Push**
```bash
git add .
git commit -m "feat: añadir nueva funcionalidad"
git push origin feature/nueva-funcionalidad
```

6. **Crear Pull Request**

### Estándares de Código

- **Nomenclatura**: camelCase para variables, PascalCase para componentes
- **Imports**: Agrupar por tipo (React, librerías, componentes locales)
- **Componentes**: Funcionales con hooks
- **Estilos**: Tailwind CSS classes
- **Comentarios**: JSDoc para funciones complejas

### Checklist de PR

- [ ] Código linted y sin errores
- [ ] Build exitoso
- [ ] Responsive design verificado
- [ ] Analytics funcionando
- [ ] Cookies gestionadas correctamente
- [ ] Performance optimizada

## 📄 Licencia

Este proyecto está bajo la Licencia Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0).

### ¿Qué significa esta licencia?

**Permitido:**
- ✅ Ver y descargar el código
- ✅ Usar para fines educativos
- ✅ Compartir el código

**No Permitido:**
- ❌ Usar para fines comerciales
- ❌ Modificar o crear obras derivadas
- ❌ Distribuir versiones modificadas
- ❌ Usar sin atribución

### Atribución Requerida

Si usas este código, debes incluir:

```
Basado en "Método V.E.N.D.E. Landing Page" 
por Rubén Casado Domínguez - https://github.com/RubenK01/landing-realestate
Licencia: CC BY-NC-ND 4.0
```

### Aplicación de la Licencia

Esta licencia protege tu trabajo de:
- Uso comercial no autorizado
- Modificaciones sin permiso
- Plagio sin atribución

Para uso comercial o modificaciones, contacta al autor.

---

## 📞 Contacto

- **Autor**: Rubén Casado Domínguez
- **Email**: rbn994@gmail.com
- **GitHub**: https://github.com/RubenK01
- **LinkedIn**: https://www.linkedin.com/in/ruben-casado-00ads1

## 🙏 Agradecimientos

- React Team por el framework
- Tailwind CSS por el sistema de diseño
- Vite por las herramientas de build
- Comunidad open source

---

**⭐ Si este proyecto te ha sido útil, considera darle una estrella en GitHub.** 