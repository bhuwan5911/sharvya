'use client';

import { useState, useRef, useEffect } from 'react';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  language: string;
}

export default function VoiceInput({ onTranscription, isRecording, setIsRecording, language }: VoiceInputProps) {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language; // Set language based on user preference

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onTranscription(finalTranscript);
          stopRecording();
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onTranscription, language]);

  const startRecording = async () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
        setIsRecording(true);
        setRecordingTime(0);
        
        intervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error starting voice recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
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
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all transform hover:scale-105 shadow-lg ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
        }`}
        title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
      >
        {isRecording ? (
          <i className="ri-stop-fill"></i>
        ) : (
          <i className="ri-mic-line"></i>
        )}
      </button>

      {isRecording && (
        <div className="mt-2 text-center">
          <div className="text-red-400 font-semibold text-sm">
            {formatTime(recordingTime)}
          </div>
          <div className="flex justify-center space-x-1 mt-1">
            <div className="w-1 h-1 bg-red-400 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
} 