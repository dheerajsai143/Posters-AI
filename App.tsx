import React, { useState, useEffect, useRef } from 'react';
import { PosterType, AspectRatio, PosterRequest, HistoryItem, AppStateSnapshot, UserProfile, UserSettings } from './types';
import AspectRatioSelector from './components/AspectRatioSelector';
import ImageUpload from './components/ImageUpload';
import VisualSelect from './components/VisualSelect';
import MicInput from './components/MicInput';
import { generatePosterImage } from './services/geminiService';

// --- APP VERSION CONTROL ---
const APP_VERSION = '1.5.0'; 

const INDIAN_FESTIVALS = [
  "Akshaya Tritiya", "Ambedkar Jayanti", "Baisakhi", "Basant Panchami", "Bhai Dooj", "Bihu", 
  "Buddha Purnima", "Chhath Puja", "Christmas", "Diwali", "Durga Puja", 
  "Dussehra", "Easter", "Eid al-Adha", "Eid al-Fitr", "Ganesh Chaturthi", 
  "Gangaur", "Gandhi Jayanti", "Good Friday", "Govardhan Puja", "Gudi Padwa", 
  "Guru Gobind Singh Jayanti", "Guru Nanak Jayanti", "Hanuman Jayanti", 
  "Hemis Festival", "Holi", "Hornbill Festival", "Independence Day", 
  "Janmashtami", "Karva Chauth", "Kumbh Mela", "Lohri", "Losar", "Mahashivratri", 
  "Mahavir Jayanti", "Makar Sankranti", "Muharram", "Nag Panchami", 
  "Navratri", "Nuakhai", "Onam", "Paryushana", "Pohela Boishakh", "Pongal", 
  "Puthandu", "Raja Parba", "Raksha Bandhan", "Ram Navami", "Rann Utsav", 
  "Rath Yatra", "Republic Day", "Sita Navami", "Teej", "Thrissur Pooram", 
  "Ugadi", "Vat Savitri", "Vishu"
];

const INDIAN_WEDDING_THEMES = [
  "Marriage Anniversary", "North Indian Wedding", "South Indian Wedding",
  "Punjabi Wedding", "Bengali Wedding", "Marathi Wedding", "Gujarati Wedding",
  "Muslim Nikah", "Christian Wedding", "Haldi Ceremony", "Mehendi Ceremony",
  "Sangeet Ceremony", "Engagement / Roka", "Reception"
];

const CUSTOM_TEMPLATES = [
  "App Launch", "Art Exhibition", "Baby Shower", "Book Cover", "Business Conference", 
  "Club Party / DJ Night", "Election Campaign", "Event Invitation", "Fashion Show", 
  "Grand Opening", "Gym / Fitness", "Hiring / Job Vacancy", "House Warming", 
  "Missing Person", "Movie Poster", "Music Concert", "Obituary / RIP", 
  "Product Launch", "Product Sale / Offer", "Restaurant Menu / Promo", "Retirement Party", 
  "Save the Date", "School Admission", "Software Release", "Spa / Salon Offer", 
  "Sports Tournament", "Stand-up Comedy", "Startup Promo", "Travel / Tour", 
  "Website Launch", "Workshop / Webinar"
];

const MOVIE_GENRES = [
  "Action / Adventure", "Sci-Fi / Fantasy", "Horror / Thriller", "Romance / Drama",
  "Comedy", "Mystery / Crime", "Documentary", "Animation / Family",
  "Historical / Epic", "Supernatural"
];

const MOVIE_TEMPLATES = [
  "Action Thriller Montage", 
  "Animated Adventure Collage", 
  "Animated Family Adventure",
  "Award Winner", 
  "Character Portrait", 
  "Coming Soon (Teaser)", 
  "Epic Ensemble", 
  "Historical Epic Collage",
  "Indie Drama Close-up",
  "Minimalist Art", 
  "Musical Romance Poster",
  "Noir Detective Scene", 
  "Now Showing (Theaters)", 
  "Romantic Comedy Duet", 
  "Superhero Action Shot",
  "Vintage / Retro Style"
];

const FONT_STYLES = [
  "Abril Fatface (Heavy Serif)",
  "Alfa Slab One (Heavy Slab Serif)",
  "Amatic SC (Hand-Drawn Caps)",
  "Audiowide (Futuristic Display)",
  "Bangers (Comic / Loud)",
  "Bebas Neue (Bold Condensed)",
  "Caveat (Casual Handwritten)",
  "Cinzel (Classic / Cinematic)",
  "Courier Prime (Classic Typewriter)",
  "Creepster (Horror / Scary)",
  "Dancing Script (Elegant Cursive)",
  "Fredoka One (Rounded Bold)",
  "Gloria Hallelujah (Playful Script)",
  "Great Vibes (Formal Calligraphy)",
  "Inter (Clean Modern)",
  "Lato (Humanist Sans)",
  "Lobster (Bold Script)",
  "Merriweather (Readable Serif)",
  "Monoton (Retro Neon)",
  "Montserrat (Geometric Sans)",
  "Nunito (Rounded Sans)",
  "Orbitron (Sci-Fi / Tech)",
  "Oswald (Tall / Impactful)",
  "Pacifico (Brush Script)",
  "Permanent Marker (Grungy Marker)",
  "Playfair Display (Luxury Serif)",
  "Poppins (Friendly Geometric)",
  "Press Start 2P (Pixel Art / 8-bit)",
  "Raleway (Elegant Sans)",
  "Righteous (Modern / Space)",
  "Roboto (Standard Sans)",
  "Rock Salt (Edgy Hand-Lettering)",
  "Russo One (Russian / Blocky)",
  "Sacramento (Monoline Script)",
  "Satisfy (Brush Script)",
  "Special Elite (Vintage Typewriter)",
  "Ultra (Fat Slab Serif)",
  "VT323 (Terminal / Glitch)"
];

