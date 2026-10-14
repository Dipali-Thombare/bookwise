import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Filter, Globe, RotateCcw, BookOpen } from "lucide-react";
import api from "../services/api";
import SearchBar from "../components/SearchBar";
import GenreFilter, { GENRES } from "../components/GenreFilter";
import BookGrid from "../components/BookGrid";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "");
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get("language") || "All");
  const [selectedLevel, setSelectedLevel] = useState(searchParams.get("level") || "All");

  // Load all books on mount
  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const res = await api.getBooks();
        if (res.data) {
          setAllBooks(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = {};
    if (searchQuery.trim()) params.query = searchQuery.trim();
    if (selectedGenre) params.genre = selectedGenre;
    if (selectedLanguage !== "All") params.language = selectedLanguage;
    if (selectedLevel !== "All") params.level = selectedLevel;
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedGenre, selectedLanguage, selectedLevel, setSearchParams]);

  // Client-side filtering of books
  const filteredBooks = useMemo(() => {
    return allBooks.filter((book) => {
      // 1. Text Query (Title, Author, Description, Genre)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(q);
        const matchesAuthor = book.author.toLowerCase().includes(q);
        const matchesGenre = book.genre.toLowerCase().includes(q);
        const matchesDesc = book.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesAuthor && !matchesGenre && !matchesDesc) return false;
      }

      // 2. Genre Filter
      if (selectedGenre && selectedGenre !== "All") {
        if (book.genre.toLowerCase() !== selectedGenre.toLowerCase()) return false;
      }

      // 3. Language Filter
      if (selectedLanguage && selectedLanguage !== "All") {
        if (book.language.toLowerCase() !== selectedLanguage.toLowerCase()) return false;
      }

      // 4. Reading Level Filter
      if (selectedLevel && selectedLevel !== "All") {
        if (book.readingLevel.toLowerCase() !== selectedLevel.toLowerCase()) return false;
      }

      return true;
    });
  }, [allBooks, searchQuery, selectedGenre, selectedLanguage, selectedLevel]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedGenre("");
    setSelectedLanguage("All");
    setSelectedLevel("All");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 font-mono">
          <BookOpen className="w-4 h-4 fill-amber-400" /> Explore Collection
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight mt-1">
          Browse Knowledge Base
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-xl">
          Search over 55+ books across 12 genres and 3 languages (English, Hindi, and Marathi).
        </p>
      </div>

      {/* Search and Filters Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-5 shadow-xl">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
          placeholder="Search by book title, author, genre, or keyword..."
        />

        {/* Genre Pill Filter */}
        <div>
          <label className="text-xs uppercase font-mono tracking-wider text-slate-400 block mb-2">
            Filter by Genre:
          </label>
          <GenreFilter
            selectedGenre={selectedGenre}
            onSelectGenre={setSelectedGenre}
          />
        </div>

        {/* Secondary dropdown filters */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Language filter */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-400 font-mono">Language:</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
              >
                <option value="All">All Languages</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
              </select>
            </div>

            {/* Reading Level filter */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-400 font-mono">Level:</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500 text-xs"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {(searchQuery || selectedGenre || selectedLanguage !== "All" || selectedLevel !== "All") && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredBooks.length}</strong> of{" "}
          <strong className="text-white">{allBooks.length}</strong> total books in Knowledge Base
        </span>
      </div>

      {/* Books Grid */}
      {loading ? (
        <LoadingSpinner message="Querying Knowledge Base..." />
      ) : (
        <BookGrid
          books={filteredBooks}
          showRecommendationDetails={false}
          emptyMessage="No books match the search query and filters. Try adjusting your search term or resetting the filters."
          onReset={handleReset}
        />
      )}
    </div>
  );
}
