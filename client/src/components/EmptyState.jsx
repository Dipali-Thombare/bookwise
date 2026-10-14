import React from "react";
import { Link } from "react-router-dom";
import { BookX, RotateCcw, Sparkles } from "lucide-react";

export default function EmptyState({ 
  title = "No Books Found", 
  message = "We couldn't find any books matching your criteria.", 
  actionText = "Reset Filters", 
  actionHref,
  onAction 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <BookX className="w-8 h-8 text-amber-400/80" />
      </div>
      <h3 className="text-xl font-bold text-white font-serif tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">
        {message}
      </p>

      {actionHref ? (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>{actionText}</span>
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors shadow-md cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      ) : null}
    </div>
  );
}
