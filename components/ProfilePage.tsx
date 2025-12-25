import React from 'react';
import type { UserProfile } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { UserIcon, CreationsIcon, SettingsIcon, LogoutIcon, CloseIcon, CameraIcon } from './IconComponents';

interface ProfilePageProps {
    user: UserProfile;
    onClose: () => void;
    onProfilePicChange: (pic: string | null) => void;
    onLogout: () => void;
    onOpenSettings: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onClose, onProfilePicChange, onLogout, onOpenSettings }) => {
    const { t } = useTranslation();

    const handleProfilePicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString();
                if (base64String) {
                    onProfilePicChange(base64String);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const menuItems = [
        { label: t('profile.creations'), icon: CreationsIcon, action: () => {} },
        // FIX: Use onOpenSettings for the settings action.
        { label: t('profile.settings'), icon: SettingsIcon, action: onOpenSettings },
        { label: t('profile.logout'), icon: LogoutIcon, action: onLogout, isDestructive: true },
    ];

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700 w-full max-w-sm m-4 relative animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    aria-label="Close profile"
                >
                    <CloseIcon className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        <div className="w-28 h-28 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden">
                            {user.profilePic ? (
                                <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-full h-full text-slate-500 p-4" />
                            )}
                        </div>
                        <label 
                            htmlFor="profile-pic-upload" 
                            className="absolute bottom-0 right-0 bg-cyan-500 text-white rounded-full p-2 cursor-pointer hover:bg-cyan-600 transition-colors"
                            title={t('profile.upload.label')}
                        >
                            <CameraIcon className="w-5 h-5" />
                            <input 
                                id="profile-pic-upload" 
                                type="file" 
                                className="sr-only" 
                                accept="image/*"
                                onChange={handleProfilePicUpload}
                            />
                        </label>
                    </div>

                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-slate-400">{user.email}</p>
                </div>

                <div className="my-8 border-t border-slate-700/50"></div>

                <div className="space-y-2">
                    {menuItems.map(({ label, icon: Icon, action, isDestructive }) => (
                         <button
                            key={label}
                            onClick={action}
                            className={`w-full flex items-center text-left p-3 rounded-lg transition-colors duration-200 ${
                                isDestructive
                                ? 'text-red-400 hover:bg-red-500/10'
                                : 'text-slate-300 hover:bg-slate-700/50'
                            }`}
                        >
                            <Icon className="w-6 h-6 mr-4" />
                            <span className="font-semibold">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
