import React from "react";
import { BookOpen, Sparkles } from "lucide-react";

export default function LoadingSpinner({ message = "Consulting Rule-Based Engine..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        {/* Outer glowing pulse ring */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
          <BookOpen className="w-8 h-8 text-amber-400 animate-bounce" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white tracking-tight font-serif">{message}</h3>
      <p className="text-xs text-slate-400 mt-1 max-w-sm">
        Evaluating IF–THEN rules, matching preferences against knowledge base, and scoring candidate books.
      </p>
    </div>
  );
}
