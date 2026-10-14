import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  Bookmark, 
  Check, 
  Clock, 
  Star, 
  Calendar, 
  Globe, 
  Layers, 
  Target, 
  Sparkles, 
  BookOpen,
  Share2
} from "lucide-react";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import RecommendationScore from "../components/RecommendationScore";
import RecommendationExplanation from "../components/RecommendationExplanation";
import BackwardChainingVerifier from "../components/BackwardChainingVerifier";
import BookCard from "../components/BookCard";
import { useSavedBooks } from "../context/SavedBooksContext";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { 
    isFavorite, 
    toggleFavorite, 
    isInReadingList, 
    toggleReadingList, 
    readingList,
    toggleReadingStatus 
  } = useSavedBooks();

  useEffect(() => {
    async function fetchBook() {
      try {
        setLoading(true);
        setError("");
        const res = await api.getBookById(id);
        if (res.data) {
          // If recommendation result was cached in session, attach matching score/explanation
          try {
            const cached = sessionStorage.getItem("bookwise_last_recommendation");
            if (cached) {
              const parsed = JSON.parse(cached);
              const matchedRec = parsed.recommendations?.find((r) => r.id === id);
              if (matchedRec) {
                res.data.matchPercentage = matchedRec.matchPercentage;
                res.data.score = matchedRec.score;
                res.data.explanation = matchedRec.explanation;
                res.data.triggeredRules = matchedRec.triggeredRules;
                res.data.scoreBreakdown = matchedRec.scoreBreakdown;
              }
            }
          } catch (e) {
            console.error("Cache check failed", e);
          }
          setBook(res.data);
        } else {
          setError("Book not found in knowledge base.");
        }
      } catch (err) {
        console.error("Failed to fetch book details", err);
        setError("Failed to load book details. Please check the ID.");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Retrieving Book from Knowledge Base..." />;
  }

  if (error || !book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-serif text-white mb-2">Book Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || "Requested book does not exist."}</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  const favorited = isFavorite(book.id);
  const inReadingList = isInReadingList(book.id);
  const readingListItem = readingList.find((item) => item.id === book.id);
  const isCompleted = readingListItem?.status === "completed";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Return to recommendations button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Recommendations</span>
        </button>
      </div>

      {/* Main Book Hero Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cover Column */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-auto aspect-[3/4] object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

            {/* Quick Overlay Floating Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                {book.genre}
              </span>
              <span className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-950/80 backdrop-blur-md text-sky-400 border border-sky-500/30 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {book.language}
              </span>
            </div>

            {book.matchPercentage !== undefined && (
              <div className="absolute bottom-4 left-4">
                <RecommendationScore score={book.matchPercentage} size="lg" />
              </div>
            )}
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase">
                ID: {book.id} • Published {book.publicationYear}
              </span>
              {book.rating && (
                <div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{book.rating} / 5.0</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight">
              {book.title}
            </h1>
            <p className="text-lg text-slate-300 font-medium mt-1">
              by <span className="text-amber-400">{book.author}</span>
            </p>
          </div>

          {/* Action Buttons: Add to Favorites & Reading List */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => toggleFavorite(book)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                favorited
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-md shadow-rose-500/20"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? "fill-rose-500 text-rose-500" : ""}`} />
              <span>{favorited ? "Saved in Favorites" : "Add to Favorites"}</span>
            </button>

            <button
              onClick={() => toggleReadingList(book)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                inReadingList
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-md shadow-emerald-500/20"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${inReadingList ? "fill-emerald-500 text-emerald-500" : ""}`} />
              <span>{inReadingList ? "In Reading List" : "Add to Reading List"}</span>
            </button>

            {inReadingList && (
              <button
                onClick={() => toggleReadingStatus(book.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : "bg-sky-500/10 text-sky-300 border-sky-500/30"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                <span>{isCompleted ? "Completed ✓" : "Mark as Completed"}</span>
              </button>
            )}
          </div>

          {/* Description */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400">
              Overview & Synopsis
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {book.description}
            </p>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Language</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-400" /> {book.language}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Reading Level</span>
              <span className="text-sm font-bold text-white">
                {book.readingLevel}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Book Length</span>
              <span className="text-sm font-bold text-white">
                {book.lengthCategory} {book.pageCount ? `(${book.pageCount}p)` : ""}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Year</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" /> {book.publicationYear}
              </span>
            </div>
          </div>

          {/* Reading Goals Tags */}
          {book.readingGoals && book.readingGoals.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-400" /> Aligned Reading Goals:
              </span>
              <div className="flex flex-wrap gap-2">
                {book.readingGoals.map((goal, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendation Explanation (if present) */}
          {book.explanation && (
            <div className="pt-2">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 block mb-2">
                Why This Book Was Recommended For You:
              </span>
              <RecommendationExplanation
                explanation={book.explanation}
                triggeredRules={book.triggeredRules}
                scoreBreakdown={book.scoreBreakdown}
              />
            </div>
          )}
        </div>
      </div>

      {/* Backward Chaining Goal Verification Section */}
      <section className="pt-2">
        <BackwardChainingVerifier bookId={book.id} />
      </section>

      {/* Similar Books Section */}
      {book.similarBooks && book.similarBooks.length > 0 && (
        <div className="pt-10 border-t border-slate-800 space-y-6">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-amber-400">
              Explore Related
            </span>
            <h2 className="text-2xl font-bold font-serif text-white mt-1">
              Similar Books in {book.genre}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Books sharing comparable themes, reading levels, and genres.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {book.similarBooks.map((simBook) => (
              <BookCard key={simBook.id} book={simBook} showRecommendationDetails={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
