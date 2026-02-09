import { useState, useEffect } from "react";
import { Mic, X, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";

interface MicrophonePermissionModalProps {
  onPermissionGranted?: () => void;
}

export function MicrophonePermissionModal({ onPermissionGranted }: MicrophonePermissionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('checking');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        const status = result.state as 'granted' | 'denied' | 'prompt';
        setPermissionStatus(status);
        
        // Show modal if permission is not granted
        if (status === 'prompt') {
          setIsOpen(true);
        } else if (status === 'granted') {
          onPermissionGranted?.();
        }
        
        // Listen for permission changes
        result.onchange = () => {
          const newStatus = result.state as 'granted' | 'denied' | 'prompt';
          setPermissionStatus(newStatus);
          if (newStatus === 'granted') {
            setIsOpen(false);
            onPermissionGranted?.();
          }
        };
      } else {
        // If Permissions API is not available, show modal to request permission
        setPermissionStatus('prompt');
        setIsOpen(true);
      }
    } catch (err) {
      console.log("Permissions API not fully supported");
      setPermissionStatus('prompt');
      setIsOpen(true);
    }
  };

  const requestPermission = async () => {
    setIsRequesting(true);
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      // Stop the stream immediately - we just needed to request permission
      stream.getTracks().forEach(track => track.stop());
      
      setPermissionStatus('granted');
      setIsOpen(false);
      onPermissionGranted?.();
    } catch (err: any) {
      console.error("Error requesting microphone permission:", err);
      setPermissionStatus('denied');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <Mic className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white">
                Microphone Access
              </h2>
              <p className="text-sm text-black/60 dark:text-white/60">Required for audio recording</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {permissionStatus === 'prompt' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-2">
                    Why we need microphone access:
                  </p>
                  <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                    <li>Record audio messages for doctor-patient communication</li>
                    <li>Store audio recordings for conversation history</li>
                    <li>Enable better context in medical consultations</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-sm text-black/70 dark:text-white/70">
              Click the button below to allow microphone access. Your browser will show a permission prompt.
            </p>

            <button
              onClick={requestPermission}
              disabled={isRequesting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 disabled:bg-black/10 dark:disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {isRequesting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Requesting Permission...</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>Allow Microphone Access</span>
                </>
              )}
            </button>

            <button
              onClick={handleSkip}
              className="w-full px-4 py-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
            >
              Skip for now (you can enable it later)
            </button>
          </div>
        )}

        {permissionStatus === 'granted' && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm text-green-900 dark:text-green-100 font-medium">
                    Microphone access granted!
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    You can now record audio messages in conversations.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/80 transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {permissionStatus === 'denied' && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-900 dark:text-red-100 font-medium mb-2">
                    Microphone access denied
                  </p>
                  <p className="text-xs text-red-800 dark:text-red-200 mb-3">
                    To enable audio recording, you need to allow microphone access in your browser settings.
                  </p>
                  <div className="space-y-2 text-xs text-red-700 dark:text-red-300">
                    <p className="font-semibold">How to enable microphone:</p>
                    <div className="space-y-1.5 ml-2">
                      <div>
                        <p className="font-semibold">Chrome/Edge:</p>
                        <ol className="list-decimal list-inside ml-2 space-y-0.5">
                          <li>Click the lock icon (🔒) in the address bar</li>
                          <li>Find "Microphone" in the permissions list</li>
                          <li>Select "Allow"</li>
                          <li>Refresh the page</li>
                        </ol>
                      </div>
                      <div>
                        <p className="font-semibold">Firefox:</p>
                        <ol className="list-decimal list-inside ml-2 space-y-0.5">
                          <li>Click the microphone icon (🎤) in the address bar</li>
                          <li>Click "Allow" or remove the block</li>
                          <li>Refresh the page</li>
                        </ol>
                      </div>
                      <div>
                        <p className="font-semibold">Safari:</p>
                        <ol className="list-decimal list-inside ml-2 space-y-0.5">
                          <li>Go to Safari → Settings</li>
                          <li>Click "Websites" → "Microphone"</li>
                          <li>Set this website to "Allow"</li>
                          <li>Refresh the page</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={requestPermission}
                className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-black/80 dark:hover:bg-white/80 transition-colors text-sm"
              >
                Try Again
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 border border-black/10 dark:border-white/10 text-black dark:text-white rounded-lg font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm"
              >
                Continue Without Audio
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
          <p className="text-xs text-black/40 dark:text-white/40 text-center">
            Your privacy is important. Audio is only recorded when you press the Record button.
          </p>
        </div>
      </div>
    </div>
  );
}
