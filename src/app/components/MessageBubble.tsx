import { User, Stethoscope, Volume2 } from "lucide-react";
import { format } from "date-fns";

interface MessageBubbleProps {
  message: {
    id: string;
    role: "doctor" | "patient";
    originalText: string;
    translatedText: string;
    audioUrl?: string | null;
    timestamp: number;
  };
  showTranslation?: boolean;
  viewingRole?: "doctor" | "patient";
}

export function MessageBubble({ message, showTranslation = true, viewingRole = "doctor" }: MessageBubbleProps) {
  const isDoctor = message.role === "doctor";
  // Messages from the current viewing role appear on the right (like "your" messages in a chat)
  const isFromViewer = message.role === viewingRole;

  return (
    <div className={`flex gap-3 ${isFromViewer ? "flex-row-reverse" : "flex-row"} mb-4`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${isDoctor
            ? "bg-blue-500/10 dark:bg-blue-400/10 border-blue-500/20 dark:border-blue-400/20"
            : "bg-green-500/10 dark:bg-green-400/10 border-green-500/20 dark:border-green-400/20"
          }`}
      >
        {isDoctor ? (
          <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        ) : (
          <User className="w-5 h-5 text-green-600 dark:text-green-400" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-xl ${isFromViewer ? "flex flex-col items-end" : ""}`}>
        {/* Role & Timestamp */}
        <div className={`flex items-center gap-2 mb-1 ${isFromViewer ? "flex-row-reverse" : ""}`}>
          <span className={`text-sm font-semibold ${isDoctor
              ? "text-blue-700 dark:text-blue-400"
              : "text-green-700 dark:text-green-400"
            }`}>
            {isDoctor ? "Doctor" : "Patient"}
          </span>
          <span className="text-xs text-black/50 dark:text-white/50">
            {format(new Date(message.timestamp), "h:mm a")}
          </span>
        </div>

        {/* Original Text */}
        <div
          className={`rounded-2xl px-4 py-3 border ${isDoctor
              ? "bg-blue-500/10 dark:bg-blue-400/10 text-blue-900 dark:text-blue-100 border-blue-500/20 dark:border-blue-400/20"
              : "bg-green-500/10 dark:bg-green-400/10 text-green-900 dark:text-green-100 border-green-500/20 dark:border-green-400/20"
            } ${isFromViewer ? "rounded-tr-none" : "rounded-tl-none"}`}
        >
          <p className="text-sm leading-relaxed">{message.originalText || "[Audio message]"}</p>
        </div>

        {/* Translation */}
        {showTranslation && message.translatedText && message.translatedText !== message.originalText && (
          <div
            className={`mt-2 rounded-2xl px-4 py-3 bg-black/5 dark:bg-white/5 text-black/80 dark:text-white/80 border border-black/10 dark:border-white/10 ${isFromViewer ? "rounded-tr-none" : "rounded-tl-none"
              }`}
          >
            <p className="text-xs text-black/50 dark:text-white/50 mb-1">Translation:</p>
            <p className="text-sm leading-relaxed">{message.translatedText}</p>
          </div>
        )}

        {/* Audio Player */}
        {message.audioUrl && (
          <div className="mt-2 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-black/50 dark:text-white/50" />
            <audio controls className="h-8 max-w-xs">
              <source src={message.audioUrl} type="audio/webm" />
              Your browser does not support audio playback.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}