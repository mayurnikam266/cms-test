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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    if (document.querySelector('script[src*="translate.google.com"]')) {
      setIsLoaded(true);
      return;
    }

    // Load Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,mr',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
        
        // Wait a bit for the element to be fully initialized
        setTimeout(() => {
          setIsLoaded(true);
        }, 1000);
      }
    };

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const changeLanguage = (lang: string) => {
    setCurrentLang(lang);
    
    // Try multiple times to find and trigger the select
    let attempts = 0;
    const maxAttempts = 20;
    
    const triggerChange = () => {
      const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      
      if (selectElement) {
        selectElement.value = lang;
        
        // Try multiple event types to ensure it triggers
        selectElement.dispatchEvent(new Event('change', { bubbles: true }));
        selectElement.dispatchEvent(new Event('click', { bubbles: true }));
        
        // Force focus and blur to trigger change
        selectElement.focus();
        selectElement.blur();
        
        // Also try native change
        const event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, false);
        selectElement.dispatchEvent(event);
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(triggerChange, 200);
        }
      }
    };
    
    triggerChange();
  };

  return (
    <>
      {/* Google Translate Element - Hidden but functional */}
      <div id="google_translate_element" style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}></div>
      
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
