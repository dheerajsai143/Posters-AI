
import React, { useState, useCallback, useEffect } from 'react';
import { CreationPanel } from './components/CreationPanel';
import { PosterDisplay } from './components/PosterDisplay';
import { Header } from './components/Header';
import { generatePoster, ApiKeyError } from './services/geminiService';
import type { PosterData, Category, BirthdayType, UserProfile, LoginMethod } from './types';
import { CategorySelectionPage } from './components/CategorySelectionPage';
import { BirthdayTypeSelection } from './components/BirthdayTypeSelection';
import { useTranslation } from './hooks/useTranslation';
import { LoginPage } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { LogoIcon } from './components/IconComponents';

// Add type declaration for the aistudio object on the window
// FIX: Define the AIStudio interface and use it in the global Window declaration to resolve the type conflict.
interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
}

declare global {
    interface Window {
        aistudio?: AIStudio;
    }
}

const ApiKeySelectionPage: React.FC<{ onKeySelected: () => void }> = ({ onKeySelected }) => {
    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // As per guidelines, assume success and proceed to the app.
            onKeySelected();
        }
    };

    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-slate-800 max-w-lg w-full">
                <LogoIcon className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4">Connect to Google AI</h1>
                <p className="text-slate-400 mb-6">
                    This app requires a Google AI API key to generate posters. Please select a key from a project with billing enabled.
                </p>
                <button 
                    onClick={handleSelectKey}
                    className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                    Select API Key
                </button>
                <p className="text-xs text-slate-500 mt-4">
                    For more information on billing, visit{' '}
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                        ai.google.dev/gemini-api/docs/billing
                    </a>.
                </p>
            </div>
        </div>
    );
};