const LOADING_PHASES = [
  { text: "Analyzing Request...", icon: "fa-magnifying-glass", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/50" },
  { text: "Designing Layout...", icon: "fa-pencil-ruler", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/50" },
  { text: "Applying Styles...", icon: "fa-palette", color: "text-pink-400", bg: "bg-pink-500/20", border: "border-pink-500/50" },
  { text: "Finalizing Render...", icon: "fa-wand-magic-sparkles", color: "text-indigo-400", bg: "bg-indigo-500/20", border: "border-indigo-500/50" }
];

const FAQ_ITEMS = [
  {
    question: "How do I create a poster?",
    answer: "1. Select an occasion (Birthday, Festival, etc.) from the sidebar.\n2. Upload a photo of the person or subject.\n3. Fill in the required details like Name or Date.\n4. Click 'Generate Poster' and wait for the AI to design it."
  },
  {
    question: "Why is my image not generating?",
    answer: "If the AI detects sensitive content or unclear faces, it might block generation. Try using a clear, high-quality photo with good lighting. Also ensure your internet connection is stable."
  },
  {
    question: "Can I save my designs?",
    answer: "Yes! Your generated posters are automatically saved to the 'History' tab. You can verify this is enabled in Settings > Auto-Save History."
  },
  {
    question: "How do I change the font style?",
    answer: "In the 'New Design' form, look for the 'Font Style' dropdown. You can choose from various styles like 'Cinematic', 'Handwritten', or 'Futuristic'."
  },
  {
    question: "What image format should I download?",
    answer: "We recommend 'JPG (HD Quality)' for the best balance of quality and compatibility for social media sharing."
  }
];

const App: React.FC = () => {
  // Sidebar State
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // User Profile State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'profile' | 'settings' | 'about' | 'help'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const profileFileInputRef = useRef<HTMLInputElement>(null);
  
  // Login State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form State
  const [posterType, setPosterType] = useState<PosterType>(PosterType.BIRTHDAY);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT);
  const [userImage, setUserImage] = useState<string | undefined>(undefined);
  const [age, setAge] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [customDate, setCustomDate] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [festivalName, setFestivalName] = useState<string>('');
  const [husbandName, setHusbandName] = useState<string>('');
  const [wifeName, setWifeName] = useState<string>('');
  const [marriageTheme, setMarriageTheme] = useState<string>('');
  const [customTemplate, setCustomTemplate] = useState<string>('');
  const [movieGenre, setMovieGenre] = useState<string>('');
  const [movieTagline, setMovieTagline] = useState<string>('');
  const [movieTemplate, setMovieTemplate] = useState<string>('');
  const [fontStyle, setFontStyle] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  // Voice Input State
  const [listeningField, setListeningField] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Notification System
  const [notification, setNotification] = useState<string | null>(null);

  // Undo/Redo State
  const [past, setPast] = useState<AppStateSnapshot[]>([]);
  const [future, setFuture] = useState<AppStateSnapshot[]>([]);

  // Draft State
  const [hasDraft, setHasDraft] = useState(false);

  // Delete Confirmation State
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMode, setShareMode] = useState<'poster' | 'app'>('poster');
  
  // FAQ Toggle State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Update System State
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  // Load History, User and Version Check
  useEffect(() => {
    try {
      const storedVersion = localStorage.getItem('app_version');
      if (storedVersion && storedVersion !== APP_VERSION) {
         setUpdateAvailable(true);
      } else if (!storedVersion) {
         localStorage.setItem('app_version', APP_VERSION);
      }

      const savedHistory = localStorage.getItem('poster_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      
      const savedUser = localStorage.getItem('poster_user_profile');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Force login if no user found
        setShowLoginModal(true);
      }

      const savedDraft = localStorage.getItem('poster_current_draft');
      if (savedDraft) {
        setHasDraft(true);
      }
    } catch (e) {
      console.error("Failed to load local storage data", e);
    }
  }, []);

  // Update loading phase
  useEffect(() => {
    if (isGenerating) {
      setLoadingPhase(0);
      const interval: any = setInterval(() => {
        setLoadingPhase(prev => (prev < LOADING_PHASES.length - 1 ? prev + 1 : prev));
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  // OTP Timer
  useEffect(() => {
    let interval: any;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev: number) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  // Notifications
  const triggerNotification = (msg: string) => {
    if (user && user.settings && !user.settings.notifications) return;
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Update Handler
  const applyUpdate = () => {
    localStorage.setItem('app_version', APP_VERSION);
    setUpdateAvailable(false);
    setShowUpdateSuccess(true);
    setTimeout(() => {
        window.location.reload();
    }, 1000);
  };

  // Login Handlers
  const handleSendOtp = () => {
    if (loginPhone.length < 10) {
        alert("Please enter a valid mobile number");
        return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
        setIsLoggingIn(false);
        setOtpSent(true);
        setOtpTimer(30);
        // Simulate receiving OTP
        setTimeout(() => setLoginOtp('123456'), 1500);
        triggerNotification(`OTP sent to ${loginPhone}`);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (loginOtp.length !== 6) {
        alert("Please enter a valid 6-digit OTP");
        return;
    }
    setIsLoggingIn(true);
    setTimeout(() => {
        const newUser: UserProfile = {
            name: `User ${loginPhone.slice(-4)}`,
            phoneNumber: loginPhone,
            email: '',
            joinedAt: Date.now(),
            settings: { notifications: true, highQualityPreviews: true, saveHistory: true, biometricEnabled: false }
        };
        setUser(newUser);
        localStorage.setItem('poster_user_profile', JSON.stringify(newUser));
        setIsLoggingIn(false);
        setShowLoginModal(false);
        triggerNotification("Welcome!");
    }, 1500);
  };

  // Profile Management
  const handleOpenProfile = () => {
    setEditName(user?.name || '');
    setEditAvatar(user?.profilePicture);
    setIsEditingProfile(false);
    setActiveProfileTab('profile');
    setShowProfileModal(true);
  };

  const saveProfileChanges = () => {
    if (!user) return;
    const updatedUser = { ...user, name: editName, profilePicture: editAvatar };
    setUser(updatedUser);
    localStorage.setItem('poster_user_profile', JSON.stringify(updatedUser));
    setIsEditingProfile(false);
    triggerNotification("Profile updated");
  };

  const toggleSetting = (settingKey: keyof UserSettings) => {
    if (!user) return;
    const newSettings = { ...user.settings, [settingKey]: !user.settings[settingKey] };
    const updatedUser = { ...user, settings: newSettings };
    setUser(updatedUser);
    localStorage.setItem('poster_user_profile', JSON.stringify(updatedUser));
  };

  const clearHistory = () => {
     // eslint-disable-next-line no-restricted-globals
     if(confirm("Are you sure you want to clear your entire design history?")) {
        setHistory([]);
        localStorage.removeItem('poster_history');
        triggerNotification("History cleared");
     }
  };
  
  const handleExportHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "posters_ai_history.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleResetAppData = () => {
    // eslint-disable-next-line no-restricted-globals
    if (window.confirm("Are you sure you want to reset the app? This will clear all history and settings.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Reset fields on type change
  useEffect(() => {
    if (posterType !== PosterType.FESTIVAL) setFestivalName('');
    if (posterType !== PosterType.ANNIVERSARY) {
      setHusbandName(''); setWifeName(''); setMarriageTheme('');
    }
    if (posterType !== PosterType.CUSTOM) setCustomTemplate('');
    if (posterType !== PosterType.MOVIE) {
      setMovieGenre(''); setMovieTagline(''); setMovieTemplate('');
    }
    if (posterType !== PosterType.BIRTHDAY && posterType !== PosterType.ANNIVERSARY) {
      setCustomDate('');
    }
  }, [posterType]);

  // Undo/Redo Logic
  const captureSnapshot = (): AppStateSnapshot => ({
    posterType, aspectRatio, userImage, age, year, customDate, name, festivalName,
    husbandName, wifeName, marriageTheme, customTemplate, movieGenre,
    movieTagline, movieTemplate, fontStyle, qrCodeUrl, generatedImage
  });

  const restoreSnapshot = (s: AppStateSnapshot) => {
    setPosterType(s.posterType);
    setAspectRatio(s.aspectRatio);
    setUserImage(s.userImage);
    setAge(s.age);
    setYear(s.year);
    setCustomDate(s.customDate);
    setName(s.name);
    setFestivalName(s.festivalName);
    setHusbandName(s.husbandName);
    setWifeName(s.wifeName);
    setMarriageTheme(s.marriageTheme);
    setCustomTemplate(s.customTemplate);
    setMovieGenre(s.movieGenre);
    setMovieTagline(s.movieTagline);
    setMovieTemplate(s.movieTemplate);
    setFontStyle(s.fontStyle);
    setQrCodeUrl(s.qrCodeUrl);
    setGeneratedImage(s.generatedImage);
  };

  const recordChange = () => {
    setPast(prev => [...prev, captureSnapshot()]);
    setFuture([]);
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    
    setFuture(prev => [captureSnapshot(), ...prev]);
    setPast(newPast);
    restoreSnapshot(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    
    setPast(prev => [...prev, captureSnapshot()]);
    setFuture(newFuture);
    restoreSnapshot(next);
  };

  const handleTypeChange = (type: PosterType) => {
    if (type === posterType) return;
    recordChange();
    setPosterType(type);
  };

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    if (ratio === aspectRatio) return;
    recordChange();
    setAspectRatio(ratio);
  };

  const handleImageSelected = (img: string | undefined) => {
    recordChange();
    setUserImage(img);
  };

  const handleVisualSelectChange = (val: string, setter: (v: string) => void) => {
    recordChange();
    setter(val);
  };

  // Draft Logic
  const handleSaveDraft = () => {
    try {
        const draft = captureSnapshot();
        try {
            localStorage.setItem('poster_current_draft', JSON.stringify(draft));
        } catch (e) {
            const draftNoImage = { ...draft, userImage: undefined };
            localStorage.setItem('poster_current_draft', JSON.stringify(draftNoImage));
        }
        setHasDraft(true);
        triggerNotification("Draft saved successfully");
    } catch (e) {
        console.error("Failed to save draft", e);
        setError("Failed to save draft. Storage full.");
    }
  };

  const handleLoadDraft = () => {
    try {
        const saved = localStorage.getItem('poster_current_draft');
        if (saved) {
            const draft = JSON.parse(saved);
            recordChange();
            restoreSnapshot(draft);
            setActiveTab('create');
            triggerNotification("Draft loaded");
        }
    } catch (e) {
        console.error("Failed to load draft", e);
    }
  };

  const saveToHistory = (request: PosterRequest, resultImage: string) => {
    if (user && !user.settings?.saveHistory) return;

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      request,
      generatedImage: resultImage
    };

    let newHistory = [newItem, ...history].slice(0, 10);

    try {
      localStorage.setItem('poster_history', JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (e) {
      try {
        const itemWithoutResult = { ...newItem, generatedImage: null };
        newHistory = [itemWithoutResult, ...history].slice(0, 10);
        localStorage.setItem('poster_history', JSON.stringify(newHistory));
        setHistory(newHistory);
      } catch (e2) {
         // Storage full, ignore
      }
    }
  };

  const requestDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmationId(id);
  };

  const confirmDelete = () => {
    if (!deleteConfirmationId) return;
    const updatedHistory = history.filter(item => item.id !== deleteConfirmationId);
    setHistory(updatedHistory);
    localStorage.setItem('poster_history', JSON.stringify(updatedHistory));
    setDeleteConfirmationId(null);
    triggerNotification("Item deleted");
  };

  const cancelDelete = () => {
    setDeleteConfirmationId(null);
  };

  const loadHistoryItem = (item: HistoryItem) => {
    recordChange();
    const req = item.request;
    setPosterType(req.type);
    setAspectRatio(req.aspectRatio);
    setUserImage(req.userImage); 
    setAge(req.age || '');
    setYear(req.year || '');
    setCustomDate(req.customDate || '');
    setName(req.name || '');
    setFestivalName(req.festivalName || '');
    setHusbandName(req.husbandName || '');
    setWifeName(req.wifeName || '');
    setMarriageTheme(req.marriageTheme || '');
    setCustomTemplate(req.customTemplate || '');
    setMovieGenre(req.movieGenre || '');
    setMovieTagline(req.movieTagline || '');
    setMovieTemplate(req.movieTemplate || '');
    setFontStyle(req.fontStyle || '');
    setQrCodeUrl(req.qrCodeUrl || '');
    setGeneratedImage(item.generatedImage || null);
    setActiveTab('create');
  };

  const getPromptForType = (type: PosterType) => {
    switch (type) {
      case PosterType.BIRTHDAY: return "balloons, confetti, cake, and vibrant, cheerful colors.";
      case PosterType.FESTIVAL: return "traditional decorations, glowing lights, patterns, and a culturally rich atmosphere.";
      case PosterType.ANNIVERSARY: return "elegant floral arrangements, soft lighting, golden accents, hearts, and a premium romantic atmosphere.";
      case PosterType.CUSTOM: return customTemplate ? `A professional ${customTemplate} poster design.` : "professional design with modern elements.";
      case PosterType.MOVIE: return `cinematic ${movieGenre} movie poster${movieTemplate ? ` in style of ${movieTemplate}` : ''}.`;
      default: return "creative poster design.";
    }
  };

  const handleGenerate = async () => {
    if (!userImage) {
      setError("Please upload an image first.");
      return;
    }

    recordChange();
    setIsGenerating(true);
    setGeneratedImage(null);
    setError(null);
    setLoadingPhase(0);

    const request: PosterRequest = {
      prompt: getPromptForType(posterType),
      type: posterType,
      aspectRatio,
      userImage,
      age,
      year,
      customDate,
      name,
      festivalName,
      husbandName,
      wifeName,
      marriageTheme,
      customTemplate,
      movieGenre,
      movieTagline,
      movieTemplate,
      fontStyle,
      qrCodeUrl
    };

    try {
      const resultImage = await generatePosterImage(request);
      setGeneratedImage(resultImage);
      saveToHistory(request, resultImage);
      triggerNotification("Poster Generated Successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to generate poster. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `poster-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotification("Downloading JPG...");
  };

  // Sharing Functions
  const shareImage = async () => {
    if (!generatedImage) return;

    try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], 'poster.jpg', { type: 'image/jpeg' });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Check out my AI Poster!',
                text: 'Created with Posters AI',
            });
            triggerNotification("Shared successfully!");
        } else {
            handleDownload();
            alert("Your browser doesn't support direct image sharing. The image has been downloaded.");
        }
    } catch (error) {
        console.error('Sharing failed', error);
        alert('Sharing failed. Please try downloading instead.');
    }
  };

  const shareWhatsApp = () => {
      const text = shareMode === 'app' 
        ? "Check out this amazing AI Poster Generator App! Create stunning designs in seconds: https://posters-ai.vercel.app" 
        : "Check out this amazing poster I created with AI!";
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
  };

  const shareTwitter = () => {
     const text = shareMode === 'app'
        ? "Create stunning posters with AI in seconds! Check out Posters AI: "
        : "Just created this amazing poster using AI! #PostersAI #AIArt";
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareMode === 'app' ? window.location.href : '')}`;
      window.open(url, '_blank');
  };

  const shareFacebook = () => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
      window.open(url, '_blank');
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden relative">
      
      {/* --- Sidebar --- */}
      <aside className="w-96 flex flex-col border-r border-white/5 bg-zinc-900/50 backdrop-blur-xl z-20 shadow-2xl">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fas fa-wand-magic-sparkles text-white text-sm"></i>
            </div>
            <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Posters AI</h1>
          </div>
          
          <div className="flex items-center gap-2">
             <button onClick={undo} disabled={past.length === 0} className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors" title="Undo">
                <i className="fas fa-undo text-xs"></i>
             </button>
             <button onClick={redo} disabled={future.length === 0} className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors" title="Redo">
                <i className="fas fa-redo text-xs"></i>
             </button>
             
             {/* User Profile Button - Always Active */}
             <button 
                onClick={handleOpenProfile}
                className="flex items-center gap-2 px-2 py-1 rounded-full border bg-zinc-800 border-zinc-700 hover:border-zinc-500 transition-all"
             >
                {user && (
                    <>
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                                {user.name.charAt(0)}
                            </div>
                        )}
                        <span className="text-xs font-medium max-w-[60px] truncate">{user.name.split(' ')[0]}</span>
                    </>
                )}
             </button>
          </div>
        </div>

        {/* Sidebar Tabs */}
        <div className="flex p-2 gap-2 border-b border-white/5 bg-zinc-900/30">
          <button 
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'create' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Create
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'history' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            History
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
          {activeTab === 'create' ? (
            <>
              {/* Type Selection */}
              <div className="grid grid-cols-3 gap-2">
                {Object.values(PosterType).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`
                      py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all
                      ${posterType === type 
                        ? 'bg-white text-black border-white shadow-lg shadow-white/10 scale-105' 
                        : 'bg-zinc-800/50 border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300'
                      }
                    `}
                  >
                    {type === 'Marriage' ? 'Anniversary' : type}
                  </button>
                ))}
              </div>

              {/* Dynamic Inputs based on Type */}
              <div className="space-y-4 animate-fade-in">
                
                {/* 1. Occasion / Event Selection */}
                {posterType === PosterType.FESTIVAL && (
                   <VisualSelect 
                        label="Select Festival" 
                        options={INDIAN_FESTIVALS} 
                        value={festivalName} 
                        onChange={(v) => handleVisualSelectChange(v, setFestivalName)} 
                        category="festival" 
                        required 
                   />
                )}

                {posterType === PosterType.CUSTOM && (
                   <VisualSelect 
                        label="Select Template" 
                        options={CUSTOM_TEMPLATES} 
                        value={customTemplate} 
                        onChange={(v) => handleVisualSelectChange(v, setCustomTemplate)} 
                        category="custom" 
                        placeholder="Choose a template..."
                   />
                )}

                {posterType === PosterType.MOVIE && (
                  <>
                    <VisualSelect 
                        label="Movie Genre" 
                        options={MOVIE_GENRES} 
                        value={movieGenre} 
                        onChange={(v) => handleVisualSelectChange(v, setMovieGenre)} 
                        category="movie" 
                        required 
                    />
                    <VisualSelect 
                        label="Visual Style" 
                        options={MOVIE_TEMPLATES} 
                        value={movieTemplate} 
                        onChange={(v) => handleVisualSelectChange(v, setMovieTemplate)} 
                        category="movie" 
                    />
                  </>
                )}

                {posterType === PosterType.ANNIVERSARY && (
                    <VisualSelect 
                        label="Select Theme" 
                        options={INDIAN_WEDDING_THEMES} 
                        value={marriageTheme} 
                        onChange={(v) => handleVisualSelectChange(v, setMarriageTheme)} 
                        category="theme" 
                    />
                )}

                {/* 2. Upload Image (Common) */}
                <ImageUpload 
                    label="Upload Photo" 
                    required 
                    onImageSelected={handleImageSelected}
                    previewUrl={userImage} 
                />

                {/* 3. Text Inputs */}
                {posterType === PosterType.BIRTHDAY && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 relative">
                         <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Name</label>
                         <div className="flex gap-2">
                             <input type="text" value={name} onChange={(e) => { recordChange(); setName(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="Birthday Person" />
                             <MicInput onTranscript={(t) => { recordChange(); setName(t); }} isListening={listeningField === 'name'} setIsListening={(val) => setListeningField(val ? 'name' : null)} />
                         </div>
                    </div>
                    <div>
                         <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Age (Optional)</label>
                         <input type="text" value={age} onChange={(e) => { recordChange(); setAge(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. 25" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Year (Optional)</label>
                        <input type="text" value={year} onChange={(e) => { recordChange(); setYear(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. 2024" />
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Birthday Date (Optional)</label>
                        <input type="date" value={customDate} onChange={(e) => { recordChange(); setCustomDate(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>
                )}

                {posterType === PosterType.FESTIVAL && (
                    <div>
                         <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Year (Optional)</label>
                         <input type="text" value={year} onChange={(e) => { recordChange(); setYear(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="e.g. 2024" />
                    </div>
                )}

                {posterType === PosterType.ANNIVERSARY && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Husband</label>
                                <div className="flex gap-2">
                                     <input type="text" value={husbandName} onChange={(e) => { recordChange(); setHusbandName(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="Name" />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Wife</label>
                                <div className="flex gap-2">
                                     <input type="text" value={wifeName} onChange={(e) => { recordChange(); setWifeName(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="Name" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Anniversary Date (Optional)</label>
                            <input type="date" value={customDate} onChange={(e) => { recordChange(); setCustomDate(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                        </div>
                         <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Years (Optional)</label>
                            <input type="text" value={age} onChange={(e) => { recordChange(); setAge(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="e.g. 10th" />
                        </div>
                    </div>
                )}

                {posterType === PosterType.MOVIE && (
                    <div className="space-y-3">
                         <div className="relative">
                             <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Movie Title</label>
                             <div className="flex gap-2">
                                 <input type="text" value={name} onChange={(e) => { recordChange(); setName(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="Title" />
                                 <MicInput onTranscript={(t) => { recordChange(); setName(t); }} isListening={listeningField === 'title'} setIsListening={(val) => setListeningField(val ? 'title' : null)} />
                             </div>
                         </div>
                         <div className="relative">
                             <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Tagline</label>
                             <div className="flex gap-2">
                                 <input type="text" value={movieTagline} onChange={(e) => { recordChange(); setMovieTagline(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="Catchy phrase" />
                                 <MicInput onTranscript={(t) => { recordChange(); setMovieTagline(t); }} isListening={listeningField === 'tagline'} setIsListening={(val) => setListeningField(val ? 'tagline' : null)} />
                             </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Release Year</label>
                            <input type="text" value={year} onChange={(e) => { recordChange(); setYear(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="e.g. 2025" />
                        </div>
                    </div>
                )}

                {posterType === PosterType.CUSTOM && (
                    <div className="space-y-3">
                        <div className="relative">
                             <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Title / Main Text</label>
                             <div className="flex gap-2">
                                 <input type="text" value={name} onChange={(e) => { recordChange(); setName(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="Main Heading" />
                                 <MicInput onTranscript={(t) => { recordChange(); setName(t); }} isListening={listeningField === 'customTitle'} setIsListening={(val) => setListeningField(val ? 'customTitle' : null)} />
                             </div>
                        </div>
                         <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">Date / Info</label>
                            <input type="text" value={year} onChange={(e) => { recordChange(); setYear(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500" placeholder="Date or Subtitle" />
                        </div>
                    </div>
                )}
                
                {/* 4. Font Style */}
                <VisualSelect 
                     label="Font Style" 
                     options={FONT_STYLES} 
                     value={fontStyle} 
                     onChange={(v) => handleVisualSelectChange(v, setFontStyle)} 
                     category="custom" 
                     placeholder="Default (AI Choice)"
                />

                {/* 5. Aspect Ratio */}
                <AspectRatioSelector selected={aspectRatio} onChange={handleAspectRatioChange} />
                
                {/* 6. QR Code */}
                <div>
                     <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1 block">QR Code Link (Optional)</label>
                     <input type="text" value={qrCodeUrl} onChange={(e) => { recordChange(); setQrCodeUrl(e.target.value); }} className="w-full bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="https://example.com" />
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`
                    w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-xl transition-all duration-300 relative overflow-hidden group
                    ${isGenerating ? 'bg-zinc-800 cursor-not-allowed text-zinc-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/25 text-white'}
                  `}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isGenerating ? (
                      <>
                        <i className="fas fa-circle-notch fa-spin"></i> Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-wand-magic-sparkles"></i> Generate Poster
                      </>
                    )}
                  </span>
                  {!isGenerating && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {history.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">
                  <i className="fas fa-history text-4xl mb-3 opacity-50"></i>
                  <p>No history yet.</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} onClick={() => loadHistoryItem(item)} className="bg-zinc-800/50 border border-white/5 rounded-xl p-3 hover:bg-zinc-800 transition-colors cursor-pointer group relative">
                    <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg bg-zinc-900 flex items-center justify-center overflow-hidden border border-white/5">
                            {item.generatedImage ? (
                                <img src={item.generatedImage} alt="Poster" className="w-full h-full object-cover" />
                            ) : (
                                <i className="fas fa-image text-zinc-700"></i>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-zinc-200 truncate">{item.request.type} Poster</h4>
                            <p className="text-xs text-zinc-500 truncate mt-0.5">
                                {item.request.festivalName || item.request.name || new Date(item.timestamp).toLocaleDateString()}
                            </p>
                             <p className="text-[10px] text-zinc-600 mt-2 font-mono">
                                {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={(e) => requestDelete(item.id, e)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-900/50 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <i className="fas fa-trash-alt text-[10px]"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar Footer - Drafts */}
        <div className="p-4 border-t border-white/5 bg-zinc-900/50">
             <div className="flex gap-2">
                 <button onClick={handleSaveDraft} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-bold uppercase transition-colors">
                     Save Draft
                 </button>
                 {hasDraft && (
                    <button onClick={handleLoadDraft} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-indigo-400 hover:text-indigo-300 rounded-lg text-xs font-bold uppercase transition-colors">
                        Load Draft
                    </button>
                 )}
             </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 relative bg-zinc-950 flex items-center justify-center bg-grid-pattern p-10 overflow-hidden">
        
        {/* Empty State */}
        {!generatedImage && !isGenerating && (
            <div className="text-center space-y-4 animate-fade-in">
                <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto shadow-2xl rotate-3">
                     <i className="fas fa-magic text-4xl text-zinc-700"></i>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Create AI Masterpieces</h2>
                    <p className="text-zinc-500 max-w-md mx-auto">Fill in the details in the sidebar and watch the AI bring your vision to life.</p>
                </div>
            </div>
        )}

        {/* Loading State */}
        {isGenerating && (
            <div className="flex flex-col items-center animate-fade-in z-10">
                <div className="relative w-32 h-32 mb-8">
                     <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                     <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                         <i className="fas fa-wand-magic-sparkles text-3xl text-indigo-400"></i>
                     </div>
                </div>
                
                <div className="w-80 bg-zinc-900/80 backdrop-blur-md rounded-2xl p-1 border border-white/5 relative overflow-hidden">
                    {LOADING_PHASES.map((phase, index) => (
                        <div 
                            key={index}
                            className={`
                                flex items-center gap-3 p-3 rounded-xl transition-all duration-500
                                ${index === loadingPhase ? `${phase.bg} border border-white/10` : 'opacity-30 scale-95'}
                                ${index < loadingPhase ? 'opacity-0 absolute top-0 left-0 pointer-events-none' : ''}
                            `}
                        >
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === loadingPhase ? phase.color : 'text-zinc-500'}`}>
                               <i className={`fas ${phase.icon}`}></i>
                           </div>
                           <span className={`text-sm font-medium ${index === loadingPhase ? 'text-white' : 'text-zinc-500'}`}>
                               {phase.text}
                           </span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Error Alert in Main View */}
        {error && !isGenerating && (
             <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 animate-fade-in-up">
                 <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-4 max-w-md">
                     <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 text-red-500">
                         <i className="fas fa-exclamation-triangle"></i>
                     </div>
                     <div>
                         <h4 className="font-bold text-sm">Generation Failed</h4>
                         <p className="text-xs opacity-80 mt-1">{error}</p>
                     </div>
                 </div>
             </div>
        )}

        {/* Generated Image Overlay */}
        {generatedImage && !isGenerating && (
          <div className="relative w-auto h-auto max-w-full max-h-full p-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl animate-scale-up group">
              <img 
                 src={generatedImage} 
                 alt="Generated Poster" 
                 className="max-w-full max-h-[85vh] rounded-lg shadow-lg"
              />
              
              {/* Overlay Actions */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 shadow-2xl">
                 <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                 >
                    <i className="fas fa-download"></i> Download JPG
                 </button>
                 <div className="w-px h-4 bg-white/20"></div>
                 <button 
                     onClick={() => setShowShareModal(true)}
                     className="p-2 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center"
                     title="Share"
                 >
                     <i className="fas fa-share-alt text-xs"></i>
                 </button>
              </div>

              {/* Quick Share Buttons Below Image */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <button onClick={shareTwitter} className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-white hover:text-sky-500 hover:border-sky-500 transition-all transform hover:scale-110 shadow-lg">
                      <i className="fab fa-twitter"></i>
                  </button>
                  <button onClick={shareFacebook} className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-white hover:text-blue-600 hover:border-blue-600 transition-all transform hover:scale-110 shadow-lg">
                      <i className="fab fa-facebook-f"></i>
                  </button>
                  <button onClick={shareWhatsApp} className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-white hover:text-green-500 hover:border-green-500 transition-all transform hover:scale-110 shadow-lg">
                      <i className="fab fa-whatsapp text-lg"></i>
                  </button>
              </div>
          </div>
        )}
      </main>

      {/* --- Notification Toast --- */}
      {notification && (
        <div className="fixed bottom-10 right-10 z-50 bg-zinc-900 border border-white/10 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up">
           <i className="fas fa-check-circle text-green-500"></i>
           <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* --- Update Banner --- */}
      {updateAvailable && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 text-white px-4 py-2 flex items-center justify-between shadow-xl">
             <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                 <i className="fas fa-sparkles animate-pulse"></i> New Update Available
             </div>
             <button onClick={applyUpdate} className="bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-indigo-50 transition-colors">
                 Update Now
             </button>
        </div>
      )}
      {showUpdateSuccess && (
          <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center animate-fade-in">
              <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 animate-scale-up">
                      <i className="fas fa-check text-2xl text-white"></i>
                  </div>
                  <h2 className="text-white font-bold text-xl">Updated Successfully!</h2>
                  <p className="text-zinc-500 text-sm mt-2">Reloading app...</p>
              </div>
          </div>
      )}

      {/* --- Modals --- */}
      
      {/* 1. Login Modal (Mobile Only) */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
                {/* Header */}
                <div className="p-6 text-center border-b border-white/5 bg-zinc-900/50">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/20">
                        <i className="fas fa-mobile-alt text-xl text-white"></i>
                    </div>
                    <h2 className="text-xl font-bold text-white">Welcome to Posters AI</h2>
                    <p className="text-zinc-500 text-sm mt-1">Enter your mobile number to get started</p>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                   {!otpSent ? (
                       <div className="space-y-4">
                           <div>
                               <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5 block">Mobile Number</label>
                               <div className="relative">
                                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">+91</div>
                                   <input 
                                      type="tel" 
                                      value={loginPhone}
                                      onChange={(e) => {
                                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                          setLoginPhone(val);
                                      }}
                                      className="w-full bg-zinc-800/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono tracking-wide"
                                      placeholder="00000 00000"
                                      autoFocus
                                   />
                               </div>
                           </div>
                           <button 
                                onClick={handleSendOtp}
                                disabled={loginPhone.length < 10 || isLoggingIn}
                                className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                           >
                                {isLoggingIn ? <i className="fas fa-circle-notch fa-spin"></i> : "Get OTP"}
                           </button>
                       </div>
                   ) : (
                       <div className="space-y-4 animate-fade-in">
                           <div className="text-center mb-2">
                               <p className="text-zinc-400 text-sm">Enter the code sent to <span className="text-white font-mono">+91 {loginPhone}</span></p>
                               <button onClick={() => { setOtpSent(false); setLoginOtp(''); }} className="text-indigo-400 text-xs hover:underline mt-1">Change Number</button>
                           </div>

                           <div>
                               <input 
                                   type="tel"
                                   value={loginOtp}
                                   onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                   className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-center text-white tracking-[1em] font-mono text-lg focus:outline-none focus:border-indigo-500 placeholder-zinc-700"
                                   placeholder="••••••"
                                   maxLength={6}
                                   autoFocus
                               />
                           </div>

                           <button 
                                onClick={handleVerifyOtp}
                                disabled={loginOtp.length < 6 || isLoggingIn}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                           >
                                {isLoggingIn ? <i className="fas fa-circle-notch fa-spin"></i> : "Verify & Continue"}
                           </button>

                           <div className="text-center">
                               {otpTimer > 0 ? (
                                   <p className="text-zinc-500 text-xs">Resend code in <span className="text-white font-mono">00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</span></p>
                               ) : (
                                   <button onClick={handleSendOtp} className="text-indigo-400 text-xs font-bold hover:text-indigo-300">Resend Code</button>
                               )}
                           </div>
                       </div>
                   )}
                </div>
            </div>
        </div>
      )}

      {/* 2. Profile Modal */}
      {showProfileModal && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowProfileModal(false)}>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="font-bold text-lg">My Account</h2>
                    <button onClick={() => setShowProfileModal(false)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="flex border-b border-white/5">
                    {['profile', 'settings', 'about', 'help'].map((tab) => (
                        <button 
                            key={tab}
                            onClick={() => setActiveProfileTab(tab as any)}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activeProfileTab === tab ? 'text-indigo-400 border-b-2 border-indigo-500 bg-zinc-800/30' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {activeProfileTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    {isEditingProfile ? (
                                        <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-dashed border-zinc-600 hover:border-indigo-500 cursor-pointer overflow-hidden" onClick={() => profileFileInputRef.current?.click()}>
                                            {editAvatar ? (
                                                <img src={editAvatar} alt="New Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <i className="fas fa-camera text-zinc-500"></i>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold shadow-lg overflow-hidden">
                                            {user.profilePicture ? (
                                                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.charAt(0)
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    {isEditingProfile ? (
                                        <input 
                                            type="text" 
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none mb-2"
                                            placeholder="Your Name"
                                        />
                                    ) : (
                                        <>
                                            <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                            <p className="text-zinc-500 text-sm">{user.phoneNumber}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {/* Share App Section in Profile */}
                            {!isEditingProfile && (
                                <div className="bg-zinc-800/30 rounded-xl p-4 border border-white/5">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Share Posters AI</h4>
                                    <div className="flex gap-3">
                                        <button onClick={() => { setShareMode('app'); shareTwitter(); }} className="flex-1 py-2 bg-black border border-zinc-700 rounded-lg hover:border-sky-500 hover:text-sky-500 transition-colors flex items-center justify-center gap-2">
                                            <i className="fab fa-twitter"></i> <span className="text-xs font-bold">Twitter</span>
                                        </button>
                                        <button onClick={() => { setShareMode('app'); shareFacebook(); }} className="flex-1 py-2 bg-black border border-zinc-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                                            <i className="fab fa-facebook-f"></i> <span className="text-xs font-bold">Facebook</span>
                                        </button>
                                        <button onClick={() => { setShareMode('app'); shareWhatsApp(); }} className="flex-1 py-2 bg-black border border-zinc-700 rounded-lg hover:border-green-500 hover:text-green-500 transition-colors flex items-center justify-center gap-2">
                                            <i className="fab fa-whatsapp"></i> <span className="text-xs font-bold">WhatsApp</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                {isEditingProfile ? (
                                    <>
                                        <button onClick={saveProfileChanges} className="py-2 bg-indigo-600 rounded-lg text-sm font-bold">Save Changes</button>
                                        <button onClick={() => setIsEditingProfile(false)} className="py-2 bg-zinc-800 rounded-lg text-sm font-bold text-zinc-400">Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setIsEditingProfile(true)} className="py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-bold border border-white/5">Edit Profile</button>
                                        <button onClick={handleExportHistory} className="py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-bold border border-white/5"><i className="fas fa-download mr-2"></i> Export Data</button>
                                    </>
                                )}
                            </div>
                            
                            {!isEditingProfile && (
                                <button onClick={handleResetAppData} className="w-full py-3 mt-4 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
                                    Reset App Data & Logout
                                </button>
                            )}
                        </div>
                    )}

                    {activeProfileTab === 'settings' && (
                        <div className="space-y-1">
                             {[
                                { key: 'notifications', label: 'Notifications', icon: 'fa-bell' },
                                { key: 'highQualityPreviews', label: 'High Quality Previews', icon: 'fa-eye' },
                                { key: 'saveHistory', label: 'Auto-Save History', icon: 'fa-history' },
                                { key: 'biometricEnabled', label: 'Biometric Login', icon: 'fa-fingerprint' }
                             ].map((setting) => (
                                 <div key={setting.key} className="flex items-center justify-between p-3 hover:bg-zinc-800/50 rounded-xl transition-colors">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                                             <i className={`fas ${setting.icon}`}></i>
                                         </div>
                                         <span className="text-sm font-medium">{setting.label}</span>
                                     </div>
                                     <button 
                                        onClick={() => toggleSetting(setting.key as keyof UserSettings)}
                                        className={`w-10 h-6 rounded-full p-1 transition-colors ${user.settings[setting.key as keyof UserSettings] ? 'bg-indigo-600' : 'bg-zinc-700'}`}
                                     >
                                         <div className={`w-4 h-4 rounded-full bg-white transition-transform ${user.settings[setting.key as keyof UserSettings] ? 'translate-x-4' : ''}`}></div>
                                     </button>
                                 </div>
                             ))}
                             
                             <div className="pt-4 mt-4 border-t border-white/5">
                                 <button onClick={clearHistory} className="w-full flex items-center justify-between p-3 hover:bg-red-500/10 rounded-xl transition-colors text-red-400 group">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                                             <i className="fas fa-trash-alt"></i>
                                         </div>
                                         <span className="text-sm font-medium">Clear History</span>
                                     </div>
                                     <i className="fas fa-chevron-right text-xs opacity-50 group-hover:opacity-100"></i>
                                 </button>
                             </div>
                        </div>
                    )}

                    {activeProfileTab === 'about' && (
                        <div className="text-center space-y-4 py-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto shadow-xl">
                                <i className="fas fa-wand-magic-sparkles text-3xl text-white"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Posters AI</h3>
                                <p className="text-zinc-500 text-sm">Version {APP_VERSION}</p>
                            </div>
                            <p className="text-sm text-zinc-400 leading-relaxed px-4">
                                Generate stunning professional posters for any occasion using the power of Google Gemini 2.5 AI.
                            </p>
                            <div className="flex items-center justify-center gap-4 text-xs font-bold text-indigo-400 uppercase tracking-wider pt-4">
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                            </div>
                        </div>
                    )}

                    {activeProfileTab === 'help' && (
                        <div className="space-y-2">
                             {FAQ_ITEMS.map((item, index) => (
                                 <div key={index} className="border border-white/5 rounded-xl overflow-hidden bg-zinc-800/30">
                                     <button 
                                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                        className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-800 transition-colors"
                                     >
                                         <span className="text-sm font-bold text-zinc-200">{item.question}</span>
                                         <i className={`fas fa-chevron-down text-zinc-500 text-xs transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}></i>
                                     </button>
                                     {openFaqIndex === index && (
                                         <div className="p-3 pt-0 text-xs text-zinc-400 leading-relaxed border-t border-white/5 bg-zinc-900/50">
                                             {item.answer}
                                         </div>
                                     )}
                                 </div>
                             ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* 3. Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowShareModal(false)}>
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-900">
                    <h2 className="font-bold text-lg">Share Poster</h2>
                    <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {/* Primary Action: Share File */}
                    <button onClick={shareImage} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20">
                        <i className="fas fa-share-alt"></i> Share Image File
                    </button>
                    
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-zinc-700"></div>
                        <span className="flex-shrink-0 mx-4 text-zinc-600 text-xs uppercase font-bold">Or Share Link</span>
                        <div className="flex-grow border-t border-zinc-700"></div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                         <button onClick={shareTwitter} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors group">
                             <i className="fab fa-twitter text-2xl text-zinc-500 group-hover:text-sky-500 transition-colors"></i>
                             <span className="text-[10px] font-bold text-zinc-400">Twitter</span>
                         </button>
                         <button onClick={shareFacebook} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors group">
                             <i className="fab fa-facebook text-2xl text-zinc-500 group-hover:text-blue-600 transition-colors"></i>
                             <span className="text-[10px] font-bold text-zinc-400">Facebook</span>
                         </button>
                         <button onClick={shareWhatsApp} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors group">
                             <i className="fab fa-whatsapp text-2xl text-zinc-500 group-hover:text-green-500 transition-colors"></i>
                             <span className="text-[10px] font-bold text-zinc-400">WhatsApp</span>
                         </button>
                    </div>
                    
                    <div className="bg-zinc-800 p-3 rounded-xl flex items-center justify-between gap-3 border border-white/5">
                        <span className="text-xs text-zinc-500 truncate font-mono">https://posters-ai.app/share/...</span>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText("https://posters-ai.app");
                                triggerNotification("Link copied!");
                            }}
                            className="text-xs font-bold text-indigo-400 hover:text-white"
                        >
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* 4. Delete Confirmation Modal */}
      {deleteConfirmationId && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
             <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-scale-up border-l-4 border-l-red-500">
                 <h3 className="font-bold text-lg text-white mb-2">Delete Design?</h3>
                 <p className="text-zinc-400 text-sm mb-6">Are you sure you want to delete this poster? This action cannot be undone.</p>
                 <div className="flex gap-3">
                     <button onClick={cancelDelete} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                     <button onClick={confirmDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-colors">Delete</button>
                 </div>
             </div>
         </div>
      )}

    </div>
  );
};

export default App;