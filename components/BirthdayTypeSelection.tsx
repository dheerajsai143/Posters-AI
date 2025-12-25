
import React from 'react';
import type { BirthdayType } from '../types';
import { BackIcon, BirthdayIcon } from './IconComponents';
import { useTranslation } from '../hooks/useTranslation';
import type { TranslationKeys } from '../translations';


interface BirthdayTypeSelectionProps {
  onSelect: (type: BirthdayType) => void;
  onBack: () => void;
}

const birthdayTypes: { type: BirthdayType, titleKey: TranslationKeys, descriptionKey: TranslationKeys }[] = [
    { type: 'Advance', titleKey: 'birthdayType.Advance', descriptionKey: 'birthdayType.Advance.description' },
    { type: 'Standard', titleKey: 'birthdayType.Standard', descriptionKey: 'birthdayType.Standard.description' },
];

export const BirthdayTypeSelection: React.FC<BirthdayTypeSelectionProps> = ({ onSelect, onBack }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full max-w-4xl">
            <button onClick={onBack} className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8">
                <BackIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">{t('birthdayType.back')}</span>
            </button>
            <div className="text-center mb-12">
                <h2 className="text-4xl font-extrabold text-white sm:text-5xl">{t('birthdayTypeSelection.title')}</h2>
                <p className="mt-4 text-lg text-slate-400">{t('birthdayTypeSelection.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {birthdayTypes.map(({ type, titleKey, descriptionKey }) => (
                    <button
                        key={type}
                        onClick={() => onSelect(type)}
                        className="group flex flex-col items-center p-8 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                        <div className="p-4 bg-slate-950 rounded-full border-2 border-cyan-500/20 group-hover:border-cyan-500/60 transition-colors">
                            <BirthdayIcon className="w-16 h-16 text-cyan-400 transition-colors" />
                        </div>
                        <h3 className="mt-6 text-2xl font-bold text-white">{t(titleKey)}</h3>
                        <p className="mt-2 text-sm text-center text-slate-400 group-hover:text-slate-200 transition-colors">{t(descriptionKey)}</p>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};