
import React, { useState, useEffect, useRef } from 'react';
import { MicIcon } from './IconComponents';
import { useTranslation } from '../hooks/useTranslation';

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
}

// FIX: Added type definitions and modifications to support the non-standard Web Speech API
// and resolve TypeScript errors. This defines the shape of the speech recognition object
// for type safety and to avoid name collisions with the `SpeechRecognition` variable.
type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  start: () => void;
  stop: () => void;
};

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechRecognitionSupported = !!SpeechRecognition;

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ onTranscript }) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      return;
    }

    const recognition: SpeechRecognitionInstance = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
    }

    recognitionRef.current = recognition;
    
    return () => {
        recognition.stop();
    }
  }, [onTranscript]);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  if (!isSpeechRecognitionSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleToggleListening}
      className={`absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full transition-colors duration-200 ${
        isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-cyan-500 text-white hover:bg-cyan-600'
      }`}
      title={t('voiceInput.title')}
    >
      <MicIcon className="w-5 h-5" />
    </button>
  );
};