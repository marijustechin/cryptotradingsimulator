import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
];

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('selectedLanguage', code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg shadow hover:bg-slate-700 cursor-pointer"
      >
        {languages.find((l) => l.code === i18n.language)?.flag}{' '}
        {i18n.language.toUpperCase()}
      </button>
      {isOpen && (
        <ul className="absolute right-0 mt-2 w-32 bg-slate-900 shadow-lg rounded-lg overflow-hidden">
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-slate-950"
            >
              {lang.flag} {lang.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
