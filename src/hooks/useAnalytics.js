import { useEffect } from 'react';
import { Cookies } from 'react-cookie-consent';

export const useAnalytics = (cookiesAccepted) => {
  useEffect(() => {
    // Verificar tanto el estado local como la cookie
    const consentCookie = Cookies.get('consentCookies');
    const shouldLoadAnalytics = cookiesAccepted && consentCookie === 'true';
    
    if (shouldLoadAnalytics) {
      // Google Analytics
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=G-8Q97YPVKCP`;
      document.head.appendChild(gaScript);
      const gaScript2 = document.createElement('script');
      gaScript2.innerHTML = `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-8Q97YPVKCP');`;
      document.head.appendChild(gaScript2);

      // Google Tag Manager
      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-WHZN597J');`;
      document.head.appendChild(gtmScript);

      // Facebook Pixel (patrón robusto para React/Vite)
      if (!window.fbq) {
        // Define fbq
        window.fbq = function () {
          window.fbq.callMethod
            ? window.fbq.callMethod.apply(window.fbq, arguments)
            : window.fbq.queue.push(arguments);
        };
        window.fbq.queue = [];
        window.fbq.loaded = true;
        window.fbq.version = '2.0';
        // Carga el script externo
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        script.onload = () => {
          window.fbq('init', '1274266927426416');
          window.fbq('track', 'PageView');
        };
        document.head.appendChild(script);
      } else {
        // Si ya existe, solo trackea PageView
        window.fbq('track', 'PageView');
      }
      // Añadir el <noscript> solo una vez
      if (!document.getElementById('fb-pixel-noscript')) {
        const fbNoscript = document.createElement('noscript');
        fbNoscript.id = 'fb-pixel-noscript';
        fbNoscript.innerHTML = `<img height="1" width="1" src="https://www.facebook.com/tr?id=1274266927426416&ev=PageView&noscript=1"/>`;
        document.body.prepend(fbNoscript);
      }

      // Google Tag Manager noscript (body)
      const gtmNoscript = document.createElement('noscript');
      gtmNoscript.innerHTML = `<iframe src=\"https://www.googletagmanager.com/ns.html?id=GTM-WHZN597J\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe>`;
      document.body.prepend(gtmNoscript);
    }
  }, [cookiesAccepted]);
}; 