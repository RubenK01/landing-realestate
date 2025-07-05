// Script para posicionar automáticamente el badge de reCAPTCHA
// evitando la firma del usuario

class RecaptchaPositioner {
  constructor() {
    this.badge = null;
    this.signatureElements = [];
    this.init();
  }

  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Buscar el badge de reCAPTCHA
    this.findBadge();
    
    // Buscar elementos que podrían ser la firma
    this.findSignatureElements();
    
    // Posicionar el badge
    this.positionBadge();
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', () => this.positionBadge());
    
    // Observar cambios en el DOM
    this.observeDOM();
  }

  findBadge() {
    // Buscar el badge de reCAPTCHA
    this.badge = document.querySelector('.grecaptcha-badge');
    
    if (!this.badge) {
      // Si no existe, esperar y buscar de nuevo
      setTimeout(() => this.findBadge(), 1000);
      return;
    }
    
    console.log('✅ Badge de reCAPTCHA encontrado');
  }

  findSignatureElements() {
    // Buscar elementos que podrían ser la firma
    const selectors = [
      '[class*="firma"]',
      '[class*="signature"]',
      '[id*="firma"]',
      '[id*="signature"]',
      'footer',
      '.footer',
      '#footer',
      '[class*="footer"]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.offsetHeight > 0) {
          this.signatureElements.push(el);
        }
      });
    });

    console.log(`🔍 Encontrados ${this.signatureElements.length} elementos de firma`);
  }

  positionBadge() {
    if (!this.badge) return;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Determinar la mejor posición según el tamaño de pantalla
    const position = this.getBestPosition(viewport);
    
    // Aplicar la posición
    this.applyPosition(position);
    
    console.log(`📍 Badge posicionado en: ${position.location} (${viewport.width}x${viewport.height})`);
  }

  getBestPosition(viewport) {
    // Desktop grande
    if (viewport.width > 1024) {
      return {
        location: 'bottom-left',
        styles: {
          left: '0',
          right: 'auto',
          bottom: '0',
          top: 'auto',
          transform: 'scale(1)'
        }
      };
    }
    
    // Tablet
    if (viewport.width > 768) {
      return {
        location: 'top-left',
        styles: {
          left: '0',
          right: 'auto',
          top: '0',
          bottom: 'auto',
          transform: 'scale(0.9)'
        }
      };
    }
    
    // Móvil
    if (viewport.width > 480) {
      return {
        location: 'top-right',
        styles: {
          left: 'auto',
          right: '0',
          top: '0',
          bottom: 'auto',
          transform: 'scale(0.7)'
        }
      };
    }
    
    // Móvil muy pequeño
    return {
      location: 'top-center',
      styles: {
        left: '50%',
        right: 'auto',
        top: '0',
        bottom: 'auto',
        transform: 'translateX(-50%) scale(0.6)'
      }
    };
  }

  applyPosition(position) {
    if (!this.badge) return;

    // Aplicar estilos
    Object.entries(position.styles).forEach(([property, value]) => {
      this.badge.style[property] = value;
    });

    // Asegurar que esté fijo y visible
    this.badge.style.position = 'fixed';
    this.badge.style.zIndex = '9999';
    this.badge.style.visibility = 'visible';
    this.badge.style.opacity = '1';
  }

  observeDOM() {
    // Observar cambios en el DOM para detectar cuando se añade la firma
    const observer = new MutationObserver((mutations) => {
      let shouldReposition = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.classList && (
                node.classList.contains('firma') ||
                node.classList.contains('signature') ||
                node.classList.contains('footer')
              )) {
                shouldReposition = true;
              }
            }
          });
        }
      });
      
      if (shouldReposition) {
        setTimeout(() => this.positionBadge(), 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Inicializar cuando el script se carga
if (typeof window !== 'undefined') {
  window.recaptchaPositioner = new RecaptchaPositioner();
}

export default RecaptchaPositioner; 