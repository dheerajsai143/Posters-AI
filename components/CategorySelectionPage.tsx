
import React from 'react';
import type { Category } from '../types';
import { CATEGORIES } from '../constants';
import { BirthdayIcon, FestivalIcon, WeddingIcon, CustomIcon } from './IconComponents';
import { useTranslation } from '../hooks/useTranslation';
import type { TranslationKeys } from '../translations';

interface CategorySelectionPageProps {
  onSelectCategory: (category: Category) => void;
}

const categoryIcons: Record<Category, React.FC<React.SVGProps<SVGSVGElement>>> = {
    Birthday: BirthdayIcon,
    Festival: FestivalIcon,
    Wedding: WeddingIcon,
    Custom: CustomIcon,
};

export const CategorySelectionPage: React.FC<CategorySelectionPageProps> = ({ onSelectCategory }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">{t('categorySelection.title')}</h2>
            <p className="mt-4 text-lg text-slate-400">{t('categorySelection.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {CATEGORIES.map(cat => {
                const Icon = categoryIcons[cat];
                const titleKey = `category.${cat}` as TranslationKeys;
                const descriptionKey = `category.${cat}.description` as TranslationKeys;
                return (
                    <button
                        key={cat}
                        onClick={() => onSelectCategory(cat)}
                        className="group flex flex-col items-center p-8 bg-slate-900/60 rounded-2xl border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                        <div className="p-4 bg-slate-950 rounded-full border-2 border-cyan-500/20 group-hover:border-cyan-500/60 transition-colors">
                            <Icon className="w-16 h-16 text-cyan-400 transition-colors" />
                        </div>
                        <h3 className="mt-6 text-2xl font-bold text-white">{t(titleKey)}</h3>
                        <p className="mt-2 text-sm text-center text-slate-400 group-hover:text-slate-200 transition-colors">{t(descriptionKey)}</p>
                    </button>
                )
            })}
        </div>
    </div>
  );
};