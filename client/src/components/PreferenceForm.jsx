import React, { useState } from "react";
import { 
  Sparkles, 
  Check, 
  BookMarked, 
  Languages, 
  GraduationCap, 
  Target, 
  BookOpen, 
  Flame, 
  RotateCcw,
  Compass
} from "lucide-react";

const GENRES = [
  { name: "Fiction", icon: "📖", desc: "Compelling narratives & literary classics" },
  { name: "Mystery", icon: "🔍", desc: "Whodunits, detectives & enigmatic puzzles" },
  { name: "Thriller", icon: "⚡", desc: "High stakes, psychological suspense & twists" },
  { name: "Fantasy", icon: "🐉", desc: "Mythic worlds, magic & legendary epics" },
  { name: "Science Fiction", icon: "🚀", desc: "Futuristic technology, space & dystopias" },
  { name: "Romance", icon: "❤️", desc: "Heartfelt love stories, emotional bonds & passions" },
  { name: "Self-Help", icon: "🌱", desc: "Habits, mindset & self-improvement strategies" },
  { name: "Biography", icon: "👤", desc: "True life journeys of leaders & visionaries" },
  { name: "History", icon: "🏛️", desc: "Ancient civilizations, wars & cultural heritage" },
  { name: "Technology", icon: "💻", desc: "Software, algorithms, AI & computer engineering" },
  { name: "Business", icon: "📈", desc: "Startups, strategy, finance & corporate management" },
  { name: "Adventure", icon: "🗺️", desc: "High seas quests, survival & daring expeditions" }
];

const LANGUAGES = [
  { code: "English", label: "English", native: "English", desc: "Global bestsellers & international works" },
  { code: "Hindi", label: "Hindi", native: "हिन्दी", desc: "Classic Hindi Sahitya & modern narratives" },
  { code: "Marathi", label: "Marathi", native: "मराठी", desc: "Authentic Marathi Kadambari & biographies" }
];

const READING_LEVELS = [
  { level: "Beginner", label: "Beginner", desc: "Accessible language, smooth pacing, introductory themes" },
  { level: "Intermediate", label: "Intermediate", desc: "Balanced depth, richer vocabulary, layered plots" },
  { level: "Advanced", label: "Advanced", desc: "Dense prose, deep philosophical themes, complex structure" }
];

const READING_GOALS = [
  { goal: "Entertainment", icon: "🍿", desc: "Pure enjoyment, relaxation, and escapism" },
  { goal: "Personal Development", icon: "🌱", desc: "Emotional wellness, habits, and self-mastery" },
  { goal: "Academic Learning", icon: "🎓", desc: "Deep theoretical understanding and study" },
  { goal: "Career Growth", icon: "🚀", desc: "Professional skills, management, and tech prowess" },
  { goal: "General Knowledge", icon: "🌍", desc: "Broadening perspective, history, and worldly insight" }
];

const BOOK_LENGTHS = [
  { length: "Short", range: "< 200 pages", desc: "Quick weekend reads and brisk essays" },
  { length: "Medium", range: "200 - 450 pages", desc: "Standard full-length novels and books" },
  { length: "Long", range: "> 450 pages", desc: "Expansive sagas and comprehensive deep dives" }
];

// Presets for 1-click testing of key prompt scenarios
const PRESETS = [
  {
    title: "Fantasy Entertainment",
    genres: ["Fantasy"],
    language: "English",
    readingLevel: "Beginner",
    readingGoal: "Entertainment",
    bookLength: "Medium"
  },
  {
    title: "Self-Help Growth",
    genres: ["Self-Help"],
    language: "English",
    readingLevel: "Intermediate",
    readingGoal: "Personal Development",
    bookLength: "Medium"
  },
  {
    title: "Tech Learning",
    genres: ["Technology"],
    language: "English",
    readingLevel: "Beginner",
    readingGoal: "Academic Learning",
    bookLength: "Short"
  },
  {
    title: "Marathi Mystery",
    genres: ["Mystery"],
    language: "Marathi",
    readingLevel: "Intermediate",
    readingGoal: "Entertainment",
    bookLength: "Short"
  }
];

