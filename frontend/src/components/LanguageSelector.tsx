'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    // Load Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Translate (hidden)
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,mr',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element_hidden'
        );
      }
    };

    return () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    
    // Wait for Google Translate to load
    const checkAndChange = () => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = lang;
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        // Retry after a short delay if not loaded yet
        setTimeout(checkAndChange, 100);
      }
    };
    
    setTimeout(checkAndChange, 100);
  };

  return (
    <>
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element_hidden" className="hidden"></div>
      
      {/* Custom Language Buttons */}
      <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-2 py-1 rounded transition-all ${
            currentLang === 'en'
              ? 'text-amber-400 bg-amber-400/10'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          ENG
        </button>
        <span className="text-gray-600">|</span>
        <button
          onClick={() => changeLanguage('hi')}
          className={`px-2 py-1 rounded transition-all ${
            currentLang === 'hi'
              ? 'text-amber-400 bg-amber-400/10'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          HIN
        </button>
        <span className="text-gray-600">|</span>
        <button
          onClick={() => changeLanguage('mr')}
          className={`px-2 py-1 rounded transition-all ${
            currentLang === 'mr'
              ? 'text-amber-400 bg-amber-400/10'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          MAR
        </button>
      </div>
    </>
  );
}
