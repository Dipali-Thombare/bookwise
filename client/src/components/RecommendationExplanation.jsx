import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp, Cpu, CheckCircle2, SlidersHorizontal } from "lucide-react";

export default function RecommendationExplanation({ explanation, triggeredRules = [], scoreBreakdown = {} }) {
  const [expanded, setExpanded] = useState(false);

  if (!explanation) return null;

  return (
    <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
      {/* Primary explanation summary */}
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-slate-200 leading-snug">
            {explanation.summary}
          </p>
          
          {/* Quick Triggered Rule pill */}
          {triggeredRules && triggeredRules.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[10px] uppercase font-mono text-slate-400">Rules Triggered:</span>
              {triggeredRules.map((rule, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-mono flex items-center gap-1"
                >
                  <Cpu className="w-3 h-3 text-amber-400" />
                  {rule.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Toggle details */}
        {(triggeredRules.length > 0 || scoreBreakdown) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1 shrink-0"
            title={expanded ? "Hide rule inference details" : "View rule inference details"}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Expanded Inference Engine Breakdown */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 animate-fadeIn">
          {/* Detailed rule explanations */}
          {triggeredRules && triggeredRules.length > 0 && (
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block mb-1">
                Forward Chaining Executions
              </span>
              <ul className="space-y-1.5 pl-1">
                {triggeredRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{rule.explanation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Points breakdown */}
          {scoreBreakdown && (
            <div className="pt-2 border-t border-slate-800/60">
              <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 flex items-center gap-1 mb-1.5">
                <SlidersHorizontal className="w-3 h-3 text-slate-400" /> Transparent Score Weight Breakdown
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] font-mono">
                {scoreBreakdown.genrePoints > 0 && (
                  <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800 text-amber-300">
                    Genre: +{scoreBreakdown.genrePoints} pts
                  </div>
                )}
                {scoreBreakdown.goalPoints > 0 && (
                  <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800 text-amber-300">
                    Goal: +{scoreBreakdown.goalPoints} pts
                  </div>
                )}
                {scoreBreakdown.languagePoints > 0 && (
                  <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800 text-amber-300">
                    Language: +{scoreBreakdown.languagePoints} pts
                  </div>
                )}
                {scoreBreakdown.levelPoints > 0 && (
                  <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800 text-amber-300">
                    Level: +{scoreBreakdown.levelPoints} pts
                  </div>
                )}
                {scoreBreakdown.lengthPoints > 0 && (
                  <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800 text-amber-300">
                    Length: +{scoreBreakdown.lengthPoints} pts
                  </div>
                )}
                {scoreBreakdown.bonusPoints > 0 && (
                  <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800 text-emerald-300">
                    Rule Bonus: +{scoreBreakdown.bonusPoints} pts
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
