import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  Sparkles, 
  RotateCcw, 
  SlidersHorizontal, 
  Search, 
  ArrowUpDown, 
  AlertCircle, 
  CheckCircle2, 
  Globe, 
  BookMarked,
  Layers,
  ChevronRight
} from "lucide-react";
import BookGrid from "../components/BookGrid";
import EmptyState from "../components/EmptyState";
import SearchBar from "../components/SearchBar";

export default function Recommendations() {
  const location = useLocation();
  const navigate = useNavigate();

  // Load from location.state or fallback to sessionStorage
  const [data, setData] = useState(() => {
    if (location.state?.result) {
      return location.state.result;
    }
    try {
      const cached = sessionStorage.getItem("bookwise_last_recommendation");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  // Filters within recommendation results
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [sortBy, setSortBy] = useState("score_desc"); // score_desc | rating_desc | title_asc

  // If no recommendation data exists, redirect or display prompt to take questionnaire
  if (!data || !data.recommendations || data.recommendations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="No Recommendations Generated Yet"
          message="Please complete the reading preference questionnaire so our rule engine can calculate your personalized book matches."
          actionText="Take Questionnaire"
          actionHref="/questionnaire"
        />
      </div>
    );
  }

  const { preferences, recommendations, isClosestMatch, totalRecommendations } = data;

  // Filter and sort recommendations
  const filteredRecommendations = useMemo(() => {
    let list = [...recommendations];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    // Filter by genre
    if (selectedGenre !== "All") {
      list = list.filter((b) => b.genre.toLowerCase() === selectedGenre.toLowerCase());
    }

    // Filter by language
    if (selectedLanguage !== "All") {
      list = list.filter((b) => b.language.toLowerCase() === selectedLanguage.toLowerCase());
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "score_desc") return b.score - a.score || (b.rating || 0) - (a.rating || 0);
      if (sortBy === "rating_desc") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "title_asc") return a.title.localeCompare(b.title);
      return 0;
    });

    return list;
  }, [recommendations, searchQuery, selectedGenre, selectedLanguage, sortBy]);

  // Distinct genres and languages available in this result set
  const availableGenres = useMemo(() => {
    const set = new Set(recommendations.map((b) => b.genre));
    return ["All", ...Array.from(set)];
  }, [recommendations]);

  const availableLanguages = useMemo(() => {
    const set = new Set(recommendations.map((b) => b.language));
    return ["All", ...Array.from(set)];
  }, [recommendations]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner: Applied Preferences Summary */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
              <Sparkles className="w-4 h-4 fill-amber-400" /> Recommendation Results
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white mt-1">
              Your Personalized Book Matches
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ranked from highest to lowest match percentage based on Forward Chaining inference.
            </p>
          </div>

          <button
            onClick={() => navigate("/questionnaire")}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 hover:border-amber-500/40 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Modify Preferences</span>
          </button>
        </div>

        {/* Selected Criteria Chips */}
        {preferences && (
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px] uppercase">Evaluated Facts:</span>
            {preferences.genres && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">
                Genres: {Array.isArray(preferences.genres) ? preferences.genres.join(", ") : preferences.genres}
              </span>
            )}
            {preferences.language && (
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 font-medium">
                Lang: {preferences.language}
              </span>
            )}
            {preferences.readingGoal && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-medium">
                Goal: {preferences.readingGoal}
              </span>
            )}
            {preferences.readingLevel && (
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-medium">
                Level: {preferences.readingLevel}
              </span>
            )}
            {preferences.bookLength && (
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 font-medium">
                Length: {preferences.bookLength}
              </span>
            )}
          </div>
        )}

        {/* Closest Match Notice if no exact matches existed */}
        {isClosestMatch && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Showing Closest Matches</span>
              <span>
                No single book scored above the strong threshold for this exact combination.
                Showing the closest matching candidates. You can try selecting an additional genre or broader reading goal.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search within results */}
        <div className="w-full md:w-72">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search within results..."
          />
        </div>

        {/* Filters and Sort */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-3 justify-end text-xs">
          {/* Genre Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 font-mono">Genre:</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
            >
              {availableGenres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 font-mono">Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
            >
              {availableLanguages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-400 font-mono">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
            >
              <option value="score_desc">Highest Match %</option>
              <option value="rating_desc">Highest Rating</option>
              <option value="title_asc">Title (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredRecommendations.length}</strong> of{" "}
          <strong className="text-white">{totalRecommendations}</strong> ranked recommendations
        </span>
        {filteredRecommendations.length > 0 && (
          <span className="font-mono text-amber-400">
            Top Match: {filteredRecommendations[0].score}% ({filteredRecommendations[0].title})
          </span>
        )}
      </div>

      {/* Book Grid */}
      <BookGrid
        books={filteredRecommendations}
        showRecommendationDetails={true}
        emptyMessage="No recommended books match the current search or filters."
        onReset={() => {
          setSearchQuery("");
          setSelectedGenre("All");
          setSelectedLanguage("All");
        }}
      />
    </div>
  );
}
