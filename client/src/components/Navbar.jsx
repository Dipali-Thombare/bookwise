import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Compass, 
  Sparkles, 
  Heart, 
  Bookmark, 
  Search, 
  Menu, 
  X,
  Cpu,
  Target
} from "lucide-react";
import { useSavedBooks } from "../context/SavedBooksContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favorites, readingList } = useSavedBooks();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-serif">BookWise</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  Rule AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">Intelligent Book Recommendations</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <Compass className="w-4 h-4" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/search" className={navLinkClass}>
              <Search className="w-4 h-4" />
              <span>Browse & Search</span>
            </NavLink>
            <NavLink to="/goal-verifier" className={navLinkClass}>
              <Target className="w-4 h-4 text-amber-400" />
              <span>Goal Verifier</span>
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              <Heart className="w-4 h-4" />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  {favorites.length}
                </span>
              )}
            </NavLink>
            <NavLink to="/reading-list" className={navLinkClass}>
              <Bookmark className="w-4 h-4" />
              <span>Reading List</span>
              {readingList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {readingList.length}
                </span>
              )}
            </NavLink>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/questionnaire")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Get Recommendations</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => navigate("/questionnaire")}
              className="p-2 rounded-lg bg-amber-500 text-slate-950"
              title="Get Recommendations"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-3 pb-5 space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Compass className="w-4 h-4" />
            <span>Home</span>
          </NavLink>
          <NavLink
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Search className="w-4 h-4" />
            <span>Browse & Search</span>
          </NavLink>
          <NavLink
            to="/goal-verifier"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Target className="w-4 h-4 text-amber-400" />
            <span>Goal Verifier</span>
          </NavLink>
          <NavLink
            to="/favorites"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Heart className="w-4 h-4" />
            <span>Favorites ({favorites.length})</span>
          </NavLink>
          <NavLink
            to="/reading-list"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Bookmark className="w-4 h-4" />
            <span>Reading List ({readingList.length})</span>
          </NavLink>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/questionnaire");
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Get Recommendations</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
