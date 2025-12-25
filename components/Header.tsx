
import React from 'react';
import { LogoIcon, UserIcon } from './IconComponents';
import { useTranslation } from '../hooks/useTranslation';

interface HeaderProps {
    onProfileClick: () => void;
    profilePic: string | null;
}

export const Header: React.FC<HeaderProps> = ({ onProfileClick, profilePic }) => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <header className="bg-slate-950/70 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <LogoIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {t('header.title')} <span className="text-cyan-400">{t('header.title.ai')}</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <label htmlFor="language-switcher" className="sr-only">{t('language.switcher.label')}</label>
            <select
              id="language-switcher"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'te')}
              className="bg-slate-800 border border-slate-700 rounded-md pl-3 pr-8 py-1.5 text-sm focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <button
            onClick={onProfileClick}
            className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 overflow-hidden"
          >
            {profilePic ? (
                <img src={profilePic} alt="User Profile" className="w-full h-full object-cover" />
            ) : (
                <UserIcon className="w-full h-full text-slate-400 p-1.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};