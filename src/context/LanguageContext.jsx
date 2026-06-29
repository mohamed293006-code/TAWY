import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("tawy_language") || "ar";
    } catch {
      return "ar";
    }
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem("tawy_language", language);
    } catch (error) {
      console.error("LanguageContext: save error ->", error);
    }
  }, [language]);

  function toggleLanguage() {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"));
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}