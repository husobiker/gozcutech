import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false); // Dropdown'u kapat
  };

  const currentLanguage = i18n.language;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentLanguage === "tr"
            ? "TR"
            : currentLanguage === "en"
            ? "EN"
            : currentLanguage === "de"
            ? "DE"
            : currentLanguage === "fr"
            ? "FR"
            : currentLanguage === "es"
            ? "ES"
            : currentLanguage === "it"
            ? "IT"
            : "TR"}
        </span>
      </motion.button>

      {/* Language Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
          <button
            onClick={() => changeLanguage("tr")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
              currentLanguage === "tr"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            🇹🇷 Türkçe
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
              currentLanguage === "en"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => changeLanguage("de")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
              currentLanguage === "de"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            🇩🇪 Deutsch
          </button>
          <button
            onClick={() => changeLanguage("fr")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
              currentLanguage === "fr"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            🇫🇷 Français
          </button>
          <button
            onClick={() => changeLanguage("es")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
              currentLanguage === "es"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            🇪🇸 Español
          </button>
          <button
            onClick={() => changeLanguage("it")}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 ${
              currentLanguage === "it"
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                : "text-slate-700 dark:text-slate-300"
            }`}
          >
            🇮🇹 Italiano
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