const App: React.FC = () => {
  const { t, language } = useTranslation();
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'needed' | 'ready'>('checking');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Guest User',
    email: 'guest@posters.ai',
    profilePic: null,
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBirthdayType, setSelectedBirthdayType] = useState<BirthdayType | null>(null);
  
  // Session Activity State
  const [sessionCreations, setSessionCreations] = useState(0);
  const [sessionCategoryCounts, setSessionCategoryCounts] = useState<Record<Category, number>>({ Birthday: 0, Festival: 0, Wedding: 0, Custom: 0 });

  const initialPosterData: PosterData = {
    category: 'Birthday',
    image: null,
    ratio: '1:1',
    name: '',
    age: '',
    theme: '',
    date: '',
    venue: '',
    weddingWish: '',
    festivalType: 'Christmas', // Default festival
    weddingStyle: 'Traditional Indian',
    weddingType: 'Invitation',
    birthdayMessage: '',
    language: 'English',
    birthdayType: 'Standard',
    invitedBy: '',
  };

  const [posterData, setPosterData] = useState<PosterData>(initialPosterData);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkApiKey = async () => {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (hasKey) {
                setApiKeyStatus('ready');
            } else {
                setApiKeyStatus('needed');
            }
        } else {
            // If aistudio is not on window, assume key is in environment and proceed
            setApiKeyStatus('ready');
        }
    };
    checkApiKey();
  }, []);

  const updatePosterData = useCallback(<K extends keyof PosterData>(key: K, value: PosterData[K]) => {
    setPosterData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleProfilePicChange = useCallback((pic: string | null) => {
    setUserProfile(prev => ({ ...prev, profilePic: pic }));
  }, []);
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsProfileOpen(false);
    setIsSettingsOpen(false);
    setSelectedCategory(null);
    setSelectedBirthdayType(null);
    setPosterData(initialPosterData);
    setUserProfile({ name: 'Guest User', email: 'guest@posters.ai', profilePic: null });
    setSessionCreations(0);
    setSessionCategoryCounts({ Birthday: 0, Festival: 0, Wedding: 0, Custom: 0 });
  };

  const handleLogin = (method: LoginMethod, data?: { email?: string; phone?: string; username?: string }) => {
    let profileUpdate: Partial<UserProfile> = {};
    setIsAdmin(false);

    switch (method) {
      case 'google':
        profileUpdate = { name: 'Google User', email: 'user@gmail.com' };
        break;
      case 'email':
        if (data?.email) {
          const name = data.email.split('@')[0] || 'User';
          const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
          profileUpdate = { name: capitalizedName, email: data.email };
        }
        break;
      case 'phone':
        if (data?.phone) {
          if (data.username === 'admin' && data.phone === '9999999999') {
            setIsAdmin(true);
            profileUpdate = { name: 'Admin', email: 'admin@posters.ai' };
          } else {
            profileUpdate = { name: data.username || `User ${data.phone}`, email: `${data.phone}@posters.ai` };
          }
        }
        break;
      case 'guest':
      default:
        profileUpdate = { name: 'Guest User', email: 'guest@posters.ai' };
        break;
    }
    
    const newUserProfile = {
      name: profileUpdate.name!,
      email: profileUpdate.email!,
      profilePic: null
    };
    
    setUserProfile(newUserProfile);
    setIsLoggedIn(true);

    if (newUserProfile.name !== 'Guest User') {
        try {
            const usersJSON = localStorage.getItem('posters_ai_users');
            const users: { name: string }[] = usersJSON ? JSON.parse(usersJSON) : [];
            if (!users.some(u => u.name === newUserProfile.name)) {
                users.push({ name: newUserProfile.name });
                localStorage.setItem('posters_ai_users', JSON.stringify(users));
            }

            const recentLoginsJSON = localStorage.getItem('posters_ai_recent_logins');
            let recentLogins: { name: string, timestamp: number }[] = recentLoginsJSON ? JSON.parse(recentLoginsJSON) : [];
            recentLogins = recentLogins.filter(login => login.name !== newUserProfile.name);
            recentLogins.unshift({ name: newUserProfile.name, timestamp: Date.now() });
            
            const MAX_RECENT_LOGINS = 5;
            recentLogins = recentLogins.slice(0, MAX_RECENT_LOGINS);
            localStorage.setItem('posters_ai_recent_logins', JSON.stringify(recentLogins));

        } catch (e) {
            console.error("Failed to update localStorage for activity tracking:", e);
        }
    }

    setSessionCreations(0);
    setSessionCategoryCounts({ Birthday: 0, Festival: 0, Wedding: 0, Custom: 0 });
  };

  const openSettings = () => {
    setIsProfileOpen(false);
    setIsSettingsOpen(true);
  };

  useEffect(() => {
    if (language === 'te') {
      updatePosterData('language', 'Telugu');
    } else {
      updatePosterData('language', 'English');
    }
  }, [language, updatePosterData]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    updatePosterData('category', category);
    if (category !== 'Birthday') {
      setSelectedBirthdayType(null);
    }
  };

  const handleBirthdayTypeSelect = (type: BirthdayType) => {
    setSelectedBirthdayType(type);
    updatePosterData('birthdayType', type);
  };

  const handleBack = () => {
    setGeneratedImageUrl(null);
    setError(null);
    if (selectedCategory === 'Birthday') {
        setSelectedBirthdayType(null);
        setPosterData(prev => ({...initialPosterData, category: 'Birthday'}));
    } else {
        setSelectedCategory(null);
        setPosterData(initialPosterData);
    }
  };

  const handleBackToCategory = () => {
    setSelectedCategory(null);
    setPosterData(initialPosterData);
  };

  const handleGenerateClick = useCallback(async () => {
    if (!posterData.image) {
        setError(t('error.uploadImage'));
        return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const imageUrl = await generatePoster(posterData);
      setGeneratedImageUrl(imageUrl);
      setSessionCreations(prev => prev + 1);
      setSessionCategoryCounts(prev => ({
          ...prev,
          [posterData.category]: (prev[posterData.category] || 0) + 1
      }));
    } catch (err) {
      if (err instanceof ApiKeyError) {
        setApiKeyStatus('needed');
        setError("Your API key is invalid or missing. Please select a new one to continue.");
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [posterData, t]);
  
  const renderAppContent = () => {
    if (!selectedCategory) {
      return <CategorySelectionPage onSelectCategory={handleCategorySelect} />;
    }

    if (selectedCategory === 'Birthday' && !selectedBirthdayType) {
        return <BirthdayTypeSelection onSelect={handleBirthdayTypeSelect} onBack={handleBackToCategory} />;
    }

    return (
      <div className="relative flex flex-col lg:flex-row items-center justify-center gap-8 h-full">
          <CreationPanel
            posterData={posterData}
            updatePosterData={updatePosterData}
            onGenerate={handleGenerateClick}
            isLoading={isLoading}
            onBack={handleBack}
          />
          <PosterDisplay
            imageUrl={generatedImageUrl}
            isLoading={isLoading}
            error={error}
            posterImage={posterData.image}
            ratio={posterData.ratio}
          />
      </div>
    );
  }

  const renderPage = () => {
    if (apiKeyStatus === 'checking') {
        return (
            <div className="flex-grow flex items-center justify-center">
                <LogoIcon className="w-24 h-24 text-cyan-400 animate-pulse" />
            </div>
        );
    }
    if (apiKeyStatus === 'needed') {
        return <ApiKeySelectionPage onKeySelected={() => setApiKeyStatus('ready')} />;
    }
    return isLoggedIn ? renderAppContent() : <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 to-indigo-950 text-slate-200 font-sans">
      {isLoggedIn && apiKeyStatus === 'ready' && <Header onProfileClick={() => setIsProfileOpen(true)} profilePic={userProfile.profilePic} />}
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col">
        {renderPage()}
        {isProfileOpen && (
            <ProfilePage
                user={userProfile}
                onClose={() => setIsProfileOpen(false)}
                onProfilePicChange={handleProfilePicChange}
                onLogout={handleLogout}
                onOpenSettings={openSettings}
            />
        )}
        {isSettingsOpen && (
            <SettingsPage
                onClose={() => setIsSettingsOpen(false)}
                userProfile={userProfile}
                sessionCreations={sessionCreations}
                sessionCategoryCounts={sessionCategoryCounts}
                isAdmin={isAdmin}
            />
        )}
      </main>
    </div>
  );
};

export default App;