import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '/gb.svg' },
  { code: 'lt', name: 'Lietuvių', flag: '/lt.svg' },
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('selectedLanguage', code);
    setIsOpen(false);
  };

  const currentLang = languages.find((l) => l.code === i18n.language);

  return (
    <div className="relative z-56">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-2 bg-slate-800 text-slate-200 rounded-lg shadow hover:bg-slate-700 cursor-pointer"
      >
        {currentLang && (
          <img src={currentLang.flag} alt={currentLang.name} className="w-5 h-4" />
        )}
        {i18n.language.toUpperCase()}
      </button>
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-40 bg-slate-900 shadow-lg rounded-lg overflow-hidden">
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-slate-950"
            >
              <img src={lang.flag} alt={lang.name} className="w-5 h-4" />
              {lang.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
