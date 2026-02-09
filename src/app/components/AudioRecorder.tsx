import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: string) => void;
  disabled?: boolean;
}

export function AudioRecorder({ onRecordingComplete, disabled }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      // Check if navigator.permissions is available
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
        
        // Listen for permission changes
        result.onchange = () => {
          setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
          setError(null);
        };
      } else {
        // If Permissions API is not available, set to prompt
        setPermissionStatus('prompt');
      }
    } catch (err) {
      console.log("Permissions API not fully supported, will request on first use");
      setPermissionStatus('prompt');
    }
  };

  const startRecording = async () => {
    setError(null);
    
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      setPermissionStatus('granted');
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        
        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          onRecordingComplete(base64);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        
        // Reset timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Error accessing microphone:", err);
      setPermissionStatus('denied');
      
      // Provide specific error messages
      if (err.name === 'NotAllowedError') {
        setError("Microphone access denied. Please allow microphone permissions in your browser settings.");
      } else if (err.name === 'NotFoundError') {
        setError("No microphone found. Please connect a microphone and try again.");
      } else if (err.name === 'NotReadableError') {
        setError("Microphone is already in use by another application.");
      } else if (err.name === 'OverconstrainedError') {
        setError("Microphone doesn't meet the required constraints.");
      } else if (err.name === 'SecurityError') {
        setError("Microphone access blocked due to security restrictions. Ensure you're using HTTPS.");
      } else {
        setError(`Microphone error: ${err.message || 'Unknown error occurred'}`);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 disabled:bg-black/10 dark:disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            title="Record audio message"
          >
            <Mic className="w-4 h-4" />
            <span className="text-sm font-medium">Record</span>
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white hover:bg-black/80 dark:hover:bg-white/80 text-white dark:text-black rounded-lg transition-colors animate-pulse"
            >
              <Square className="w-4 h-4" />
              <span className="text-sm font-medium">Stop</span>
            </button>
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <div className="w-3 h-3 bg-red-600 dark:bg-red-400 rounded-full animate-pulse" />
              <span className="text-sm font-mono font-medium">{formatTime(recordingTime)}</span>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            {permissionStatus === 'denied' && (
              <div className="mt-2 text-xs text-red-500 dark:text-red-300 space-y-1">
                <p className="font-semibold">How to enable microphone access:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li><strong>Chrome/Edge:</strong> Click the lock icon in the address bar → Site settings → Allow Microphone</li>
                  <li><strong>Firefox:</strong> Click the microphone icon in the address bar → Allow microphone access</li>
                  <li><strong>Safari:</strong> Safari → Settings → Websites → Microphone → Allow for this website</li>
                </ul>
                <p className="mt-2">After enabling, refresh the page or click the Record button again.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {permissionStatus === 'prompt' && !error && (
        <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Click Record to enable microphone access for audio messages.
          </p>
        </div>
      )}
    </div>
  );
}