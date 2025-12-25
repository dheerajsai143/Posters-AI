
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import {
    CloseIcon, LanguageIcon, InfoIcon, HelpIcon, StatsIcon, CreationsIcon, UsersIcon, UserIcon
} from './IconComponents';
import type { TranslationKeys } from '../translations';
import type { Category, UserProfile } from '../types';

interface SettingsPageProps {
    onClose: () => void;
    userProfile: UserProfile;
    sessionCreations: number;
    sessionCategoryCounts: Record<Category, number>;
    isAdmin: boolean;
}

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-3 px-4">{title}</h3>
        <div className="bg-slate-800/50 rounded-lg">{children}</div>
    </div>
);

const SettingItem: React.FC<{ icon: React.FC<any>; label: string; action?: () => void; control?: React.ReactNode; isFirst?: boolean; isLast?: boolean }> = 
({ icon: Icon, label, action, control, isFirst, isLast }) => (
    <div 
        onClick={action}
        className={`flex items-center p-4 text-slate-200 transition-colors duration-200 
        ${action ? 'cursor-pointer hover:bg-slate-700/50' : ''}
        ${isFirst ? 'rounded-t-lg' : ''}
        ${isLast ? 'rounded-b-lg' : ''}
        ${!isLast ? 'border-b border-slate-700/50' : ''}
        `}
    >
        <Icon className="w-6 h-6 mr-4 text-slate-400" />
        <span className="flex-grow font-medium">{label}</span>
        {control && <div className="ml-4">{control}</div>}
    </div>
);

const HelpModal: React.FC<{ onClose: () => void; title: string; content: string }> = ({ onClose, title, content }) => (
    <div 
        className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center backdrop-blur-sm"
        onClick={onClose}
    >
        <div 
            className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700 w-full max-w-2xl m-4 relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-white">{title}</h2>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label="Close help"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="text-slate-300 space-y-4 max-h-[60vh] overflow-y-auto pr-3 text-left leading-relaxed">
                {content.split('\n\n').map((paragraph, index) => (
                    <p key={index} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-cyan-400">$1</strong>').replace(/\n/g, '<br />') }} />
                ))}
            </div>
        </div>
    </div>
);

