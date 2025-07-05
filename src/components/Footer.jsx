import React from 'react';

const Footer = () => (
  <footer className="w-full flex justify-end items-center pr-6 pb-2 mt-8 gap-3 pb-14 md:pb-4">
    <span className="text-xs md:text-sm text-gray-500 opacity-70 flex items-center gap-1">
      Powered by{' '}
      <a
        href="https://www.linkedin.com/in/ruben-casado-00ads1"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white font-bold no-underline hover:underline hover:text-gray-300 transition-colors"
      >
        RubenK
      </a>
      <a
        href="https://wa.me/34664656038"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-2 text-green-500 hover:text-green-600 transition-colors flex items-center"
        aria-label="WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block align-middle"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.85.504 3.58 1.38 5.07L2 22l5.09-1.36A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm0 18a7.95 7.95 0 0 1-4.09-1.13l-.29-.17-3.02.8.8-2.95-.19-.3A7.96 7.96 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8Zm4.43-5.29c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.12-.12.27-.31.4-.47.13-.16.17-.28.25-.47.08-.19.04-.35-.02-.47-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42-.14-.01-.31-.01-.48-.01-.17 0-.45.07-.68.33-.23.26-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.57.12.17 1.67 2.67 4.04 3.74.56.24 1 .38 1.34.48.56.18 1.07.16 1.47.1.45-.07 1.38-.56 1.58-1.1.2-.54.2-1.01.14-1.1-.06-.09-.22-.15-.46-.27Z" fill="currentColor"/>
        </svg>
      </a>
    </span>
  </footer>
);

export default Footer; 