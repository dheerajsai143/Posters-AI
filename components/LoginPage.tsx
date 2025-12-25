
import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { LogoIcon, PasswordIcon, PhoneIcon, UserIcon, GoogleIcon, EmailIcon, GuestIcon } from './IconComponents';
import type { LoginMethod } from '../types';

interface LoginPageProps {
    onLogin: (method: LoginMethod, data?: { username?: string; phone?: string; email?: string; }) => void;
}

const LoginButton: React.FC<{ icon: React.FC<any>, text: string, onClick: () => void }> = ({ icon: Icon, text, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-center text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50"
    >
        <Icon className="w-6 h-6 mr-3" />
        <span>{text}</span>
    </button>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const { t } = useTranslation();
    const [view, setView] = useState<'options' | 'phone' | 'otp' | 'email'>('options');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [randomOtp, setRandomOtp] = useState('');
    const [otpError, setOtpError] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleViewChange = (newView: 'options' | 'phone' | 'otp' | 'email') => {
        setIsTransitioning(true);
        setTimeout(() => {
            setView(newView);
            setIsTransitioning(false);
            setOtpError(null);
        }, 300);
    };

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone && username) {
            const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
            setRandomOtp(newOtp);
            handleViewChange('otp');
        }
    };
    
    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            onLogin('email', { email });
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === randomOtp) {
            onLogin('phone', { username, phone });
            setOtpError(null);
        } else {
            setOtpError(t('login.otp.error'));
        }
    };
    
    const renderOptions = () => (
        <div className="space-y-4">
            <LoginButton icon={GoogleIcon} text={t('login.google')} onClick={() => onLogin('google')} />
            <LoginButton icon={PhoneIcon} text={t('login.phone')} onClick={() => handleViewChange('phone')} />
            <LoginButton icon={EmailIcon} text={t('login.email')} onClick={() => handleViewChange('email')} />
            <LoginButton icon={GuestIcon} text={t('login.guest')} onClick={() => onLogin('guest')} />
        </div>
    );

    const renderPhoneForm = () => (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('form.placeholder.username')}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-4 py-3 focus:ring-cyan-500 focus:border-cyan-500 placeholder-slate-400"
                />
            </div>
            <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('login.phone.placeholder')}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-4 py-3 focus:ring-cyan-500 focus:border-cyan-500 placeholder-slate-400"
                />
            </div>
            <button type="submit" className="w-full flex items-center justify-center text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600">
                {t('login.phone.sendOtp')}
            </button>
             <button type="button" onClick={() => handleViewChange('options')} className="w-full text-center text-slate-400 hover:text-white text-sm font-semibold py-2">
                {t('login.back')}
            </button>
        </form>
    );

    const renderEmailForm = () => (
         <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EmailIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('login.email.emailPlaceholder')}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-4 py-3 focus:ring-cyan-500 focus:border-cyan-500 placeholder-slate-400"
                />
            </div>
            <button type="submit" className="w-full flex items-center justify-center text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600">
                {t('login.email.continue')}
            </button>
             <button type="button" onClick={() => handleViewChange('options')} className="w-full text-center text-slate-400 hover:text-white text-sm font-semibold py-2">
                {t('login.back')}
            </button>
        </form>
    );

    const renderOtpForm = () => (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-slate-400 text-sm mb-2">{t('login.otp.subtitle').replace('{phoneNumber}', phone)}</p>
            <div className="bg-cyan-900/50 border border-cyan-700 text-cyan-200 text-sm rounded-md p-3 text-center">
                {t('login.otp.demoMessage').replace('{otp}', randomOtp)}
            </div>
            <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PasswordIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder={t('login.otp.placeholder')}
                    required
                    maxLength={4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-4 py-3 focus:ring-cyan-500 focus:border-cyan-500 placeholder-slate-400 text-center tracking-[0.5em] font-mono"
                />
            </div>
            {otpError && <p className="text-red-400 text-sm">{otpError}</p>}
            <button type="submit" className="w-full flex items-center justify-center text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600">
                {t('login.otp.verify')}
            </button>
             <button type="button" onClick={() => handleViewChange('phone')} className="w-full text-center text-slate-400 hover:text-white text-sm font-semibold py-2">
                {t('login.back')}
            </button>
        </form>
    );

    const renderContent = () => {
        switch(view) {
            case 'otp': return renderOtpForm();
            case 'phone': return renderPhoneForm();
            case 'email': return renderEmailForm();
            case 'options': default: return renderOptions();
        }
    }

    const getSubtitle = () => {
        switch(view) {
            case 'otp': return t('login.otp.title');
            case 'phone': return t('login.phone');
            case 'email': return t('login.email');
            case 'options': default: return t('login.subtitle');
        }
    }

    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-slate-800 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <LogoIcon className="w-16 h-16 text-cyan-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('login.title')}</h1>
                <p className="text-slate-400 mb-8">{getSubtitle()}</p>

                <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
