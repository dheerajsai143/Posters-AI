import React, { useState, useEffect } from 'react';
import { PosterType, AspectRatio, PosterRequest } from './types';
import AspectRatioSelector from './components/AspectRatioSelector';
import ImageUpload from './components/ImageUpload';
import { generatePosterImage } from './services/geminiService';

const INDIAN_FESTIVALS = [
  "Diwali", "Holi", "Ganesh Chaturthi", "Navratri", "Durga Puja", "Dussehra",
  "Raksha Bandhan", "Janmashtami", "Eid", "Christmas", "Onam", "Pongal",
  "Makar Sankranti", "Baisakhi", "Mahashivratri", "Republic Day",
  "Independence Day", "Ram Navami", "Ugadi", "Karva Chauth"
];

const INDIAN_WEDDING_THEMES = [
  "Marriage Anniversary", "North Indian Wedding", "South Indian Wedding",
  "Punjabi Wedding", "Bengali Wedding", "Marathi Wedding", "Gujarati Wedding",
  "Muslim Nikah", "Christian Wedding", "Haldi Ceremony", "Mehendi Ceremony",
  "Sangeet Ceremony", "Engagement / Roka", "Reception"
];

const CUSTOM_TEMPLATES = [
  "Grand Opening", "Music Concert", "Stand-up Comedy", "Business Conference",
  "Product Sale / Offer", "Fashion Show", "Club Party / DJ Night", "Sports Tournament",
  "Gym / Fitness", "School Admission", "Election Campaign", "Movie Poster",
  "Book Cover", "Missing Person", "Obituary / RIP", "Save the Date",
  "Baby Shower", "Retirement Party", "House Warming", "Hiring / Job Vacancy",
  "Workshop / Webinar", "Travel / Tour", "Restaurant Menu / Promo", "Spa / Salon Offer"
];

const MOVIE_GENRES = [
  "Action / Adventure", "Sci-Fi / Fantasy", "Horror / Thriller", "Romance / Drama",
  "Comedy", "Mystery / Crime", "Documentary", "Animation / Family",
  "Historical / Epic", "Supernatural"
];

const MOVIE_TEMPLATES = [
  "Coming Soon (Teaser)", "Now Showing (Theaters)", "Character Portrait",
  "Epic Ensemble", "Minimalist Art", "Vintage / Retro Style", "Award Winner"
];

