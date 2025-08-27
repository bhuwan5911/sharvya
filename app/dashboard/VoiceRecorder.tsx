
'use client';

import { useState, useRef, useEffect } from 'react';

interface VoiceRecorderProps {
  onRecordingChange: (isRecording: boolean) => void;
}

export default function VoiceRecorder({ onRecordingChange }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const transcript = "Hello, I want to learn more about JavaScript functions and how to use them in real projects. Can you help me understand the basics?";

  useEffect(() => {
    onRecordingChange(isRecording);
  }, [isRecording, onRecordingChange]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setTimeout(() => setShowTranscript(true), 1000);
    }
  };

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
          >
            <i className="ri-mic-line text-2xl text-white"></i>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors animate-pulse cursor-pointer"
          >
            <i className="ri-stop-line text-2xl text-white"></i>
          </button>
        )}
        
        {isRecording && (
          <div className="text-white font-mono text-lg">
            {formatTime(recordingTime)}
          </div>
        )}
      </div>
      
      {audioBlob && !isRecording && (
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={playRecording}
            disabled={isPlaying}
            className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2 whitespace-nowrap cursor-pointer"
          >
            <i className={`${isPlaying ? 'ri-pause-line' : 'ri-play-line'}`}></i>
            <span>{isPlaying ? 'Playing...' : 'Play Recording'}</span>
          </button>
        </div>
      )}
      
      {showTranscript && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <i className="ri-file-text-line text-white"></i>
            <span className="text-white font-medium">Transcript (Auto-generated)</span>
          </div>
          <p className="text-white/90 text-sm italic">"{transcript}"</p>
          <div className="mt-3 flex space-x-2">
            <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors whitespace-nowrap cursor-pointer">
              Send to Mentor
            </button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer">
              Translate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
