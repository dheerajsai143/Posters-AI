
import React, { useState } from 'react';
import { LogoIcon, PasswordIcon } from './IconComponents';

interface ApiKeySetupPageProps {
    onApiKeySubmit: (key: string) => void;
    error?: string | null;
}

export const ApiKeySetupPage: React.FC<ApiKeySetupPageProps> = ({ onApiKeySubmit, error }) => {
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (apiKey.trim()) {
            onApiKeySubmit(apiKey.trim());
        }
    };

    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-slate-800 max-w-lg w-full">
                <LogoIcon className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-4">Welcome to Posters AI</h1>
                <p className="text-slate-400 mb-6">
                    To get started, please enter your Google AI API key. Your key is stored securely in your browser and never sent anywhere else.
                </p>
                
                {error && <p className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-md p-3 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PasswordIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your Google AI API key"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-4 py-3 focus:ring-cyan-500 focus:border-cyan-500 placeholder-slate-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                        Save & Continue
                    </button>
                </form>

                <p className="text-xs text-slate-500 mt-4">
                    Don't have a key? Get one from{' '}
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                        Google AI Studio
                    </a>.
                </p>
            </div>
        </div>
    );
};