const ActivityModal: React.FC<{ 
    onClose: () => void;
    creations: number;
    categoryCounts: Record<Category, number>;
    userProfile: UserProfile;
}> = ({ onClose, creations, categoryCounts, userProfile }) => {
    const { t } = useTranslation();
    const [totalUsers, setTotalUsers] = useState(0);
    const [recentLogins, setRecentLogins] = useState<{ name: string; isCurrentUser?: boolean }[]>([]);

    useEffect(() => {
        try {
            const usersJSON = localStorage.getItem('posters_ai_users');
            const users: { name: string }[] = usersJSON ? JSON.parse(usersJSON) : [];
            setTotalUsers(users.length > 0 ? users.length : 1);

            const recentLoginsJSON = localStorage.getItem('posters_ai_recent_logins');
            const storedLogins: { name: string, timestamp: number }[] = recentLoginsJSON ? JSON.parse(recentLoginsJSON) : [];
            
            let displayLogins = storedLogins.map(login => ({
                name: login.name,
                isCurrentUser: login.name === userProfile.name,
            }));

            const currentUserInList = displayLogins.some(u => u.isCurrentUser);
            if (!currentUserInList && userProfile.name !== 'Guest User') {
                displayLogins.unshift({ name: userProfile.name, isCurrentUser: true });
            }

            const currentUserIndex = displayLogins.findIndex(u => u.isCurrentUser);
            if (currentUserIndex > 0) {
                const [currentUser] = displayLogins.splice(currentUserIndex, 1);
                displayLogins.unshift(currentUser);
            }
            
            setRecentLogins(displayLogins.slice(0, 5));

        } catch (e) {
            console.error("Failed to read activity data from localStorage:", e);
            setTotalUsers(1);
            setRecentLogins([{ name: userProfile.name, isCurrentUser: true }]);
        }
    }, [userProfile.name]);

    const getFavoriteCategory = () => {
        const favorite = Object.entries(categoryCounts).reduce(
            (a, b) => (b[1] > a[1] ? b : a),
            ['', 0]
        );
        if (favorite[1] === 0) {
            return 'N/A';
        }
        return t(`category.${favorite[0] as Category}` as TranslationKeys);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700 w-full max-w-2xl m-4 relative animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold text-white">{t('activity.modal.title')}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                        aria-label="Close activity"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Your Session */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-cyan-400 border-b border-slate-700 pb-2">{t('activity.yourSession')}</h3>
                        <div className="bg-slate-800/50 p-4 rounded-lg flex items-center">
                            <CreationsIcon className="w-8 h-8 text-cyan-400 mr-4" />
                            <div>
                                <p className="text-2xl font-bold text-white">{creations}</p>
                                <p className="text-sm text-slate-400">{t('activity.postersCreated')}</p>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg flex items-center">
                            <StatsIcon className="w-8 h-8 text-cyan-400 mr-4" />
                            <div>
                                <p className="text-2xl font-bold text-white">{getFavoriteCategory()}</p>
                                <p className="text-sm text-slate-400">{t('activity.favoriteCategory')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Overall Activity */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-cyan-400 border-b border-slate-700 pb-2">{t('activity.overallActivity')}</h3>
                        <div className="bg-slate-800/50 p-4 rounded-lg flex items-center">
                            <UsersIcon className="w-8 h-8 text-cyan-400 mr-4" />
                            <div>
                                <p className="text-2xl font-bold text-white">{totalUsers}</p>
                                <p className="text-sm text-slate-400">{t('activity.totalUsers')}</p>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <h4 className="font-semibold text-slate-300 mb-3">{t('activity.recentLogins')}</h4>
                            <ul className="space-y-2 max-h-24 overflow-y-auto pr-2">
                                {recentLogins.map((user, index) => (
                                    <li key={index} className={`flex items-center text-sm p-1.5 rounded ${user.isCurrentUser ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400'}`}>
                                        <UserIcon className="w-4 h-4 mr-2" />
                                        <span>{user.name}</span>
                                        {user.isCurrentUser && <span className="ml-auto text-xs font-bold bg-cyan-500/50 text-white px-2 py-0.5 rounded-full">{t('activity.you')}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const SettingsPage: React.FC<SettingsPageProps> = ({ onClose, userProfile, sessionCreations, sessionCategoryCounts, isAdmin }) => {
    const { t, language, setLanguage } = useTranslation();
    const [showHelp, setShowHelp] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    
    return (
        <>
            <div 
                className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center backdrop-blur-sm"
                onClick={onClose}
            >
                <div 
                    className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700 w-full max-w-lg m-4 relative animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-2xl font-bold text-white">{t('settings.title')}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors"
                            aria-label="Close settings"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
                        <SettingsSection title={t('settings.general')}>
                            <SettingItem 
                                icon={LanguageIcon} 
                                label={t('settings.general.language')}
                                isFirst
                                isLast
                                control={
                                    <div className="relative">
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value as 'en' | 'te')}
                                            className="bg-slate-700 border border-slate-600 rounded-md pl-3 pr-8 py-1.5 text-sm focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
                                        >
                                            <option value="en">English</option>
                                            <option value="te">తెలుగు</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                }
                            />
                        </SettingsSection>
                        
                        {isAdmin && (
                            <SettingsSection title={t('settings.activity')}>
                                <SettingItem 
                                    icon={StatsIcon} 
                                    label={t('settings.activity.stats')}
                                    action={() => setShowActivityModal(true)}
                                    isFirst
                                    isLast
                                />
                            </SettingsSection>
                        )}

                        <SettingsSection title={t('settings.help')}>
                            <SettingItem 
                                icon={HelpIcon} 
                                label={t('settings.help.howToUse')}
                                action={() => setShowHelp(true)}
                                isFirst
                                isLast
                            />
                        </SettingsSection>

                        <SettingsSection title={t('settings.about')}>
                            <SettingItem 
                                icon={InfoIcon} 
                                label={t('settings.about.version')}
                                isFirst
                                isLast
                                control={<p className="text-slate-400 text-sm">1.0.0</p>}
                            />
                        </SettingsSection>
                    </div>
                </div>
            </div>
            {showHelp && (
                <HelpModal 
                    onClose={() => setShowHelp(false)} 
                    title={t('settings.help.howToUse')} 
                    content={t('settings.help.howToUse.description')} 
                />
            )}
            {showActivityModal && (
                <ActivityModal 
                    onClose={() => setShowActivityModal(false)}
                    creations={sessionCreations}
                    categoryCounts={sessionCategoryCounts}
                    userProfile={userProfile}
                />
            )}
        </>
    );
};