export default function PreferenceForm({ initialValues, onSubmit, isLoading }) {
  const [genres, setGenres] = useState(initialValues?.genres || ["Fantasy"]);
  const [language, setLanguage] = useState(initialValues?.language || "English");
  const [readingLevel, setReadingLevel] = useState(initialValues?.readingLevel || "Beginner");
  const [readingGoal, setReadingGoal] = useState(initialValues?.readingGoal || "Entertainment");
  const [bookLength, setBookLength] = useState(initialValues?.bookLength || "Medium");
  const [error, setError] = useState("");

  const toggleGenre = (genreName) => {
    setError("");
    if (genres.includes(genreName)) {
      if (genres.length === 1) {
        setError("Please keep at least one preferred genre selected.");
        return;
      }
      setGenres(genres.filter((g) => g !== genreName));
    } else {
      setGenres([...genres, genreName]);
    }
  };

  const applyPreset = (preset) => {
    setGenres(preset.genres);
    setLanguage(preset.language);
    setReadingLevel(preset.readingLevel);
    setReadingGoal(preset.readingGoal);
    setBookLength(preset.bookLength);
    setError("");
  };

  const handleReset = () => {
    setGenres(["Fiction"]);
    setLanguage("English");
    setReadingLevel("Beginner");
    setReadingGoal("Entertainment");
    setBookLength("Medium");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (genres.length === 0) {
      setError("Please select at least one preferred genre.");
      return;
    }
    onSubmit({
      genres,
      language,
      readingLevel,
      readingGoal,
      bookLength
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Quick Presets Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" /> Quick Recommendation Profiles
          </span>
          <span className="text-[11px] text-slate-400">Click any profile to pre-fill test criteria</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3 py-2 text-left rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <span className="font-semibold block text-amber-300">{preset.title}</span>
              <span className="text-[10px] text-slate-400 font-mono">{preset.language} • {preset.readingLevel}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      {/* 1. Preferred Genres (Multi-select) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-white flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-amber-400" />
            <span>1. Preferred Genres</span>
            <span className="text-xs font-normal text-slate-400">(Select one or multiple)</span>
          </label>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {genres.length} Selected (40 pts)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {GENRES.map((g) => {
            const isSelected = genres.includes(g.name);
            return (
              <button
                key={g.name}
                type="button"
                onClick={() => toggleGenre(g.name)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between h-24 ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10 ring-1 ring-amber-500/40"
                    : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{g.icon}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div>
                  <span className={`font-semibold text-xs block ${isSelected ? "text-amber-300" : "text-slate-200"}`}>
                    {g.name}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{g.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Preferred Language */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-white flex items-center gap-2">
            <Languages className="w-5 h-5 text-sky-400" />
            <span>2. Preferred Language</span>
          </label>
          <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
            15 pts
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LANGUAGES.map((lang) => {
            const isSelected = language.toLowerCase() === lang.code.toLowerCase();
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-sky-500/15 border-sky-500 text-white shadow-md shadow-sky-500/10 ring-1 ring-sky-500/40"
                    : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white">{lang.label}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {lang.native}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">{lang.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Reading Goal */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span>3. Reading Goal</span>
          </label>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            25 pts
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {READING_GOALS.map((rg) => {
            const isSelected = readingGoal.toLowerCase() === rg.goal.toLowerCase();
            return (
              <button
                key={rg.goal}
                type="button"
                onClick={() => setReadingGoal(rg.goal)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40"
                    : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{rg.icon}</span>
                  <span className="font-semibold text-xs text-white">{rg.goal}</span>
                </div>
                <p className="text-[11px] text-slate-400">{rg.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Reading Level & 5. Book Length (Side-by-side on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>4. Reading Level</span>
            </label>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              10 pts
            </span>
          </div>
          <div className="space-y-2">
            {READING_LEVELS.map((rl) => {
              const isSelected = readingLevel.toLowerCase() === rl.level.toLowerCase();
              return (
                <button
                  key={rl.level}
                  type="button"
                  onClick={() => setReadingLevel(rl.level)}
                  className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-purple-500/15 border-purple-500 text-white shadow-sm ring-1 ring-purple-500/40"
                      : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <span className="font-semibold text-xs text-white block">{rl.label}</span>
                    <span className="text-[11px] text-slate-400">{rl.desc}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Book Length */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>5. Preferred Book Length</span>
            </label>
            <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              10 pts
            </span>
          </div>
          <div className="space-y-2">
            {BOOK_LENGTHS.map((bl) => {
              const isSelected = bookLength.toLowerCase() === bl.length.toLowerCase();
              return (
                <button
                  key={bl.length}
                  type="button"
                  onClick={() => setBookLength(bl.length)}
                  className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-rose-500/15 border-rose-500 text-white shadow-sm ring-1 ring-rose-500/40"
                      : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white">{bl.length}</span>
                      <span className="text-[10px] font-mono text-slate-400">({bl.range})</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{bl.desc}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Form</span>
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 fill-slate-950" />
          <span>{isLoading ? "Executing Inference Engine..." : "Generate Rule-Based Recommendations"}</span>
        </button>
      </div>
    </form>
  );
}
