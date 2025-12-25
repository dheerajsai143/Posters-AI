
import React, { createContext, useState, useContext, useCallback } from 'react';
import { translations, TranslationKeys } from '../translations';

export type Language = 'en' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: TranslationKeys): string => {
    return translations[language][key] || translations['en'][key] || key;
  }, [language]);

  // FIX: Replaced JSX with React.createElement. JSX syntax is not allowed in .ts files and was causing compilation errors.
  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
