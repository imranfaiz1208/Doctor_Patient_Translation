import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Globe, MessageSquare, Mic, FileText } from "lucide-react";
import { ApiKeyNotice } from "../components/ApiKeyNotice";

const LANGUAGES = [
  { code: "English", label: "English" },
  { code: "Spanish", label: "Spanish (Español)" },
  { code: "French", label: "French (Français)" },
  { code: "German", label: "German (Deutsch)" },
  { code: "Chinese", label: "Chinese (中文)" },
  { code: "Arabic", label: "Arabic (العربية)" },
  { code: "Hindi", label: "Hindi (हिन्दी)" },
  { code: "Telugu", label: "Telugu (తెలుగు)" },
  { code: "Tamil", label: "Tamil (தமிழ்)" },
  { code: "Kannada", label: "Kannada (ಕನ್ನಡ)" },
  { code: "Marathi", label: "Marathi (मराठी)" },
  { code: "Portuguese", label: "Portuguese (Português)" },
  { code: "Russian", label: "Russian (Русский)" },
  { code: "Japanese", label: "Japanese (日本語)" },
];

export default function Home() {
  const navigate = useNavigate();
  const [doctorLanguage, setDoctorLanguage] = useState("English");
  const [patientLanguage, setPatientLanguage] = useState("Spanish");
  const [loading, setLoading] = useState(false);

  const handleStartConversation = async () => {
    if (doctorLanguage === patientLanguage) {
      alert("Please select different languages for doctor and patient");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/make-server-b5f5c952/conversations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ doctorLanguage, patientLanguage }),
        }
      );

      const data = await response.json();
      if (data.success) {
        navigate(`/conversation/${data.conversation.id}`);
      } else {
        console.error("Failed to create conversation:", data.error);
        alert("Failed to create conversation. Please try again.");
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-white dark:bg-black">
      <ApiKeyNotice />

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
          Real-Time Medical Translation
        </h2>
        <p className="text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto">
          Break language barriers in healthcare. Connect doctors and patients
          through AI-powered real-time translation.
        </p>
      </div>

      <div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="w-6 h-6 text-black dark:text-white" />
          <h3 className="text-2xl font-semibold text-black dark:text-white">
            Select Languages
          </h3>
        </div>

        <div className="space-y-6">
          {/* Doctor Language */}
          <div>
            <label className="block text-sm font-medium text-black/80 dark:text-white/80 mb-2">
              Doctor's Language
            </label>
            <select
              value={doctorLanguage}
              onChange={(e) => setDoctorLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-black/20 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-black text-black dark:text-white"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Patient Language */}
          <div>
            <label className="block text-sm font-medium text-black/80 dark:text-white/80 mb-2">
              Patient's Language
            </label>
            <select
              value={patientLanguage}
              onChange={(e) => setPatientLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-black/20 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-black text-black dark:text-white"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleStartConversation}
            disabled={loading}
            className="w-full bg-black dark:bg-white hover:bg-black/80 dark:hover:bg-white/80 disabled:bg-black/20 dark:disabled:bg-white/20 text-white dark:text-black font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {loading ? "Creating..." : "Start New Conversation"}
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-blue-500/10 dark:bg-blue-400/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20 dark:border-blue-400/20">
            <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-semibold text-black dark:text-white mb-2">Real-Time Translation</h4>
          <p className="text-sm text-black/60 dark:text-white/60">
            Instant bidirectional translation between doctor and patient
          </p>
        </div>

        <div className="text-center">
          <div className="bg-green-500/10 dark:bg-green-400/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20 dark:border-green-400/20">
            <Mic className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="font-semibold text-black dark:text-white mb-2">Audio Recording</h4>
          <p className="text-sm text-black/60 dark:text-white/60">
            Record and playback audio for better context and documentation
          </p>
        </div>

        <div className="text-center">
          <div className="bg-purple-500/10 dark:bg-purple-400/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20 dark:border-purple-400/20">
            <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="font-semibold text-black dark:text-white mb-2">AI Summaries</h4>
          <p className="text-sm text-black/60 dark:text-white/60">
            Generate clinical summaries with key medical information
          </p>
        </div>
      </div>
    </div>
  );
}