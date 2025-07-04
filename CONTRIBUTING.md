# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto Método V.E.N.D.E. Landing Page!

## 📋 Índice

- [Cómo Contribuir](#-cómo-contribuir)
- [Configuración del Entorno](#-configuración-del-entorno)
- [Estructura del Código](#-estructura-del-código)
- [Estándares de Código](#-estándares-de-código)
- [Testing](#-testing)
- [Pull Request](#-pull-request)
- [Reportar Bugs](#-reportar-bugs)
- [Solicitar Features](#-solicitar-features)

## 🚀 Cómo Contribuir

### 1. Fork del Repositorio

1. Ve a [GitHub](https://github.com/RubenK01/landing-realestate)
2. Haz clic en "Fork" en la esquina superior derecha
3. Clona tu fork localmente:

```bash
git clone https://github.com/RubenK01/landing-realestate.git
cd landing-realstate
```

### 2. Configurar el Entorno

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

### 3. Crear una Rama

```bash
git checkout -b feature/nombre-de-la-funcionalidad
# o
git checkout -b fix/nombre-del-bug
```

## ⚙️ Configuración del Entorno

### Variables de Entorno Requeridas

Crea un archivo `.env.local` en `landing-frontend/`:

```env
# Analytics (obligatorias para testing)
VITE_GA_ID=G-XXXXXXXXXX
VITE_META_PIXEL_ID=XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX

# APIs (puedes usar URLs de prueba)
VITE_API_URL=https://httpbin.org/post
VITE_META_CONVERSIONS_API=https://httpbin.org/post
```

### Herramientas de Desarrollo

- **VS Code** (recomendado)
- **React Developer Tools** (extensión del navegador)
- **Tailwind CSS IntelliSense** (extensión VS Code)

## 🏗️ Estructura del Código

### Componentes

```jsx
// Ejemplo de estructura de componente
import React, { useState, useEffect } from 'react';

/**
 * Descripción del componente
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del componente
 * @returns {JSX.Element} Componente renderizado
 */
const MiComponente = ({ title, children }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Lógica del efecto
  }, []);

  const handleClick = () => {
    // Lógica del evento
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
    </div>
  );
};

export default MiComponente;
```

### Hooks Personalizados

```jsx
// hooks/useCustomHook.js
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar datos
 * @param {string} url - URL de la API
 * @returns {Object} Datos y estado de carga
 */
export const useCustomHook = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lógica del hook
  }, [url]);

  return { data, loading };
};
```

## 📝 Estándares de Código

### Nomenclatura

- **Componentes**: PascalCase (`MiComponente`)
- **Funciones**: camelCase (`miFuncion`)
- **Variables**: camelCase (`miVariable`)
- **Constantes**: UPPER_SNAKE_CASE (`MI_CONSTANTE`)
- **Archivos**: kebab-case (`mi-componente.jsx`)

### Imports

```jsx
// 1. React y librerías externas
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 2. Componentes locales
import MiComponente from './MiComponente';
import OtroComponente from '../components/OtroComponente';

// 3. Hooks y utilidades
import { useCustomHook } from '../hooks/useCustomHook';
import { formatDate } from '../utils/dateUtils';

// 4. Estilos
import './MiComponente.css';
```

### Estilos con Tailwind

```jsx
// ✅ Bueno - Clases organizadas
<div className="
  flex items-center justify-between
  p-4 bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow duration-300
">
  Contenido
</div>

// ❌ Malo - Clases desordenadas
<div className="bg-white p-4 flex shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300 items-center justify-between">
  Contenido
</div>
```

### Comentarios

```jsx
/**
 * Componente que maneja el formulario de contacto
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSubmit - Función llamada al enviar el formulario
 * @param {boolean} props.loading - Estado de carga
 */
const FormSection = ({ onSubmit, loading }) => {
  // Estado local para el formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Función para manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    // JSX del componente
  );
};
```

## 🧪 Testing

### Testing Manual

Antes de enviar un PR, verifica:

- [ ] **Responsive Design**: Prueba en móvil, tablet y desktop
- [ ] **Funcionalidad**: Todas las características funcionan correctamente
- [ ] **Performance**: La página carga rápidamente
- [ ] **Accesibilidad**: Usa herramientas como Lighthouse
- [ ] **Cross-browser**: Prueba en Chrome, Firefox, Safari, Edge

### Testing Automatizado

```bash
# Linting
npm run lint

# Build de producción
npm run build

# Preview del build
npm run preview
```

### Checklist de Testing

```markdown
## ✅ Checklist de Testing

### Funcionalidad
- [ ] Formulario envía datos correctamente
- [ ] Banner de cookies funciona
- [ ] Navegación entre páginas
- [ ] Analytics se cargan (si hay consentimiento)
- [ ] Videos se reproducen
- [ ] Enlaces funcionan

### Responsive
- [ ] Móvil (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)

### Performance
- [ ] Lighthouse Score > 90
- [ ] Tiempo de carga < 3s
- [ ] Imágenes optimizadas
- [ ] JavaScript minificado

### Accesibilidad
- [ ] Contraste de colores adecuado
- [ ] Navegación por teclado
- [ ] Screen readers compatibles
- [ ] Alt text en imágenes
```

## 🔄 Pull Request

### Antes de Crear el PR

1. **Sincronizar con el repositorio principal**
```bash
git remote add upstream https://github.com/RubenK01/landing-realestate.git
git fetch upstream
git checkout main
git merge upstream/main
```

2. **Actualizar tu rama**
```bash
git checkout tu-rama
git rebase main
```

3. **Verificar que todo funciona**
```bash
npm run lint
npm run build
```

### Crear el Pull Request

1. **Título descriptivo**
```
feat: añadir validación de email en formulario
fix: corregir problema de responsive en móvil
docs: actualizar documentación de instalación
```

2. **Descripción detallada**
```markdown
## Descripción
Breve descripción de los cambios realizados.

## Cambios Realizados
- [ ] Cambio 1
- [ ] Cambio 2
- [ ] Cambio 3

## Testing
- [ ] Probado en Chrome
- [ ] Probado en móvil
- [ ] Build exitoso

## Screenshots (si aplica)
[Incluir capturas de pantalla]

## Checklist
- [ ] Código sigue los estándares
- [ ] Documentación actualizada
- [ ] Tests pasan
- [ ] Responsive design verificado
```

### Template de PR

```markdown
## 🎯 Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Mejora de performance
- [ ] Documentación
- [ ] Refactoring

## 📝 Descripción
Describe brevemente los cambios realizados.

## 🔧 Cambios Realizados
- Lista de cambios específicos

## 🧪 Testing
- [ ] Responsive design verificado
- [ ] Funcionalidad probada
- [ ] Performance optimizada
- [ ] Build exitoso

## 📸 Screenshots
[Incluir capturas si es necesario]

## 📋 Checklist
- [ ] Código linted
- [ ] Build exitoso
- [ ] Documentación actualizada
- [ ] Tests pasan
```

## 🐛 Reportar Bugs

### Template de Bug Report

```markdown
## 🐛 Descripción del Bug
Descripción clara y concisa del problema.

## 🔄 Pasos para Reproducir
1. Ir a '...'
2. Hacer clic en '...'
3. Scroll hasta '...'
4. Ver error

## ✅ Comportamiento Esperado
Lo que debería pasar.

## ❌ Comportamiento Actual
Lo que está pasando.

## 📱 Información del Sistema
- **Navegador**: Chrome 120.0
- **Sistema Operativo**: Windows 11
- **Dispositivo**: Desktop/Mobile
- **URL**: https://metodovende.es

## 📸 Screenshots
[Incluir capturas de pantalla]

## 📋 Información Adicional
Cualquier contexto adicional.
```

## 💡 Solicitar Features

### Template de Feature Request

```markdown
## 🎯 Descripción de la Feature
Descripción clara de la funcionalidad deseada.

## 💭 Caso de Uso
Explicar por qué esta feature sería útil.

## 🎨 Diseño Sugerido
[Incluir mockups o descripción del diseño]

## 🔧 Implementación Sugerida
Cómo crees que se podría implementar.

## 📋 Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3
```

## 📞 Contacto

Si tienes preguntas sobre cómo contribuir:

- **Issues**: [GitHub Issues](https://github.com/RubenK01/landing-realestate/issues)
- **Email**: rbn994@gmail.com

## 🙏 Agradecimientos

¡Gracias por contribuir al proyecto! Tu trabajo ayuda a mejorar la experiencia de miles de usuarios.

---

**Recuerda**: Cada contribución, por pequeña que sea, es valiosa para el proyecto. ¡Gracias por tu tiempo y esfuerzo! 