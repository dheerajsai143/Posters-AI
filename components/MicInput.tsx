import React, { useState, useEffect } from 'react';

interface MicInputProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
}

const MicInput: React.FC<MicInputProps> = ({ onTranscript, isListening, setIsListening }) => {
  const [recognition, setRecognition] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setError("Mic error");
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      setError("Not supported");
    }
  }, [onTranscript, setIsListening]);

  const toggleListening = () => {
    if (error === "Not supported") {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognition?.stop();
    } else {
      setError(null);
      setIsListening(true);
      recognition?.start();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`
        p-3 rounded-xl flex items-center justify-center transition-all duration-300
        ${isListening 
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20' 
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
        }
      `}
      title={isListening ? "Listening..." : "Click to speak"}
    >
      <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
    </button>
  );
};

export default MicInput;
