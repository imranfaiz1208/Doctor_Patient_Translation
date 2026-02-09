import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, MessageSquare, Calendar, Loader2, FileText } from "lucide-react";
import { format } from "date-fns";

interface Conversation {
  id: string;
  createdAt: string;
  doctorLanguage: string;
  patientLanguage: string;
  summary: string | null;
  lastMessageAt: string;
}

interface SearchResult {
  conversation: Conversation;
  matches: Array<{
    id: string;
    role: string;
    originalText: string;
    translatedText: string;
    highlightedOriginal: string;
    highlightedTranslated: string;
    timestamp: number;
  }>;
}

export default function ConversationHistory() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/make-server-b5f5c952/conversations`
      );

      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations || []);
      } else {
        console.error("Failed to load conversations:", data.error);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `/make-server-b5f5c952/search?q=${encodeURIComponent(searchQuery)}`
      );

      const data = await response.json();
      if (data.success) {
        setSearchResults(data.results || []);
      } else {
        console.error("Search failed:", data.error);
      }
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const displayList = searchQuery.trim() ? searchResults.map((r) => r.conversation) : conversations;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white dark:bg-black">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">Conversation History</h2>
        <p className="text-black/60 dark:text-white/60">
          Search and review past doctor-patient conversations
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40 dark:text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations by keywords..."
            className="w-full pl-12 pr-4 py-4 border border-black/20 dark:border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-black text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 text-lg"
          />
          {isSearching && (
            <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery.trim() && (
        <div className="mb-4 p-4 bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 dark:border-blue-400/20 rounded-lg">
          <p className="text-blue-800 dark:text-blue-300">
            {searchResults.length === 0 ? (
              "No conversations found matching your search"
            ) : (
              <>
                Found <strong>{searchResults.length}</strong> conversation
                {searchResults.length !== 1 ? "s" : ""} with matches
              </>
            )}
          </p>
        </div>
      )}

      {/* Conversations List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl">
          <MessageSquare className="w-16 h-16 text-black/40 dark:text-white/40 mx-auto mb-4" />
          <p className="text-black/60 dark:text-white/60 text-lg">
            {searchQuery.trim() ? "No matching conversations found" : "No conversations yet"}
          </p>
          <p className="text-black/40 dark:text-white/40 text-sm mt-2">
            {!searchQuery.trim() && "Start a new conversation to see it here"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayList.map((conversation) => {
            const searchResult = searchResults.find((r) => r.conversation.id === conversation.id);

            return (
              <Link
                key={conversation.id}
                to={`/conversation/${conversation.id}`}
                className="block bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl hover:border-blue-500/50 dark:hover:border-blue-400/50 hover:shadow-lg transition-all p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 dark:bg-blue-400/10 w-12 h-12 rounded-lg flex items-center justify-center border border-blue-500/20 dark:border-blue-400/20">
                      <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black dark:text-white text-lg">
                        {conversation.doctorLanguage} ↔ {conversation.patientLanguage}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(conversation.createdAt), "MMM dd, yyyy 'at' h:mm a")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Matches */}
                {searchResult && searchResult.matches.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-black/70 dark:text-white/70">
                      {searchResult.matches.length} match{searchResult.matches.length !== 1 ? "es" : ""} found:
                    </p>
                    {searchResult.matches.slice(0, 3).map((match) => (
                      <div key={match.id} className="bg-yellow-500/10 dark:bg-yellow-400/10 border border-yellow-500/20 dark:border-yellow-400/20 rounded-lg p-3">
                        <p className="text-xs text-black/60 dark:text-white/60 mb-1">
                          <strong className="text-black/80 dark:text-white/80">
                            {match.role === "doctor" ? "Doctor" : "Patient"}:
                          </strong>
                        </p>
                        <p className="text-sm text-black/80 dark:text-white/80">
                          {match.originalText}
                        </p>
                      </div>
                    ))}
                    {searchResult.matches.length > 3 && (
                      <p className="text-xs text-black/50 dark:text-white/50 italic">
                        + {searchResult.matches.length - 3} more match
                        {searchResult.matches.length - 3 !== 1 ? "es" : ""}
                      </p>
                    )}
                  </div>
                )}

                {/* Summary Preview */}
                {conversation.summary && !searchQuery.trim() && (
                  <div className="mt-4 p-3 bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/20 dark:border-purple-400/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-medium text-purple-700 dark:text-purple-300">AI Summary Available</span>
                    </div>
                    <p className="text-sm text-black/70 dark:text-white/70 line-clamp-2">{conversation.summary}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}