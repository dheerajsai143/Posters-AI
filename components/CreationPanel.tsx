
import React, { useCallback } from 'react';
import type { PosterData, AspectRatio, FestivalType, WeddingStyle, WeddingType, Language } from '../types';
import { ASPECT_RATIOS, FESTIVALS, WEDDING_STYLES, WEDDING_TYPES, LANGUAGES } from '../constants';
import { 
    UploadIcon, 
    GenerateIcon, 
    BackIcon,
    EditIcon,
    RemoveIcon
} from './IconComponents';
import { VoiceInputButton } from './VoiceInputButton';
import { useTranslation } from '../hooks/useTranslation';
import { TranslationKeys } from '../translations';

interface CreationPanelProps {
  posterData: PosterData;
  updatePosterData: <K extends keyof PosterData>(key: K, value: PosterData[K]) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onBack: () => void;
}

const inputStyles = "w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-slate-400";

export const CreationPanel: React.FC<CreationPanelProps> = ({ posterData, updatePosterData, onGenerate, isLoading, onBack }) => {
  const { t } = useTranslation();
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          updatePosterData('image', {
            base64: base64String,
            mimeType: file.type,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTranscript = useCallback((transcript: string) => {
    updatePosterData('theme', posterData.theme ? `${posterData.theme} ${transcript}` : transcript);
  }, [posterData.theme, updatePosterData]);

  const handleBirthdayMessageTranscript = useCallback((transcript: string) => {
    updatePosterData('birthdayMessage', posterData.birthdayMessage ? `${posterData.birthdayMessage} ${transcript}` : transcript);
  }, [posterData.birthdayMessage, updatePosterData]);
  
  const renderBirthdayDetails = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.name')}</label>
        <input
          id="name"
          type="text"
          value={posterData.name || ''}
          onChange={(e) => updatePosterData('name', e.target.value)}
          placeholder={t('form.placeholder.name.birthday')}
          className={inputStyles}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.age')}</label>
          <input
            id="age"
            type="number"
            value={posterData.age || ''}
            onChange={(e) => updatePosterData('age', e.target.value)}
            placeholder={t('form.placeholder.age')}
            className={inputStyles}
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.date')}</label>
          <input
            id="date"
            type="date"
            value={posterData.date || ''}
            onChange={(e) => updatePosterData('date', e.target.value)}
            className={inputStyles}
          />
        </div>
      </div>
      <div className="relative">
        <label htmlFor="birthday-message" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.birthdayMessage')}</label>
        <textarea
          id="birthday-message"
          value={posterData.birthdayMessage || ''}
          onChange={(e) => updatePosterData('birthdayMessage', e.target.value)}
          placeholder={t('form.placeholder.birthdayMessage')}
          rows={3}
          className={`${inputStyles} pr-12`}
        />
        <VoiceInputButton onTranscript={handleBirthdayMessageTranscript} />
      </div>
    </div>
  );

  const renderFestivalDetails = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="festival-type" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.festival')}</label>
        <select
          id="festival-type"
          value={posterData.festivalType || 'Christmas'}
          onChange={(e) => updatePosterData('festivalType', e.target.value as FestivalType)}
          className={inputStyles}
        >
          {FESTIVALS.map(festival => (
            <option key={festival.type} value={festival.type}>{festival.title}</option>
          ))}
        </select>
      </div>
      {posterData.festivalType === 'Other' && (
        <div>
          <label htmlFor="festival-name" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.festivalName')}</label>
          <input
            id="festival-name"
            type="text"
            value={posterData.festivalName || ''}
            onChange={(e) => updatePosterData('festivalName', e.target.value)}
            placeholder={t('form.placeholder.festivalName')}
            className={inputStyles}
          />
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.name')}</label>
        <input
          id="name"
          type="text"
          value={posterData.name || ''}
          onChange={(e) => updatePosterData('name', e.target.value)}
          placeholder={t('form.placeholder.name.festival')}
          className={inputStyles}
        />
      </div>
       <div className="relative">
        <label htmlFor="theme" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.themeKeywords')}</label>
        <textarea
          id="theme"
          value={posterData.theme || ''}
          onChange={(e) => updatePosterData('theme', e.target.value)}
          placeholder={t('form.placeholder.themeKeywords')}
          rows={3}
          className={`${inputStyles} pr-12`}
        />
        <VoiceInputButton onTranscript={handleTranscript} />
      </div>
    </div>
  );

  const renderWeddingDetails = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="wedding-style" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.weddingStyle')}</label>
        <select
          id="wedding-style"
          value={posterData.weddingStyle || 'Traditional Indian'}
          onChange={(e) => updatePosterData('weddingStyle', e.target.value as WeddingStyle)}
          className={inputStyles}
        >
          {WEDDING_STYLES.map(style => (
            <option key={style.style} value={style.style}>{style.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="wedding-type" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.weddingEventType')}</label>
        <select
          id="wedding-type"
          value={posterData.weddingType || 'Invitation'}
          onChange={(e) => updatePosterData('weddingType', e.target.value as WeddingType)}
          className={inputStyles}
        >
          {WEDDING_TYPES.map(type => (
            <option key={type.type} value={type.type}>{type.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.names')}</label>
        <input
          id="name"
          type="text"
          value={posterData.name || ''}
          onChange={(e) => updatePosterData('name', e.target.value)}
          placeholder={t('form.placeholder.name.wedding')}
          className={inputStyles}
        />
      </div>
      <div>
        <label htmlFor="invited-by" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.invitedBy')}</label>
        <input
          id="invited-by"
          type="text"
          value={posterData.invitedBy || ''}
          onChange={(e) => updatePosterData('invitedBy', e.target.value)}
          placeholder={t('form.placeholder.invitedBy')}
          className={inputStyles}
        />
      </div>
       <div className="grid grid-cols-2 gap-4">
         <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.date.required')}</label>
            <input
              id="date"
              type="date"
              value={posterData.date || ''}
              onChange={(e) => updatePosterData('date', e.target.value)}
              className={inputStyles}
            />
          </div>
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.venue')}</label>
            <input
              id="venue"
              type="text"
              value={posterData.venue || ''}
              onChange={(e) => updatePosterData('venue', e.target.value)}
              placeholder={t('form.placeholder.venue')}
              className={inputStyles}
            />
          </div>
       </div>
      <div className="relative">
        <label htmlFor="theme" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.additionalDetails')}</label>
        <textarea
          id="theme"
          value={posterData.theme || ''}
          onChange={(e) => updatePosterData('theme', e.target.value)}
          placeholder={posterData.weddingStyle === 'Custom Style' || posterData.weddingType === 'Custom' ? t('form.placeholder.customDetails') : t('form.placeholder.additionalDetails')}
          rows={3}
          className={`${inputStyles} pr-12`}
        />
        <VoiceInputButton onTranscript={handleTranscript} />
      </div>
    </div>
  );

  const renderCustomDetails = () => (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="theme" className="block text-sm font-medium text-slate-300 mb-1">{t('form.label.describeIdea')}</label>
        <textarea
          id="theme"
          value={posterData.theme || ''}
          onChange={(e) => updatePosterData('theme', e.target.value)}
          placeholder={t('form.placeholder.describeIdea')}
          rows={5}
          className={`${inputStyles} pr-12`}
        />
        <VoiceInputButton onTranscript={handleTranscript} />
      </div>
    </div>
  );
  
  const renderCategorySpecificDetails = () => {
    switch (posterData.category) {
      case 'Birthday':
        return renderBirthdayDetails();
      case 'Festival':
        return renderFestivalDetails();
      case 'Wedding':
        return renderWeddingDetails();
      case 'Custom':
        return renderCustomDetails();
      default:
        return null;
    }
  };

  const getTitle = () => {
    if (posterData.category === 'Birthday' && posterData.birthdayType) {
        const key = `creationPanel.title.birthday.${posterData.birthdayType}` as TranslationKeys;
        return t(key);
    }
    const categoryKey = `category.${posterData.category}` as TranslationKeys;
    return `${t(categoryKey)} ${t('creationPanel.title.poster')}`;
  }

  const isDetailsFirst = posterData.category === 'Birthday' || posterData.category === 'Festival' || posterData.category === 'Wedding' || posterData.category === 'Custom';

  const detailsSection = (
    <div key="details">
        <label className="block text-sm font-medium text-slate-300 mb-2">
            {isDetailsFirst ? t('creationPanel.step1.details') : '3. Add Details'}
        </label>
        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
            {renderCategorySpecificDetails()}
        </div>
    </div>
  );

  const aspectRatioSection = (
      <div key="aspect-ratio">
          <label className="block text-sm font-medium text-slate-300 mb-2">{t('creationPanel.step2.ratio')}</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                  <button
                      key={ratio.value}
                      onClick={() => updatePosterData('ratio', ratio.value)}
                      className={`group text-center p-2 rounded-md transition-colors text-xs flex flex-col items-center justify-between h-28 ${
                          posterData.ratio === ratio.value
                          ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                  >
                      <div className="h-16 w-full flex items-center justify-center mb-1">
                          <div 
                              className={`
                                  border-2 rounded 
                                  ${posterData.ratio === ratio.value ? 'border-cyan-200' : 'border-slate-600 group-hover:border-cyan-400'}
                                  max-w-full max-h-full transition-colors
                              `}
                              style={{ 
                                  aspectRatio: `${ratio.width} / ${ratio.height}`,
                                  height: ratio.width > ratio.height ? 'auto' : '100%',
                                  width: ratio.width > ratio.height ? '100%' : 'auto'
                              }}
                          >
                          </div>
                      </div>
                      <div className="flex flex-col">
                          <span className="font-semibold leading-tight">{ratio.label}</span>
                          <span className={`${posterData.ratio === ratio.value ? 'text-cyan-100' : 'text-slate-400'} text-[10px]`}>{ratio.dimensions}</span>
                      </div>
                  </button>
              ))}
          </div>
      </div>
  );

  const imageUploadSection = (
    <div key="image-upload">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {isDetailsFirst ? t('creationPanel.step3.upload') : '1. Upload Your Image'}
      </label>
      <div className="mt-1">
        {posterData.image ? (
          <div className="relative group aspect-video rounded-lg overflow-hidden border-2 border-slate-700">
            <img
              src={`data:${posterData.image.mimeType};base64,${posterData.image.base64}`}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center space-x-4">
              <label
                htmlFor="file-upload"
                className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-800 p-3 rounded-full text-white hover:bg-cyan-500"
                title={t('imageUpload.change')}
              >
                <EditIcon className="w-6 h-6" />
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
              </label>
              <button
                onClick={() => updatePosterData('image', null)}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-800 p-3 rounded-full text-white hover:bg-red-600"
                title={t('imageUpload.remove')}
              >
                <RemoveIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="file-upload"
            className="relative block w-full aspect-video border-2 border-slate-700 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-cyan-500 transition-colors"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <UploadIcon className="mx-auto h-12 w-12 text-slate-500" />
              <span className="mt-2 block text-sm font-medium text-slate-400">
                <span className="text-cyan-400">{t('imageUpload.upload.click')}</span> {t('imageUpload.upload.drag')}
              </span>
              <span className="mt-1 block text-xs text-slate-500">{t('imageUpload.upload.info')}</span>
            </div>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
          </label>
        )}
      </div>
    </div>
  );

  const sections = isDetailsFirst
    ? [detailsSection, aspectRatioSection, imageUploadSection]
    : [imageUploadSection, aspectRatioSection, detailsSection];


  return (
    <div className="w-full lg:w-2/5 lg:max-w-md bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 shadow-2xl border border-slate-800 self-start lg:sticky lg:top-8">
        <button onClick={onBack} className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4">
            <BackIcon className="w-5 h-5" />
            <span className="text-sm font-semibold">{t('creationPanel.back')}</span>
        </button>
      <h2 className="text-2xl font-bold mb-6 text-white">{getTitle()}</h2>

      <div className="space-y-6">
        {sections.map(section => section)}

        <button
          onClick={onGenerate}
          disabled={isLoading || !posterData.image}
          className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('creationPanel.button.generating')}
            </>
          ) : (
            <>
              <GenerateIcon className="w-5 h-5 mr-2" />
              {t('creationPanel.button.generate')}
            </>
          )}
        </button>
      </div>
    </div>
  );
};