const App: React.FC = () => {
  const [posterType, setPosterType] = useState<PosterType>(PosterType.BIRTHDAY);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [age, setAge] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [festivalName, setFestivalName] = useState<string>('');
  const [husbandName, setHusbandName] = useState<string>('');
  const [wifeName, setWifeName] = useState<string>('');
  const [marriageTheme, setMarriageTheme] = useState<string>('');
  const [customTemplate, setCustomTemplate] = useState<string>('');
  const [movieGenre, setMovieGenre] = useState<string>('');
  const [movieTagline, setMovieTagline] = useState<string>('');
  const [movieTemplate, setMovieTemplate] = useState<string>('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset type-specific fields when type changes
  useEffect(() => {
    if (posterType !== PosterType.FESTIVAL) setFestivalName('');
    if (posterType !== PosterType.ANNIVERSARY) {
      setHusbandName(''); setWifeName(''); setMarriageTheme('');
    }
    if (posterType !== PosterType.CUSTOM) setCustomTemplate('');
    if (posterType !== PosterType.MOVIE) {
      setMovieGenre(''); setMovieTagline(''); setMovieTemplate('');
    }
  }, [posterType]);

  const getPromptForType = (type: PosterType) => {
    switch (type) {
      case PosterType.BIRTHDAY: return "balloons, confetti, cake, and vibrant, cheerful colors.";
      case PosterType.FESTIVAL: return "traditional decorations, glowing lights, patterns, and a culturally rich atmosphere.";
      case PosterType.ANNIVERSARY: return "elegant floral arrangements, soft lighting, golden accents, hearts, and a premium romantic atmosphere.";
      case PosterType.CUSTOM: return customTemplate ? `A professional ${customTemplate} poster design.` : "professional design with modern elements.";
      case PosterType.MOVIE: return `A cinematic movie poster with dramatic lighting, professional typography, and visual effects suitable for a ${movieGenre || 'blockbuster'} film.`;
      default: return "professional design with modern elements and striking composition.";
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    // Validation
    if (!userImage) { setError("Please upload a subject image."); setIsGenerating(false); return; }
    if (posterType === PosterType.BIRTHDAY && !name.trim()) { setError("Please enter a name."); setIsGenerating(false); return; }
    if (posterType === PosterType.FESTIVAL && !festivalName) { setError("Please select a festival."); setIsGenerating(false); return; }
    if (posterType === PosterType.ANNIVERSARY) {
      if (!husbandName.trim() || !wifeName.trim()) { setError("Please enter both names."); setIsGenerating(false); return; }
      if (!marriageTheme) { setError("Please select an occasion."); setIsGenerating(false); return; }
    }
    if (posterType === PosterType.CUSTOM) {
      if (!customTemplate) { setError("Please select a template."); setIsGenerating(false); return; }
      if (!name.trim()) { setError("Please enter poster text."); setIsGenerating(false); return; }
    }
    if (posterType === PosterType.MOVIE) {
      if (!name.trim()) { setError("Please enter Movie Title."); setIsGenerating(false); return; }
      if (!movieGenre) { setError("Please select Genre."); setIsGenerating(false); return; }
      if (!movieTemplate) { setError("Please select Template."); setIsGenerating(false); return; }
    }

    try {
      const baseDescription = getPromptForType(posterType);
      const request: PosterRequest = {
        prompt: baseDescription, type: posterType, aspectRatio, userImage,
        age: age.trim() || undefined, year: year.trim() || undefined,
        name: (posterType === PosterType.BIRTHDAY || posterType === PosterType.FESTIVAL || posterType === PosterType.CUSTOM || posterType === PosterType.MOVIE) ? name.trim() : undefined,
        festivalName: festivalName || undefined,
        husbandName: posterType === PosterType.ANNIVERSARY ? husbandName.trim() : undefined,
        wifeName: posterType === PosterType.ANNIVERSARY ? wifeName.trim() : undefined,
        marriageTheme: (posterType === PosterType.ANNIVERSARY && marriageTheme) ? marriageTheme : undefined,
        customTemplate: (posterType === PosterType.CUSTOM && customTemplate) ? customTemplate : undefined,
        movieGenre: (posterType === PosterType.MOVIE && movieGenre) ? movieGenre : undefined,
        movieTagline: (posterType === PosterType.MOVIE && movieTagline.trim()) ? movieTagline.trim() : undefined,
        movieTemplate: (posterType === PosterType.MOVIE && movieTemplate) ? movieTemplate : undefined,
      };

      const result = await generatePosterImage(request);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate poster.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `poster-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getNameConfig = () => {
    if (posterType === PosterType.BIRTHDAY) return { label: "Name", required: true, placeholder: "e.g. John Doe" };
    if (posterType === PosterType.CUSTOM) return { label: "Poster Title / Text", required: true, placeholder: "e.g. Grand Opening" };
    if (posterType === PosterType.MOVIE) return { label: "Movie Title", required: true, placeholder: "e.g. The Last Hero" };
    return { label: "Name (Optional)", required: false, placeholder: "e.g. John Doe" };
  };

  const nameConfig = getNameConfig();

  // Common Input Styles
  const inputClass = "w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all backdrop-blur-sm";
  const selectClass = "w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all backdrop-blur-sm";
  const labelClass = "text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block";

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Controls */}
      <div className="w-full md:w-[480px] bg-zinc-900 border-r border-white/5 flex flex-col h-screen overflow-hidden shadow-2xl relative z-20">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/5 bg-zinc-900/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fas fa-wand-magic-sparkles text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Posters AI</h1>
              <p className="text-xs text-zinc-500 font-medium">Professional Design Generator</p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-hide">
          
          {/* Occasion Selector */}
          <div className="space-y-3">
            <label className={labelClass}>Occasion <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(PosterType).map((type) => (
                <button
                  key={type}
                  onClick={() => setPosterType(type)}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-left border flex items-center
                    ${posterType === type 
                      ? 'bg-zinc-800 border-indigo-500 text-white shadow-lg shadow-black/20' 
                      : 'bg-zinc-800/30 border-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }
                  `}
                >
                   <span className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${posterType === type ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-700/30 text-zinc-500'}`}>
                     {type === PosterType.BIRTHDAY && <i className="fas fa-birthday-cake text-sm"></i>}
                     {type === PosterType.FESTIVAL && <i className="fas fa-star text-sm"></i>}
                     {type === PosterType.ANNIVERSARY && <i className="fas fa-heart text-sm"></i>}
                     {type === PosterType.CUSTOM && <i className="fas fa-layer-group text-sm"></i>}
                     {type === PosterType.MOVIE && <i className="fas fa-film text-sm"></i>}
                   </span>
                   {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {/* Conditional Dropdowns */}
            {posterType === PosterType.FESTIVAL && (
              <div className="space-y-1">
                <label className={labelClass}>Select Festival <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={festivalName} onChange={(e) => setFestivalName(e.target.value)} className={selectClass}>
                    <option value="" disabled>Choose a festival...</option>
                    {INDIAN_FESTIVALS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"><i className="fas fa-chevron-down text-xs"></i></div>
                </div>
              </div>
            )}

            {posterType === PosterType.ANNIVERSARY && (
              <div className="space-y-1">
                <label className={labelClass}>Occasion / Ceremony <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={marriageTheme} onChange={(e) => setMarriageTheme(e.target.value)} className={selectClass}>
                    <option value="" disabled>Choose occasion...</option>
                    {INDIAN_WEDDING_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"><i className="fas fa-chevron-down text-xs"></i></div>
                </div>
              </div>
            )}

            {posterType === PosterType.CUSTOM && (
              <div className="space-y-1">
                <label className={labelClass}>Template Category <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={customTemplate} onChange={(e) => setCustomTemplate(e.target.value)} className={selectClass}>
                    <option value="" disabled>Choose template...</option>
                    {CUSTOM_TEMPLATES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"><i className="fas fa-chevron-down text-xs"></i></div>
                </div>
              </div>
            )}

            {posterType === PosterType.MOVIE && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className={labelClass}>Movie Template <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select value={movieTemplate} onChange={(e) => setMovieTemplate(e.target.value)} className={selectClass}>
                      <option value="" disabled>Choose template...</option>
                      {MOVIE_TEMPLATES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"><i className="fas fa-chevron-down text-xs"></i></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Genre <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select value={movieGenre} onChange={(e) => setMovieGenre(e.target.value)} className={selectClass}>
                      <option value="" disabled>Choose genre...</option>
                      {MOVIE_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"><i className="fas fa-chevron-down text-xs"></i></div>
                  </div>
                </div>
              </div>
            )}

            {/* Name/Text Inputs */}
            {(posterType === PosterType.BIRTHDAY || posterType === PosterType.FESTIVAL || posterType === PosterType.CUSTOM || posterType === PosterType.MOVIE) && (
              <div className="space-y-1">
                <label className={labelClass}>
                  {nameConfig.label} {nameConfig.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={nameConfig.placeholder}
                  className={`${inputClass} ${error && nameConfig.required && !name.trim() ? 'border-red-500/50 bg-red-500/5' : ''}`}
                />
              </div>
            )}

            {posterType === PosterType.MOVIE && (
              <div className="space-y-1">
                <label className={labelClass}>Tagline (Optional)</label>
                <input type="text" value={movieTagline} onChange={(e) => setMovieTagline(e.target.value)} placeholder="e.g. In a world..." className={inputClass} />
              </div>
            )}

            {posterType === PosterType.ANNIVERSARY && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClass}>Husband Name <span className="text-red-500">*</span></label>
                  <input type="text" value={husbandName} onChange={(e) => setHusbandName(e.target.value)} placeholder="Husband" className={`${inputClass} ${error && !husbandName.trim() ? 'border-red-500/50' : ''}`} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Wife Name <span className="text-red-500">*</span></label>
                  <input type="text" value={wifeName} onChange={(e) => setWifeName(e.target.value)} placeholder="Wife" className={`${inputClass} ${error && !wifeName.trim() ? 'border-red-500/50' : ''}`} />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {(posterType === PosterType.BIRTHDAY || posterType === PosterType.ANNIVERSARY) && (
                <div className={`space-y-1 ${posterType === PosterType.ANNIVERSARY ? 'col-span-2' : ''}`}>
                  <label className={labelClass}>{posterType === PosterType.BIRTHDAY ? 'Age (Optional)' : 'Years (Optional)'}</label>
                  <input type="text" value={age} onChange={(e) => setAge(e.target.value)} placeholder={posterType === PosterType.BIRTHDAY ? "e.g. 1st" : "e.g. 25th"} className={inputClass} />
                </div>
              )}

              {posterType !== PosterType.ANNIVERSARY && (
                <div className={`space-y-1 ${posterType === PosterType.BIRTHDAY || posterType === PosterType.FESTIVAL || posterType === PosterType.CUSTOM || posterType === PosterType.MOVIE ? '' : 'col-span-2'}`}>
                  <label className={labelClass}>Year (Optional)</label>
                  <input type="text" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2024" className={inputClass} />
                </div>
              )}
            </div>
          </div>

          <AspectRatioSelector selected={aspectRatio} onChange={setAspectRatio} />

          <div className="space-y-4">
            {posterType === PosterType.ANNIVERSARY && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-3 items-start">
                <i className="fas fa-lightbulb text-amber-500 mt-0.5"></i>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  Tip: For best results, upload a clear photo containing both people in the couple.
                </p>
              </div>
            )}
            <ImageUpload label="Subject Image" required={true} onImageSelected={setUserImage} previewUrl={userImage} />
          </div>
          
          <div className="h-12"></div> {/* Spacer */}
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-white/5 bg-zinc-900/90 backdrop-blur-xl absolute bottom-0 left-0 right-0 z-30">
          {error && (
            <div className="mb-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium flex items-center gap-2 animate-pulse">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
            </div>
          )}
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`
              w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all duration-300 relative overflow-hidden group
              ${isGenerating 
                ? 'bg-zinc-800 cursor-not-allowed opacity-80' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
              }
            `}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2 relative z-10">
                <i className="fas fa-circle-notch fa-spin"></i> Generating Masterpiece...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 relative z-10">
                <i className="fas fa-wand-magic-sparkles"></i> Generate Poster
              </span>
            )}
            {!isGenerating && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 bg-zinc-950 p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] pointer-events-none"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[128px] pointer-events-none mix-blend-screen"></div>

        {generatedImage ? (
           <div className="relative z-10 flex flex-col items-center gap-6 w-full h-full justify-center">
             <div className="relative group max-h-[85vh] shadow-2xl shadow-black/80 rounded-lg overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm">
               <img 
                 src={generatedImage} 
                 alt="Generated Poster" 
                 className="max-h-[85vh] w-auto object-contain"
               />
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                 <button 
                   onClick={handleDownload}
                   className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-zinc-200 transform hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
                 >
                   <i className="fas fa-download"></i> Download HD
                 </button>
               </div>
             </div>
             <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
               Generated with Gemini 2.5 AI
             </p>
           </div>
        ) : (
          <div className="text-center text-zinc-500 max-w-lg z-10 animate-fade-in-up">
            <div className="w-28 h-28 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl mx-auto mb-8 flex items-center justify-center border border-white/5 shadow-2xl shadow-black rotate-3 hover:rotate-6 transition-transform duration-500">
               <i className="fas fa-image text-5xl text-zinc-600"></i>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Create Magic.</h2>
            <p className="text-zinc-400 text-lg leading-relaxed font-light">
              Select an occasion from the sidebar, upload your photo, and let AI design a professional poster in seconds.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;