import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Target, 
  Cpu, 
  Sparkles, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  Zap,
  SlidersHorizontal,
  Compass
} from "lucide-react";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import BackwardChainingVerifier from "../components/BackwardChainingVerifier";
import BookCard from "../components/BookCard";

export default function GoalVerifier() {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("verifier"); // "verifier" | "search"
  const [hypothesesResult, setHypothesesResult] = useState(null);
  const [hypothesesLoading, setHypothesesLoading] = useState(false);

  // User ground facts state
  const [userFacts, setUserFacts] = useState(() => {
    try {
      const cached = sessionStorage.getItem("bookwise_last_recommendation");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.preferences) return parsed.preferences;
      }
    } catch (e) {}
    return {
      genres: ["Fantasy"],
      language: "English",
      readingLevel: "Beginner",
      readingGoal: "Entertainment",
      bookLength: "Medium"
    };
  });

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const res = await api.getBooks();
        if (res.data && res.data.length > 0) {
          setBooks(res.data);
          // Default to first book or Harry Potter b-003 if available
          const hp = res.data.find((b) => b.id === "b-003");
          setSelectedBookId(hp ? hp.id : res.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch books knowledge base", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const handleRunBackwardSearch = async () => {
    try {
      setHypothesesLoading(true);
      const res = await api.getBackwardHypotheses(userFacts);
      if (res.success && res.data) {
        setHypothesesResult(res.data);
      }
    } catch (err) {
      console.error("Failed backward hypothesis search", err);
    } finally {
      setHypothesesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "search") {
      handleRunBackwardSearch();
    }
  }, [activeTab, userFacts]);

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBook = books.find((b) => b.id === selectedBookId);

  if (loading) {
    return <LoadingSpinner message="Initializing Backward Chaining Expert System..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold font-mono">
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>Goal-Driven Reasoning • Backward Chaining</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight">
          Verify Any Book as a Goal
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          While Forward Chaining matches preferences into books, <strong>Backward Chaining</strong> starts
          with a specific goal (e.g. <em>"Should I read this book?"</em>) and recursively backtracks to verify
          prerequisite sub-goals, find contradictions, or query missing evidence.
        </p>

        {/* Tab Toggle */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab("verifier")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "verifier"
                  ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Single Book Verifier</span>
            </button>

            <button
              onClick={() => setActiveTab("search")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "search"
                  ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Hypothesis Hunter (All 58 Books)</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "verifier" && (
        <div className="space-y-8">
          {/* Book Selector Bar */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 tracking-wider font-bold block">
                  Step 1: Formulate Target Goal
                </span>
                <h3 className="text-lg font-bold text-white">Select a Book to Test with Backward Chaining</h3>
              </div>

              {/* Quick Picks */}
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { id: "b-003", label: "Harry Potter" },
                  { id: "b-015", label: "Atomic Habits" },
                  { id: "b-028", label: "Grokking Algorithms" },
                  { id: "b-019", label: "Akleche Tare" },
                  { id: "b-034", label: "Dune" }
                ].map((quick) => (
                  <button
                    key={quick.id}
                    onClick={() => setSelectedBookId(quick.id)}
                    className={`px-3 py-1 rounded-xl text-xs transition-colors cursor-pointer ${
                      selectedBookId === quick.id
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    {quick.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Dropdown & Search Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8">
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                >
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} — {b.author} ({b.genre}, {b.language})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Interactive Verifier Component */}
          {selectedBook && (
            <BackwardChainingVerifier
              bookId={selectedBook.id}
              initialFacts={userFacts}
              onFactChange={(newFacts) => setUserFacts(newFacts)}
            />
          )}
        </div>
      )}

      {activeTab === "search" && (
        <div className="space-y-8">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono uppercase text-amber-400 tracking-wider font-bold block">
              Multi-Hypothesis Backward Resolution
            </span>
            <h3 className="text-xl font-bold text-white">
              Evaluating All 58 Candidate Books as Backward Goals
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              The engine tests every book in the knowledge base as a hypothetical goal against your active profile,
              identifying which books are already proven and which are just 1 missing question away from proof.
            </p>
          </div>

          {hypothesesLoading && (
            <div className="py-12 text-center text-slate-400 text-sm animate-pulse flex items-center justify-center gap-2">
              <Cpu className="w-5 h-5 animate-spin text-amber-400" />
              <span>Scanning knowledge base with backward chaining resolution...</span>
            </div>
          )}

          {hypothesesResult && !hypothesesLoading && (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-xs font-mono text-emerald-400 uppercase block mb-1">Fully Proven Goals</span>
                  <span className="text-2xl font-extrabold text-white">
                    {hypothesesResult.provenCount} <span className="text-xs font-normal text-emerald-300">books (≥80%)</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30">
                  <span className="text-xs font-mono text-amber-400 uppercase block mb-1">1 Step Away from Proof</span>
                  <span className="text-2xl font-extrabold text-white">
                    {hypothesesResult.oneStepAway.length} <span className="text-xs font-normal text-amber-300">books (+1 fact)</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs font-mono text-slate-400 uppercase block mb-1">Partially Proven</span>
                  <span className="text-2xl font-extrabold text-white">
                    {hypothesesResult.partiallyProvenCount} <span className="text-xs font-normal text-slate-400">books (50-79%)</span>
                  </span>
                </div>
              </div>

              {/* 1 Step Away Showcase */}
              {hypothesesResult.oneStepAway.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-xl font-bold font-serif text-white">
                      Hypotheses 1 Step Away from Being Proven
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    These candidate books only require confirming 1 additional preference to achieve a strong recommendation match:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hypothesesResult.oneStepAway.map((item) => (
                      <div
                        key={item.hypothesis.bookId}
                        className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between gap-4"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.hypothesis.coverImage}
                            alt={item.hypothesis.title}
                            className="w-16 h-22 object-cover rounded-xl shrink-0 border border-slate-800"
                          />
                          <div>
                            <span className="text-[10px] font-mono text-amber-400 uppercase block">
                              {item.hypothesis.genre} • {item.hypothesis.language}
                            </span>
                            <h4 className="text-sm font-bold text-white">{item.hypothesis.title}</h4>
                            <p className="text-xs text-slate-400">by {item.hypothesis.author}</p>
                            <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              Current Proof: {item.confidenceScore}%
                            </span>
                          </div>
                        </div>

                        {item.missingEvidence[0] && (
                          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
                            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                              Missing Ground Fact to Prove Goal:
                            </span>
                            <p className="text-slate-300 font-medium">{item.missingEvidence[0].prompt}</p>
                            <span className="text-[10px] text-emerald-400 font-mono block">
                              Satisfying this will add +{item.missingEvidence[0].weight} points!
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1">
                          <Link
                            to={`/books/${item.hypothesis.bookId}`}
                            className="text-xs text-slate-400 hover:text-white transition-colors"
                          >
                            View Book Details →
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedBookId(item.hypothesis.bookId);
                              setActiveTab("verifier");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
                          >
                            Verify in Full Tree
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fully Proven Books */}
              {hypothesesResult.proven.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-xl font-bold font-serif text-white">
                      Fully Proven Book Hypotheses (Score ≥ 80%)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {hypothesesResult.proven.map((item) => (
                      <div
                        key={item.hypothesis.bookId}
                        className="p-4 rounded-2xl glass-panel border border-emerald-500/30 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <img
                            src={item.hypothesis.coverImage}
                            alt={item.hypothesis.title}
                            className="w-full h-36 object-cover rounded-xl mb-2"
                          />
                          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                            PROVEN • {item.confidenceScore}%
                          </span>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{item.hypothesis.title}</h4>
                          <p className="text-[11px] text-slate-400">{item.hypothesis.author}</p>
                        </div>

                        <Link
                          to={`/books/${item.hypothesis.bookId}`}
                          className="w-full py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center transition-colors"
                        >
                          Inspect Proof Details
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
