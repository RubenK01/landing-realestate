# 🎯 Opciones para el Badge de reCAPTCHA v3

## 📍 Posiciones Disponibles

### 1. **Esquina Inferior Izquierda** (Actual)
```html
<body class="recaptcha-left">
```
- Badge visible en la esquina inferior izquierda
- No interfiere con tu firma en la derecha

### 2. **Badge Oculto + Texto Personalizado**
```html
<body class="recaptcha-hidden">
```
- Oculta completamente el badge de Google
- Muestra texto personalizado en la esquina inferior izquierda
- Cumple con los requisitos legales de reCAPTCHA

### 3. **Badge Pequeño y Discreto**
```html
<body class="recaptcha-small">
```
- Badge más pequeño (80% del tamaño original)
- Posicionado con margen desde las esquinas
- Menos intrusivo

### 4. **Esquina Superior Izquierda**
```html
<body class="recaptcha-top-left">
```
- Badge en la esquina superior izquierda
- Útil si tienes contenido importante en la parte inferior

### 5. **Esquina Superior Derecha**
```html
<body class="recaptcha-top-right">
```
- Badge en la esquina superior derecha
- Alternativa si la izquierda está ocupada

### 6. **Badge Inteligente** (Recomendado)
```html
<body class="recaptcha-smart">
```
- **Desktop (>1024px)**: Esquina inferior izquierda
- **Tablet (769-1024px)**: Esquina superior izquierda
- **Móvil (481-768px)**: Esquina superior derecha
- **Móvil pequeño (≤480px)**: Centrado arriba
- Se adapta automáticamente al tamaño de pantalla
- Evita conflictos con tu firma en cualquier dispositivo

## 🔧 Cómo Cambiar la Posición

1. **Edita `index.html`**:
   ```html
   <!-- Cambia la clase en el body -->
   <body class="recaptcha-left">  <!-- Opción actual -->
   <body class="recaptcha-hidden"> <!-- Para ocultar -->
   <body class="recaptcha-small">  <!-- Para hacer pequeño -->
   ```

2. **O usa JavaScript dinámicamente**:
   ```javascript
   // Cambiar a badge oculto
   document.body.className = 'recaptcha-hidden';
   
   // Cambiar a badge pequeño
   document.body.className = 'recaptcha-small';
   ```

## 📱 Responsive

- En móviles, el texto se hace más pequeño
- El badge se escala automáticamente
- Las posiciones se mantienen consistentes

## ⚖️ Requisitos Legales

**Importante**: Si ocultas el badge, DEBES mostrar el texto personalizado:
```html
<div class="recaptcha-text">
  Este sitio está protegido por reCAPTCHA y se aplican la 
  <a href="https://policies.google.com/privacy">Política de Privacidad</a> 
  y los <a href="https://policies.google.com/terms">Términos de Servicio</a> 
  de Google.
</div>
```

## 🎨 Personalización

Puedes modificar los estilos en `src/recaptcha-styles.css`:
- Cambiar colores del texto
- Ajustar tamaños
- Modificar posiciones
- Añadir efectos visuales

## 💡 Recomendación

Para tu caso específico (firma en la derecha), recomiendo:
1. **`recaptcha-smart`** - **RECOMENDADO** - Se adapta automáticamente a todos los dispositivos
2. **`recaptcha-hidden`** - Si prefieres solo texto (más limpio)
3. **`recaptcha-small`** - Si quieres un compromiso entre ambos
4. **`recaptcha-left`** - Solo para desktop, puede tapar firma en móvil 