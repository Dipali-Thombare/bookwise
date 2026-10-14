import React from "react";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Bookmark, 
  Check, 
  BookOpen, 
  Star, 
  Globe, 
  Clock, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import RecommendationScore from "./RecommendationScore";
import RecommendationExplanation from "./RecommendationExplanation";
import { useSavedBooks } from "../context/SavedBooksContext";

export default function BookCard({ book, showRecommendationDetails = true }) {
  const { 
    isFavorite, 
    toggleFavorite, 
    isInReadingList, 
    toggleReadingList,
    readingList,
    toggleReadingStatus 
  } = useSavedBooks();

  const favorited = isFavorite(book.id);
  const inReadingList = isInReadingList(book.id);
  const readingListItem = readingList.find((item) => item.id === book.id);
  const isCompleted = readingListItem?.status === "completed";

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col h-full border border-slate-800/80 transition-all duration-300 group">
      {/* Cover & Quick Overlay Actions */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Genre & Language */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
              {book.genre}
            </span>
            <span className="px-2 py-1 rounded-lg text-[10px] font-medium bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700/60 flex items-center gap-1">
              <Globe className="w-3 h-3 text-sky-400" />
              {book.language}
            </span>
          </div>

          {/* Quick Action Buttons (Favorite & Reading List) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(book);
              }}
              title={favorited ? "Remove from Favorites" : "Add to Favorites"}
              className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                favorited
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-lg shadow-rose-500/20"
                  : "bg-slate-950/70 text-slate-300 hover:text-white border border-slate-700/60 hover:bg-slate-900"
              }`}
            >
              <Heart className={`w-4 h-4 ${favorited ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleReadingList(book);
              }}
              title={inReadingList ? "Remove from Reading List" : "Add to Reading List"}
              className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                inReadingList
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-950/70 text-slate-300 hover:text-white border border-slate-700/60 hover:bg-slate-900"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${inReadingList ? "fill-emerald-500 text-emerald-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Bottom Banner inside Image: Score & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {book.matchPercentage !== undefined ? (
            <RecommendationScore score={book.matchPercentage} size="sm" />
          ) : (
            <span className="text-[11px] font-mono text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-sm">
              {book.publicationYear}
            </span>
          )}

          {book.rating && (
            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{book.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Status Chip if in Reading List */}
          {inReadingList && (
            <div className="mb-2 flex items-center justify-between">
              <span
                onClick={(e) => {
                  e.preventDefault();
                  toggleReadingStatus(book.id);
                }}
                className={`cursor-pointer inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-sky-500/10 text-sky-400 border-sky-500/30"
                }`}
                title="Click to toggle status"
              >
                {isCompleted ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {isCompleted ? "Completed" : "Want to Read"}
              </span>
              <span className="text-[10px] text-slate-400">In Reading List</span>
            </div>
          )}

          <h3 className="font-serif font-bold text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            <Link to={`/books/${book.id}`}>{book.title}</Link>
          </h3>
          <p className="text-xs text-slate-400 mb-2 font-medium">by {book.author}</p>

          <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed mb-3">
            {book.description}
          </p>

          {/* Metadata Tags */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
              {book.readingLevel}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
              {book.lengthCategory} ({book.pageCount ? `${book.pageCount}p` : ""})
            </span>
          </div>

          {/* Recommendation Explanation if available */}
          {showRecommendationDetails && book.explanation && (
            <RecommendationExplanation
              explanation={book.explanation}
              triggeredRules={book.triggeredRules}
              scoreBreakdown={book.scoreBreakdown}
            />
          )}
        </div>

        {/* Card Footer: View Details CTA */}
        <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
          <Link
            to={`/books/${book.id}`}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-all cursor-pointer"
          >
            <span>View Book Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
