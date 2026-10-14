import React from "react";
import { Link } from "react-router-dom";
import { Heart, HardDrive, Sparkles, BookOpen, Trash2 } from "lucide-react";
import { useSavedBooks } from "../context/SavedBooksContext";
import BookGrid from "../components/BookGrid";
import EmptyState from "../components/EmptyState";

export default function Favorites() {
  const { favorites } = useSavedBooks();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 font-mono">
            <Heart className="w-4 h-4 fill-rose-400" /> Personal Library
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight mt-1">
            Favorite Books
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Books you have saved for quick access and inspiration.
          </p>
        </div>

        {/* LocalStorage Notice Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5 max-w-sm">
          <HardDrive className="w-5 h-5 text-sky-400 shrink-0" />
          <span>
            Saved in your browser's <strong className="text-slate-300">localStorage</strong>. No remote database used.
          </span>
        </div>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="No Favorite Books Saved Yet"
          message="You haven't added any books to your favorites. Explore our recommendations or search catalog and click the heart icon to save books here."
          actionText="Find Books To Save"
          actionHref="/questionnaire"
        />
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 font-mono">
            {favorites.length} {favorites.length === 1 ? "Book" : "Books"} in Favorites
          </div>

          <BookGrid
            books={favorites}
            showRecommendationDetails={false}
          />
        </div>
      )}
    </div>
  );
}
