import { AlertCircle, ExternalLink, X } from "lucide-react";
import { useState } from "react";

export function ApiKeyNotice() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-amber-500/10 dark:bg-amber-400/10 border-2 border-amber-500/30 dark:border-amber-400/30 rounded-lg shadow-lg p-4 z-50 backdrop-blur-sm">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 p-1 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 rounded-full transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">API Key Required</h3>
          <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
            This app requires an OpenAI API key to function. Translation and summary features won't work without it.
          </p>
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-900 dark:text-amber-100 hover:text-amber-700 dark:hover:text-amber-300 underline"
          >
            Get API Key
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}