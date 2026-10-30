import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../../lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('hamutuk_lang') || 'tet';
  });

  useEffect(() => {
    localStorage.setItem('hamutuk_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    if (translations[lang] && translations[lang][key]) {
      return translations[lang][key];
    }
    if (translations.tet[key]) {
      return translations.tet[key];
    }
    return key;
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'tet' ? 'en' : 'tet'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
