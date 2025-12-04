
import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onChange }) => {
  const ratios = [
    { value: AspectRatio.PORTRAIT, label: 'Instagram Story', sub: '9:16', icon: 'fab fa-instagram' },
    { value: AspectRatio.SQUARE, label: 'Instagram Post', sub: '1:1', icon: 'fab fa-instagram' },
    { value: AspectRatio.LANDSCAPE, label: 'Twitter Post', sub: '16:9', icon: 'fab fa-twitter' },
    { value: AspectRatio.THREE_FOURTHS, label: 'Standard Portrait', sub: '3:4', icon: 'fas fa-portrait' },
    { value: AspectRatio.FOUR_THIRDS, label: 'Standard Landscape', sub: '4:3', icon: 'fas fa-image' },
    { value: AspectRatio.FOUR_SIX, label: 'Photo Print (4x6)', sub: '4:6', icon: 'fas fa-print' },
    { value: AspectRatio.SIX_FOUR, label: 'Photo Print (6x4)', sub: '6:4', icon: 'fas fa-print' },
  ];

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        Aspect Ratio <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-4 gap-2">
        {ratios.map((ratio) => (
          <button
            key={ratio.value}
            onClick={() => onChange(ratio.value)}
            className={`
              flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-300 min-h-[4.5rem] relative overflow-hidden group text-center
              ${selected === ratio.value 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-105 z-10' 
                : 'bg-zinc-800/30 border-white/5 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-white/10'
              }
            `}
            type="button"
          >
            <i className={`${ratio.icon} mb-1.5 text-lg transition-transform group-hover:scale-110`}></i>
            <span className="text-[10px] font-bold leading-tight">{ratio.label}</span>
            <span className={`text-[9px] leading-none mt-1 font-mono ${selected === ratio.value ? 'text-indigo-200' : 'text-zinc-600'}`}>
              {ratio.sub}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
