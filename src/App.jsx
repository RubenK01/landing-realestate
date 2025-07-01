import React, { useEffect, useState } from 'react';
import VideoSection from './components/VideoSection';
import FormSection from './components/FormSection';
import CookieConsent, { Cookies } from 'react-cookie-consent';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// IDs ficticios para reemplazar fácilmente
const GA_ID = 'TU_GA_ID';
const PIXEL_ID = 'TU_PIXEL_ID';

// Página de política de cookies
function PoliticaCookies() {
  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Política de Cookies</h1>
      <p className="max-w-xl text-justify text-gray-200 mb-2">
        Utilizamos cookies propias y de terceros para analizar el uso de la web y mostrarte publicidad personalizada. Puedes aceptar o rechazar las cookies en cualquier momento. Para más información, consulta esta política.
      </p>
      <p className="max-w-xl text-justify text-gray-400 text-sm">
        Las cookies son pequeños archivos que se almacenan en tu dispositivo para mejorar tu experiencia de navegación. Puedes configurar tu navegador para bloquearlas, pero algunas funcionalidades pueden verse afectadas.
      </p>
    </div>
  );
}

// Página de política de privacidad
function PoliticaPrivacidad() {
  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Política de Privacidad</h1>
      <p className="max-w-xl text-justify text-gray-200 mb-2">
        Tus datos personales serán tratados de forma confidencial y solo se utilizarán para gestionar tu solicitud y enviarte información relacionada. No compartimos tus datos con terceros sin tu consentimiento.
      </p>
      <p className="max-w-xl text-justify text-gray-400 text-sm">
        Puedes ejercer tus derechos de acceso, rectificación y supresión enviando un email a nuestro contacto. Para más detalles, consulta esta política.
      </p>
    </div>
  );
}

function App() {
  // Estado para saber si el usuario ha aceptado cookies
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    // Leer la cookie de consentimiento
    const consent = Cookies.get('consentCookies');
    if (consent === 'true') {
      setCookiesAccepted(true);
    }
  }, []);

  // Cargar scripts de Analytics y Pixel solo si el usuario acepta
  useEffect(() => {
    if (cookiesAccepted) {
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

      // Facebook Pixel
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1274266927426416'); 
      fbq('track', 'PageView');`;
      document.head.appendChild(fbScript);

      // Facebook Domain Verification meta
      const fbMeta = document.createElement('meta');
      fbMeta.setAttribute('name', 'facebook-domain-verification');
      fbMeta.setAttribute('content', '8is5bwhcw6flaidmo7p1ygieye0fa9');
      document.head.appendChild(fbMeta);

      // Google Tag Manager noscript (body)
      const gtmNoscript = document.createElement('noscript');
      gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WHZN597J" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.prepend(gtmNoscript);

      // Facebook Pixel noscript (body)
      const fbNoscript = document.createElement('noscript');
      fbNoscript.innerHTML = `<img height="1" width="1" src="https://www.facebook.com/tr?id=1274266927426416&ev=PageView&noscript=1"/>`;
      document.body.prepend(fbNoscript);
    }
  }, [cookiesAccepted]);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Área principal siempre centrada */}
      <div className="flex-1 flex items-center justify-center">
        <Routes>
          <Route
            path="/"
            element={
              <div className="w-full max-w-[920px] flex flex-col lg:flex-row mx-auto my-auto">
                {/* Video Section - 50% width on large screens, full width on mobile */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
                  <VideoSection />
                </div>
                {/* Form Section - 50% width on large screens, full width on mobile */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
                  <FormSection />
                </div>
              </div>
            }
          />
          <Route path="/politica-cookies" element={<PoliticaCookies />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        </Routes>
      </div>
      {/* Banner de cookies siempre fixed abajo */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <CookieConsent
          location="bottom"
          buttonText="Aceptar"
          declineButtonText="Rechazar"
          cookieName="consentCookies"
          style={{ background: '#222', color: '#fff', fontSize: '0.95rem', justifyContent: 'center' }}
          buttonStyle={{ background: '#2563eb', color: '#fff', fontWeight: 'bold', borderRadius: '0.375rem', padding: '0.5rem 1.5rem', marginRight: '1rem' }}
          declineButtonStyle={{ background: '#fff', color: '#222', fontWeight: 'bold', borderRadius: '0.375rem', padding: '0.5rem 1.5rem' }}
          enableDeclineButton
          onAccept={() => setCookiesAccepted(true)}
          onDecline={() => setCookiesAccepted(false)}
          expires={365}
          // El banner se muestra si la cookie no existe o se borra
        >
          Esta web utiliza cookies propias y de terceros para análisis y publicidad. Consulta nuestra{' '}
          <a
            href="/politica-cookies"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline', color: '#60a5fa' }}
          >
            política de cookies
          </a>
          {' '}y nuestra{' '}
          <a
            href="/politica-privacidad"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline', color: '#60a5fa' }}
          >
            política de privacidad
          </a>
          .
        </CookieConsent>
      </div>
    </div>
  );
}

export default App;
