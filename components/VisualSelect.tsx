import React, { useState, useRef, useEffect } from 'react';

interface VisualSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  category: 'festival' | 'movie' | 'custom' | 'theme';
  required?: boolean;
}

const getVisualAttributes = (text: string, category: string) => {
  const lowerText = text.toLowerCase();
  
  let gradient = 'from-zinc-700 to-zinc-600';
  let icon = 'fa-circle';

  if (category === 'festival') {
    if (lowerText.includes('diwali') || lowerText.includes('light')) { gradient = 'from-orange-500 to-yellow-500'; icon = 'fa-fire'; }
    else if (lowerText.includes('christmas')) { gradient = 'from-red-600 to-green-700'; icon = 'fa-tree'; }
    else if (lowerText.includes('eid') || lowerText.includes('muharram')) { gradient = 'from-emerald-600 to-teal-600'; icon = 'fa-moon'; }
    else if (lowerText.includes('holi')) { gradient = 'from-pink-500 via-purple-500 to-yellow-500'; icon = 'fa-palette'; }
    else if (lowerText.includes('independence') || lowerText.includes('republic')) { gradient = 'from-orange-500 via-white to-green-600'; icon = 'fa-flag'; }
    else if (lowerText.includes('navratri') || lowerText.includes('durga')) { gradient = 'from-red-600 to-orange-600'; icon = 'fa-om'; }
    else if (lowerText.includes('raksha')) { gradient = 'from-orange-400 to-red-400'; icon = 'fa-hand-holding-heart'; }
    else if (lowerText.includes('ganesh')) { gradient = 'from-orange-500 to-red-500'; icon = 'fa-om'; }
    else { gradient = 'from-indigo-500 to-purple-500'; icon = 'fa-star'; }
  } 
  else if (category === 'movie') {
    if (lowerText.includes('horror') || lowerText.includes('ghost') || lowerText.includes('noir') || lowerText.includes('mystery')) { gradient = 'from-gray-900 to-black'; icon = 'fa-ghost'; }
    else if (lowerText.includes('action') || lowerText.includes('thriller') || lowerText.includes('superhero')) { gradient = 'from-red-600 to-orange-700'; icon = 'fa-bomb'; }
    else if (lowerText.includes('romance') || lowerText.includes('romantic')) { gradient = 'from-pink-500 to-rose-500'; icon = 'fa-heart'; }
    else if (lowerText.includes('comedy') || lowerText.includes('funny')) { gradient = 'from-yellow-400 to-orange-400'; icon = 'fa-laugh'; }
    else if (lowerText.includes('sci-fi') || lowerText.includes('space') || lowerText.includes('futuristic')) { gradient = 'from-cyan-600 to-blue-700'; icon = 'fa-robot'; }
    else if (lowerText.includes('adventure') || lowerText.includes('epic')) { gradient = 'from-amber-600 to-orange-700'; icon = 'fa-map-marked-alt'; }
    else if (lowerText.includes('animation') || lowerText.includes('cartoon') || lowerText.includes('family')) { gradient = 'from-purple-400 to-pink-400'; icon = 'fa-child'; }
    else if (lowerText.includes('vintage') || lowerText.includes('retro')) { gradient = 'from-amber-800 to-yellow-900'; icon = 'fa-film'; }
    else if (lowerText.includes('music')) { gradient = 'from-violet-600 to-fuchsia-600'; icon = 'fa-music'; }
    else { gradient = 'from-indigo-600 to-blue-600'; icon = 'fa-clapperboard'; }
  }
  else if (category === 'custom') {
    if (lowerText.includes('party') || lowerText.includes('concert') || lowerText.includes('music')) { gradient = 'from-fuchsia-600 to-purple-600'; icon = 'fa-glass-cheers'; }
    else if (lowerText.includes('business') || lowerText.includes('hiring') || lowerText.includes('job')) { gradient = 'from-blue-600 to-slate-600'; icon = 'fa-briefcase'; }
    else if (lowerText.includes('sale') || lowerText.includes('offer')) { gradient = 'from-yellow-500 to-red-500'; icon = 'fa-percent'; }
    else if (lowerText.includes('sport') || lowerText.includes('gym')) { gradient = 'from-emerald-600 to-green-600'; icon = 'fa-dumbbell'; }
    else if (lowerText.includes('food') || lowerText.includes('restaurant')) { gradient = 'from-orange-500 to-red-500'; icon = 'fa-utensils'; }
    else if (lowerText.includes('art') || lowerText.includes('exhibition')) { gradient = 'from-pink-500 to-rose-500'; icon = 'fa-paint-brush'; }
    else if (lowerText.includes('book')) { gradient = 'from-amber-700 to-orange-800'; icon = 'fa-book'; }
    else if (lowerText.includes('travel')) { gradient = 'from-sky-500 to-blue-500'; icon = 'fa-plane'; }
    else { gradient = 'from-indigo-500 to-blue-500'; icon = 'fa-layer-group'; }
  }
  else if (category === 'theme') {
      if (lowerText.includes('wedding') || lowerText.includes('marriage')) { gradient = 'from-rose-500 to-pink-600'; icon = 'fa-heart'; }
      else if (lowerText.includes('haldi')) { gradient = 'from-yellow-400 to-yellow-500'; icon = 'fa-sun'; }
      else if (lowerText.includes('mehendi')) { gradient = 'from-green-500 to-emerald-600'; icon = 'fa-leaf'; }
      else if (lowerText.includes('sangeet')) { gradient = 'from-violet-500 to-purple-600'; icon = 'fa-music'; }
      else { gradient = 'from-rose-400 to-orange-400'; icon = 'fa-ring'; }
  }

  return { gradient, icon };
};

const VisualSelect: React.FC<VisualSelectProps> = ({ label, options, value, onChange, placeholder, category, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedVisual = value ? getVisualAttributes(value, category) : null;

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between bg-zinc-900/50 border rounded-xl px-3 py-2.5 text-left transition-all
            ${isOpen ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-white/5 hover:border-white/10'}
          `}
        >
          {value ? (
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedVisual?.gradient} flex items-center justify-center shadow-md`}>
                <i className={`fas ${selectedVisual?.icon} text-white text-xs`}></i>
              </div>
              <span className="text-white text-sm font-medium truncate">{value}</span>
            </div>
          ) : (
            <span className="text-zinc-500 text-sm">{placeholder || 'Select...'}</span>
          )}
          <i className={`fas fa-chevron-down text-zinc-500 text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-64 animate-fade-in-up">
            <div className="p-2 border-b border-white/5 sticky top-0 bg-zinc-900 z-10">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 p-1 scrollbar-hide">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const visual = getVisualAttributes(opt, category);
                  const isSelected = value === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onChange(opt);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`
                        w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left mb-0.5
                        ${isSelected ? 'bg-indigo-600/20' : 'hover:bg-zinc-800'}
                      `}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${visual.gradient} flex-shrink-0 flex items-center justify-center shadow-sm`}>
                        <i className={`fas ${visual.icon} text-white text-xs`}></i>
                      </div>
                      <span className={`text-sm ${isSelected ? 'text-indigo-300 font-semibold' : 'text-zinc-300'}`}>
                        {opt}
                      </span>
                      {isSelected && <i className="fas fa-check text-indigo-400 text-xs ml-auto"></i>}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-zinc-500 text-xs">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualSelect;