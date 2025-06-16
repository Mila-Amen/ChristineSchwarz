import React, { createContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import de from "../locales/de.json";

const translations = { EN: en, DE: de };

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("EN");
  const [dictionary, setDictionary] = useState(translations[language]);

  useEffect(() => {
    setDictionary(translations[language]);
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
};
