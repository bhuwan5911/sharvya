'use client';

import { useState, useRef, useEffect } from 'react';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

export default function VoiceInput({ onTranscription, isRecording, setIsRecording }: VoiceInputProps) {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for speech recognition support
    const checkSupport = () => {
      if (typeof window !== 'undefined') {
        if ('webkitSpeechRecognition' in window) {
          return window.webkitSpeechRecognition;
        } else if ('SpeechRecognition' in window) {
          return window.SpeechRecognition;
        }
      }
      return null;
    };

    const SpeechRecognition = checkSupport();
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      // Set up event handlers
      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setIsRecording(true);
        setError(null);
        setRecordingTime(0);
        
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      };

      recognitionRef.current.onresult = (event: any) => {
        console.log('Speech recognition result:', event);
        const transcript = event.results[0][0].transcript;
        console.log('Transcript:', transcript);
        
        if (transcript) {
          onTranscription(transcript);
          stopRecording();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = 'Voice recognition error. Please try again.';
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
            break;
          case 'no-speech':
            errorMessage = 'No speech detected. Please speak clearly and try again.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture error. Please check your microphone.';
            break;
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not allowed. Please try again.';
            break;
        }
        
        setError(errorMessage);
        stopRecording();
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        setIsRecording(false);
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };

      recognitionRef.current.onaudiostart = () => {
        console.log('Audio capturing started');
      };

      recognitionRef.current.onaudioend = () => {
        console.log('Audio capturing ended');
      };

      recognitionRef.current.onsoundstart = () => {
        console.log('Sound detected');
      };

      recognitionRef.current.onsoundend = () => {
        console.log('Sound ended');
      };

      recognitionRef.current.onspeechstart = () => {
        console.log('Speech started');
      };

      recognitionRef.current.onspeechend = () => {
        console.log('Speech ended');
      };
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use text input instead.');
    }
  }, [onTranscription]);

  const startRecording = async () => {
    try {
      if (!recognitionRef.current) {
        setError('Voice recognition not available. Please use text input instead.');
        return;
      }

      // Clear any previous errors
      setError(null);

      // Request microphone permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
        console.log('Microphone permission granted');
      } catch (permissionError) {
        console.error('Microphone permission error:', permissionError);
        if (permissionError instanceof Error && permissionError.name === 'NotAllowedError') {
          setError('Microphone access denied. Please allow microphone access in your browser settings and try again.');
        } else {
          setError('Error accessing microphone. Please check your microphone permissions.');
        }
        return;
      }

      // Start speech recognition
      recognitionRef.current.start();
      console.log('Starting speech recognition...');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Error starting voice recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        console.log('Stopping speech recognition...');
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsListening(false);
    setIsRecording(false);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <div className="mb-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!isSupported}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold transition-all transform hover:scale-105 shadow-lg ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : isSupported
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isRecording ? (
            <i className="ri-stop-fill"></i>
          ) : (
            <i className="ri-mic-line"></i>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {isRecording && (
        <div className="text-center">
          <div className="text-red-400 font-semibold mb-2">
            Recording... {formatTime(recordingTime)}
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">Speak clearly into your microphone</p>
        </div>
      )}

      {!isRecording && (
        <div className="text-center">
          {isSupported ? (
            <>
              <p className="text-gray-300 mb-2">Click the microphone to start recording</p>
              <p className="text-sm text-gray-400">Make sure your microphone is enabled</p>
            </>
          ) : (
            <>
              <p className="text-red-400 mb-2">Voice recognition not supported in this browser</p>
              <p className="text-sm text-gray-400">Please use text input instead</p>
            </>
          )}
        </div>
      )}
    </div>
  );
} 