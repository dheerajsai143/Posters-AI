
import React from 'react';
import { DownloadIcon, ImageIcon } from './IconComponents';
import type { AspectRatio } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface PosterDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  posterImage: { base64: string; mimeType: string; } | null;
  ratio: AspectRatio;
}

const getAspectRatioClass = (ratio: AspectRatio): string => {
    switch (ratio) {
        case '16:9':
            return 'aspect-video';
        case '9:16':
            return 'aspect-[9/16]';
        case '3:4':
            return 'aspect-[3/4]';
        case '4:3':
            return 'aspect-[4/3]';
        case '4:5':
            return 'aspect-[4/5]';
        case 'A4':
            return 'aspect-[210/297]'; // Standard A4 ratio
        case '1:1':
        default:
            return 'aspect-square';
    }
}

export const PosterDisplay: React.FC<PosterDisplayProps> = ({ imageUrl, isLoading, error, posterImage, ratio }) => {
  const { t } = useTranslation();
  
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `poster-ai-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950/50 rounded-lg">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
          <p className="mt-4 text-lg font-semibold text-slate-300">{t('posterDisplay.loading.title')}</p>
          <p className="text-sm text-slate-400">{t('posterDisplay.loading.subtitle')}</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-900/20 rounded-lg p-4">
          <p className="text-red-400 font-bold">{t('posterDisplay.error.title')}</p>
          <p className="text-red-300 text-sm text-center mt-2">{error}</p>
        </div>
      );
    }
    if (imageUrl) {
      return (
        <img src={imageUrl} alt="Generated Poster" className="w-full h-full object-contain rounded-lg shadow-2xl transition-all duration-300" />
      );
    }
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center bg-slate-950/50 border-2 border-dashed border-slate-800 rounded-lg p-4">
        <ImageIcon className="w-16 h-16 text-slate-600" />
        <p className="mt-4 text-lg font-semibold text-slate-400">{t('posterDisplay.preview.title')}</p>
        <p className="text-sm text-slate-500">{t('posterDisplay.preview.subtitle')}</p>
      </div>
    );
  };

  return (
    <div className="w-full flex-grow flex flex-col items-center">
      <div className={`relative w-full max-w-2xl bg-slate-900/60 rounded-xl shadow-2xl backdrop-blur-xl p-4 border border-slate-800 transition-all duration-300 ${getAspectRatioClass(ratio)}`}>
        {renderContent()}
      </div>
      {imageUrl && !isLoading && (
        <button
          onClick={handleDownload}
          className="mt-4 w-full max-w-2xl flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          {t('posterDisplay.button.download')}
        </button>
      )}
    </div>
  );
};