import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  Trash2, 
  BookOpen, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useSavedBooks } from "../context/SavedBooksContext";
import EmptyState from "../components/EmptyState";

export default function ReadingList() {
  const { readingList, toggleReadingStatus, removeFromReadingList } = useSavedBooks();
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'want_to_read' | 'completed'

  const completedCount = useMemo(() => {
    return readingList.filter((b) => b.status === "completed").length;
  }, [readingList]);

  const totalCount = readingList.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredBooks = useMemo(() => {
    if (filterStatus === "want_to_read") {
      return readingList.filter((b) => b.status !== "completed");
    }
    if (filterStatus === "completed") {
      return readingList.filter((b) => b.status === "completed");
    }
    return readingList;
  }, [readingList, filterStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono">
            <Bookmark className="w-4 h-4 fill-emerald-400" /> Reading Tracker
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight mt-1">
            My Reading List
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track reading goals, queue future books, and log completions.
          </p>
        </div>

        {/* LocalStorage Note */}
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5 max-w-sm">
          <HardDrive className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Progress is preserved locally via <strong className="text-slate-300">localStorage</strong> across sessions.
          </span>
        </div>
      </div>

      {totalCount > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs uppercase font-mono text-slate-400">Reading Progress</span>
              <h3 className="text-lg font-bold text-white">
                {completedCount} of {totalCount} Books Completed ({progressPercent}%)
              </h3>
            </div>
            {progressPercent === 100 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                <CheckCircle2 className="w-4 h-4" /> All Goals Finished!
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Filter Status Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === "all"
                  ? "bg-slate-700 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              All Books ({totalCount})
            </button>
            <button
              onClick={() => setFilterStatus("want_to_read")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterStatus === "want_to_read"
                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Want to Read ({totalCount - completedCount})</span>
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterStatus === "completed"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed ({completedCount})</span>
            </button>
          </div>
        </div>
      )}

      {totalCount === 0 ? (
        <EmptyState
          title="Your Reading List is Empty"
          message="Queue books here to organize your personal reading roadmap. Discover recommendations or explore our 50+ books and click the bookmark icon."
          actionText="Discover Books to Add"
          actionHref="/questionnaire"
        />
      ) : filteredBooks.length === 0 ? (
        <EmptyState
          title="No Books in This Filter"
          message={`You have no books marked as "${filterStatus.replace(/_/g, " ")}".`}
          actionText="Show All Books"
          onAction={() => setFilterStatus("all")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBooks.map((book) => {
            const isCompleted = book.status === "completed";
            return (
              <div
                key={book.id}
                className="glass-panel p-4 rounded-2xl border border-slate-800 flex gap-4 items-center justify-between transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-22 object-cover rounded-xl shrink-0 bg-slate-900"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-amber-400 border border-slate-700">
                        {book.genre}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {book.language}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-white truncate">
                      <Link to={`/books/${book.id}`} className="hover:text-amber-400">
                        {book.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-slate-400 truncate">by {book.author}</p>

                    <div className="mt-2">
                      <button
                        onClick={() => toggleReadingStatus(book.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                          isCompleted
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                            : "bg-sky-500/15 text-sky-300 border-sky-500/40"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        <span>{isCompleted ? "Completed" : "Want to Read"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => removeFromReadingList(book.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Remove from Reading List"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link
                    to={`/books/${book.id}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    title="View details"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
