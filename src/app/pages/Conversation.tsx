import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Send, ArrowLeft, User, Stethoscope, Loader2 } from "lucide-react";
import { MessageBubble } from "../components/MessageBubble";
import { AudioRecorder } from "../components/AudioRecorder";
import { AISummary } from "../components/AISummary";

interface Message {
  id: string;
  conversationId: string;
  role: "doctor" | "patient";
  originalText: string;
  translatedText: string;
  audioUrl?: string | null;
  timestamp: number;
}

interface Conversation {
  id: string;
  createdAt: string;
  doctorLanguage: string;
  patientLanguage: string;
  summary: string | null;
  lastMessageAt: string;
}

export default function Conversation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRole, setCurrentRole] = useState<"doctor" | "patient">("doctor");
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevRole, setPrevRole] = useState<"doctor" | "patient">("doctor");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversation();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversation = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/make-server-b5f5c952/conversations/${id}`
      );

      const data = await response.json();
      if (data.success) {
        setConversation(data.conversation);
        setMessages(data.messages || []);
      } else {
        console.error("Failed to load conversation:", data.error);
        alert("Conversation not found");
        navigate("/");
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      alert("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (audioBlob?: string) => {
    if (!inputText.trim() && !audioBlob) return;
    if (!id) return;

    setIsSending(true);
    try {
      const response = await fetch(
        `/make-server-b5f5c952/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: id,
            role: currentRole,
            originalText: inputText.trim(),
            audioBlob,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.message]);
        setInputText("");
      } else {
        console.error("Failed to send message:", data.error);
        alert(`Failed to send message: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Network error while sending message");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleAudioRecording = (audioBlob: string) => {
    sendMessage(audioBlob);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-black">
        <p className="text-black/60 dark:text-white/60">Conversation not found</p>
      </div>
    );
  }

  const currentLanguage = currentRole === "doctor"
    ? conversation.doctorLanguage
    : conversation.patientLanguage;
  const otherLanguage = currentRole === "doctor"
    ? conversation.patientLanguage
    : conversation.doctorLanguage;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-7xl mx-auto bg-white dark:bg-black">
      {/* Conversation Header */}
      <div className="bg-white dark:bg-black border-b border-black/10 dark:border-white/10 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="text-sm text-black/60 dark:text-white/60">
            Doctor: {conversation.doctorLanguage} ↔ Patient: {conversation.patientLanguage}
          </div>
        </div>

        {/* Role Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (currentRole !== "doctor") {
                setIsTransitioning(true);
                setPrevRole(currentRole);
                setTimeout(() => {
                  setCurrentRole("doctor");
                  setTimeout(() => setIsTransitioning(false), 50);
                }, 150);
              }
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${currentRole === "doctor"
              ? "bg-blue-600 dark:bg-blue-500 text-white shadow-lg"
              : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10"
              }`}
          >
            <Stethoscope className="w-5 h-5" />
            <span>Doctor ({conversation.doctorLanguage})</span>
          </button>
          <button
            onClick={() => {
              if (currentRole !== "patient") {
                setIsTransitioning(true);
                setPrevRole(currentRole);
                setTimeout(() => {
                  setCurrentRole("patient");
                  setTimeout(() => setIsTransitioning(false), 50);
                }, 150);
              }
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${currentRole === "patient"
              ? "bg-green-600 dark:bg-green-500 text-white shadow-lg"
              : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10"
              }`}
          >
            <User className="w-5 h-5" />
            <span>Patient ({conversation.patientLanguage})</span>
          </button>
        </div>
      </div>

      {/* Messages Area with Perspective Shift Animation */}
      <div
        className="flex-1 overflow-y-auto bg-white dark:bg-black px-4 py-6"
        style={{ perspective: '1000px' }}
      >
        <div
          className="max-w-4xl mx-auto transition-all duration-300 ease-out"
          style={{
            transform: isTransitioning
              ? `translateX(${prevRole === 'doctor' ? '-30px' : '30px'}) rotateY(${prevRole === 'doctor' ? '8deg' : '-8deg'})`
              : 'translateX(0) rotateY(0)',
            opacity: isTransitioning ? 0.7 : 1,
            transformStyle: 'preserve-3d',
          }}
        >
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-black/60 dark:text-white/60 text-lg">No messages yet</p>
              <p className="text-black/40 dark:text-white/40 text-sm mt-2">
                Start the conversation by typing or recording a message
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} viewingRole={currentRole} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* AI Summary Section */}
      {messages.length > 0 && (
        <div className="bg-white dark:bg-black border-t border-black/10 dark:border-white/10 px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <AISummary
              conversationId={id!}
              existingSummary={conversation.summary}
              onSummaryGenerated={(summary) => {
                setConversation({ ...conversation, summary });
              }}
            />
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white dark:bg-black border-t border-black/10 dark:border-white/10 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Type message in ${currentLanguage}... (will be translated to ${otherLanguage})`}
                className="w-full px-4 py-3 pr-12 border border-black/20 dark:border-white/20 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-black text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40"
                rows={2}
                disabled={isSending}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim() || isSending}
                className="absolute right-2 bottom-2 p-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-black/10 dark:disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            <AudioRecorder onRecordingComplete={handleAudioRecording} disabled={isSending} />
          </div>

          <p className="text-xs text-black/50 dark:text-white/50 mt-2 text-center">
            Speaking as <strong>{currentRole === "doctor" ? "Doctor" : "Patient"}</strong> in{" "}
            <strong>{currentLanguage}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}