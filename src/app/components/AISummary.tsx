import { useState } from "react";
import { FileText, Loader2, Sparkles } from "lucide-react";

interface AISummaryProps {
  conversationId: string;
  existingSummary?: string | null;
  onSummaryGenerated?: (summary: string) => void;
}

export function AISummary({ conversationId, existingSummary, onSummaryGenerated }: AISummaryProps) {
  const [summary, setSummary] = useState(existingSummary || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!!existingSummary);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(
        `/make-server-b5f5c952/summarize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ conversationId }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setSummary(data.summary);
        setIsExpanded(true);
        onSummaryGenerated?.(data.summary);
      } else {
        console.error("Failed to generate summary:", data.error);
        alert(`Failed to generate summary: ${data.error}`);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Network error while generating summary.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isExpanded && !summary) {
    return (
      <button
        onClick={generateSummary}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-black/10 dark:disabled:bg-white/10 text-white rounded-lg transition-colors"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">Generating Summary...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Generate AI Summary</span>
          </>
        )}
      </button>
    );
  }

  return (
    <div className="bg-purple-500/10 dark:bg-purple-400/10 border-2 border-purple-500/20 dark:border-purple-400/20 rounded-xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-purple-600 dark:bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-1">Clinical Summary</h3>
          <p className="text-sm text-purple-700 dark:text-purple-300">AI-generated medical documentation</p>
        </div>
        <button
          onClick={generateSummary}
          disabled={isGenerating}
          className="px-3 py-1.5 bg-purple-600 dark:bg-purple-500 hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-black/10 dark:disabled:bg-white/10 text-white text-sm rounded-lg transition-colors"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Refresh"
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-black rounded-lg p-4 border border-purple-500/20 dark:border-purple-400/20">
        <div className="prose prose-sm max-w-none text-black dark:text-white whitespace-pre-wrap">
          {summary}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-500/20 dark:bg-purple-400/20 rounded-lg">
        <p className="text-xs text-purple-800 dark:text-purple-200">
          <strong>Disclaimer:</strong> This AI-generated summary is for reference only.
          Always verify medical information and documentation independently.
        </p>
      </div>
    </div>
  );
}