import React from "react";

const GENRES = [
  "All",
  "Fiction",
  "Mystery",
  "Thriller",
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Self-Help",
  "Biography",
  "History",
  "Technology",
  "Business",
  "Adventure"
];

export default function GenreFilter({ selectedGenre, onSelectGenre }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none py-1">
      {GENRES.map((genre) => {
        const isSelected =
          genre === "All"
            ? !selectedGenre || selectedGenre === "All"
            : selectedGenre?.toLowerCase() === genre.toLowerCase();

        return (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre === "All" ? "" : genre)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isSelected
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105"
                : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}

export { GENRES };
