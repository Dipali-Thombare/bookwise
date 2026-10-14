import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  BookOpen, 
  Compass, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Layers, 
  Star,
  Zap,
  Globe2,
  Target
} from "lucide-react";
import api from "../services/api";
import BookCard from "../components/BookCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { GENRES } from "../components/GenreFilter";

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        const res = await api.getBooks();
        if (res.data) {
          // Select 4 diverse high-rated books
          const topRated = res.data
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 4);
          setFeaturedBooks(topRated);
        }
      } catch (err) {
        console.error("Failed to load featured books", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold shadow-sm">
            <Cpu className="w-3.5 h-3.5" />
            <span>Dual Rule AI • Forward & Backward Chaining Engines</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-serif text-white leading-[1.1]">
            Discover Your Next <br />
            <span className="gradient-text">Favorite Book</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Find books that match your interests through intelligent, personalized recommendations.
            Powered by transparent IF–THEN rules, goal-driven verification, and zero black-box obscurity.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/questionnaire")}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm sm:text-base font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Forward Chaining (Find Books)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <Link
              to="/goal-verifier"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-md"
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>Backward Chaining (Verify a Goal)</span>
            </Link>

            <Link
              to="/search"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Knowledge Base</span>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Mini-Project Core Concepts Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-mono tracking-wider text-amber-400">
            System Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
            How BookWise AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Built following classical Artificial Intelligence expert system principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">1. Knowledge Base</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated repository of 58+ books across genres, languages, goals, and lengths stored in pure JavaScript objects.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">2. Rule Base</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Declarative domain heuristics combining user intent, reading goals, regional languages, and book complexity into explainable logic.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">3. Forward Chaining</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data-driven: starts with user facts, matches criteria step-by-step, fires rules, and derives ranked match scores up to 100%.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">4. Backward Chaining</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Goal-driven: starts with a target book hypothesis, decomposes into sub-goals, identifies missing evidence, and proves compatibility.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1.5">5. Explanation Module</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every single recommendation produces human-readable deduction trees, point breakdowns, and triggered rule citations.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <Star className="w-4 h-4 fill-amber-400" /> Curated Showcase
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mt-1">
              Featured Books
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top-rated selections from our multi-genre knowledge base.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View All Books</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading Featured Books..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} showRecommendationDetails={false} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Genres Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            Explore Popular Genres
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Click any genre to discover matching books instantly in our catalog.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {GENRES.filter((g) => g !== "All").map((genre) => (
            <button
              key={genre}
              onClick={() => navigate(`/search?genre=${encodeURIComponent(genre)}`)}
              className="p-4 rounded-2xl glass-panel glass-panel-hover text-center border border-slate-800 transition-all cursor-pointer group"
            >
              <span className="font-semibold text-xs sm:text-sm text-slate-200 group-hover:text-amber-400 transition-colors block">
                {genre}
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Explore &rarr;
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-950/20 to-slate-900">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white">
              Ready to find your ideal read?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Answer 5 quick preference questions about your genres, reading goal, language, level, and length to get ranked recommendations.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate("/questionnaire")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Start Questionnaire Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
