import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, ShieldCheck, Database, HardDriveDownload } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Mission */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
              <BookOpen className="w-4 h-4 text-slate-950" />
            </div>
            <span className="text-xl font-bold text-white font-serif tracking-tight">BookWise</span>
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
              Expert Rule Engine
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            A deterministic, rule-based book recommendation system powered by expert forward & backward chaining AI.
            Unlike black-box models, every recommendation provides a transparent, verifiable mathematical
            and logical explanation.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1.5 text-amber-400/90">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> 100% Explainable AI
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400/90">
              <Database className="w-4 h-4 text-emerald-400" /> Pure In-Memory (Zero DB)
            </span>
            <span className="flex items-center gap-1.5 text-sky-400/90">
              <HardDriveDownload className="w-4 h-4 text-sky-400" /> LocalStorage Client Persistence
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/questionnaire" className="hover:text-amber-400 transition-colors">
                Preference Questionnaire (Forward Chaining)
              </Link>
            </li>
            <li>
              <Link to="/goal-verifier" className="hover:text-amber-400 transition-colors">
                Goal Verifier (Backward Chaining)
              </Link>
            </li>
            <li>
              <Link to="/search" className="hover:text-amber-400 transition-colors">
                Browse All Books
              </Link>
            </li>
            <li>
              <Link to="/favorites" className="hover:text-amber-400 transition-colors">
                Saved Favorites
              </Link>
            </li>
            <li>
              <Link to="/reading-list" className="hover:text-amber-400 transition-colors">
                Personal Reading List
              </Link>
            </li>
          </ul>
        </div>

        {/* System Architecture */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4 font-mono">
            AI Components
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-slate-300">1. Knowledge Base:</span>
              <span>58+ curated books</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-slate-300">2. Rule Base:</span>
              <span>Weighted IF-THEN rules</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-slate-300">3. Forward Chaining:</span>
              <span>Data-driven matcher</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-slate-300">4. Backward Chaining:</span>
              <span>Goal-driven verifier</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-slate-300">5. Explanation:</span>
              <span>Real-time logical justifications</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© {new Date().getFullYear()} BookWise — Rule-Based Book Recommendation System. No database required.</p>
        <p className="text-slate-400">
          Saved books and reading progress are stored locally in your browser.
        </p>
      </div>
    </footer>
  );
}
