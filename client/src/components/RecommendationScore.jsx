import React from "react";
import { Sparkles, Award, CheckCircle2 } from "lucide-react";

export default function RecommendationScore({ score = 0, size = "md", showLabel = true }) {
  // Color palette and glow based on score
  const getScoreTheme = (val) => {
    if (val >= 90) {
      return {
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        border: "border-emerald-500/40",
        glow: "shadow-emerald-500/20",
        label: "Exceptional Match"
      };
    }
    if (val >= 75) {
      return {
        bg: "bg-amber-500/15",
        text: "text-amber-400",
        border: "border-amber-500/40",
        glow: "shadow-amber-500/20",
        label: "Strong Match"
      };
    }
    if (val >= 50) {
      return {
        bg: "bg-sky-500/15",
        text: "text-sky-400",
        border: "border-sky-500/40",
        glow: "shadow-sky-500/20",
        label: "Moderate Match"
      };
    }
    return {
      bg: "bg-slate-700/30",
      text: "text-slate-300",
      border: "border-slate-600/40",
      glow: "shadow-slate-500/10",
      label: "Partial Match"
    };
  };

  const theme = getScoreTheme(score);

  if (size === "sm") {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border}`}>
        <Sparkles className="w-3 h-3" />
        <span>{score}%</span>
      </span>
    );
  }

  if (size === "lg") {
    return (
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${theme.bg} ${theme.border} shadow-lg ${theme.glow}`}>
        <div className="flex flex-col items-center justify-center">
          <span className={`text-3xl font-extrabold tracking-tight ${theme.text}`}>
            {score}%
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Score</span>
        </div>
        {showLabel && (
          <div className="border-l border-slate-700/60 pl-3">
            <span className={`text-sm font-bold flex items-center gap-1.5 ${theme.text}`}>
              <Award className="w-4 h-4" /> {theme.label}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">Calculated by Rule Engine</span>
          </div>
        )}
      </div>
    );
  }

  // Default medium badge
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${theme.bg} ${theme.text} ${theme.border} shadow-sm ${theme.glow}`}>
      <Sparkles className="w-3.5 h-3.5" />
      <span>{score}% Match</span>
      {showLabel && <span className="text-slate-400 text-[10px]">({theme.label})</span>}
    </div>
  );
}
