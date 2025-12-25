
import React, { useState, useCallback, useEffect } from 'react';
import { CreationPanel } from './components/CreationPanel';
import { PosterDisplay } from './components/PosterDisplay';
import { Header } from './components/Header';
import { generatePoster } from './services/geminiService';
import type { PosterData, Category, BirthdayType, UserProfile, LoginMethod } from './types';
import { CategorySelectionPage } from './components/CategorySelectionPage';
import { BirthdayTypeSelection } from './components/BirthdayTypeSelection';
import { useTranslation } from './hooks/useTranslation';
import { LoginPage } from './components/LoginPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';

const App: React.FC = () => {
  const { t, language } = useTranslation();
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
    // Reset session stats
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
            // Manage unique users for "Total Users" count
            const usersJSON = localStorage.getItem('posters_ai_users');
            const users: { name: string }[] = usersJSON ? JSON.parse(usersJSON) : [];
            if (!users.some(u => u.name === newUserProfile.name)) {
                users.push({ name: newUserProfile.name });
                localStorage.setItem('posters_ai_users', JSON.stringify(users));
            }

            // Manage "Recent Logins"
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

    // Start new session
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
      // Track successful creation for session stats
      setSessionCreations(prev => prev + 1);
      setSessionCategoryCounts(prev => ({
          ...prev,
          [posterData.category]: (prev[posterData.category] || 0) + 1
      }));
    } catch (err)
      {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 to-indigo-950 text-slate-200 font-sans">
      {isLoggedIn && <Header onProfileClick={() => setIsProfileOpen(true)} profilePic={userProfile.profilePic} />}
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col">
        {isLoggedIn ? renderAppContent() : <LoginPage onLogin={handleLogin} />}
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
