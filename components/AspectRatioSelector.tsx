import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onChange }) => {
  const ratios = [
    { value: AspectRatio.PORTRAIT, label: '9:16', icon: 'fa-mobile-screen' },
    { value: AspectRatio.FOUR_SIX, label: '4:6', icon: 'fa-portrait' },
    { value: AspectRatio.THREE_FOURTHS, label: '3:4', icon: 'fa-file-image' },
    { value: AspectRatio.SQUARE, label: '1:1', icon: 'fa-square' },
    { value: AspectRatio.FOUR_THIRDS, label: '4:3', icon: 'fa-file-image' },
    { value: AspectRatio.SIX_FOUR, label: '6:4', icon: 'fa-image' },
    { value: AspectRatio.LANDSCAPE, label: '16:9', icon: 'fa-tv' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        Aspect Ratio <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-2 flex-wrap">
        {ratios.map((ratio) => (
          <button
            key={ratio.value}
            onClick={() => onChange(ratio.value)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 w-[4.5rem]
              ${selected === ratio.value 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-105' 
                : 'bg-zinc-800/30 border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-white/10'
              }
            `}
            type="button"
          >
            <i className={`fas ${ratio.icon} mb-2 text-lg`}></i>
            <span className="text-[10px] font-semibold">{ratio.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;