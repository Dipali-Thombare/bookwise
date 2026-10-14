import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Target, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  ShieldAlert, 
  Zap,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import api from "../services/api";

export default function BackwardChainingVerifier({ bookId, initialFacts = {}, onFactChange }) {
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTrace, setShowTrace] = useState(false);
  const [activeFacts, setActiveFacts] = useState(() => {
    // Attempt to load from sessionStorage if available
    try {
      const cached = sessionStorage.getItem("bookwise_last_recommendation");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.preferences) return { ...parsed.preferences, ...initialFacts };
      }
    } catch (e) {}
    return { ...initialFacts };
  });

  const runVerification = async (factsToTest) => {
    if (!bookId) return;
    try {
      setLoading(true);
      setError("");
      const res = await api.verifyHypothesis(bookId, factsToTest);
      if (res.success && res.data) {
        setProof(res.data);
      } else {
        setError(res.message || "Failed to run backward chaining verification.");
      }
    } catch (err) {
      console.error("Backward chaining error:", err);
      setError(err.response?.data?.message || err.message || "Error during inference.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runVerification(activeFacts);
  }, [bookId]);

  const handleApplyMissingFact = (attribute, value) => {
    const updated = {
      ...activeFacts,
      [attribute]: attribute === "genres" ? [value] : value
    };
    setActiveFacts(updated);
    if (onFactChange) onFactChange(updated);
    runVerification(updated);
  };

  const handleClearFact = (attribute) => {
    const updated = { ...activeFacts };
    delete updated[attribute];
    setActiveFacts(updated);
    if (onFactChange) onFactChange(updated);
    runVerification(updated);
  };

  const handleResetToPerfectMatch = () => {
    if (!proof?.hypothesis) return;
    const perfectFacts = {
      genres: [proof.hypothesis.genre],
      language: proof.hypothesis.language,
      readingLevel: proof.hypothesis.readingLevel,
      readingGoal: proof.hypothesis.readingGoals?.[0] || "Entertainment",
      bookLength: proof.hypothesis.lengthCategory
    };
    setActiveFacts(perfectFacts);
    if (onFactChange) onFactChange(perfectFacts);
    runVerification(perfectFacts);
  };

  const getVerdictBadge = (verdict, score) => {
    switch (verdict) {
      case "PROVEN":
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Goal Proven ({score}% Match)</span>
          </div>
        );
      case "PARTIALLY_PROVEN":
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Partially Proven ({score}%)</span>
          </div>
        );
      case "DISPROVED":
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 font-bold text-xs uppercase tracking-wider">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Goal Disproved ({score}%)</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/40 text-sky-300 font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>Evidence Needed ({score}%)</span>
          </div>
        );
    }
  };

  const getSubgoalStatusBadge = (status, points, weight) => {
    if (status === "PROVEN") {
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
          <CheckCircle2 className="w-3 h-3" /> Proven (+{points} pts)
        </span>
      );
    }
    if (status === "CONFLICT") {
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-md">
          <XCircle className="w-3 h-3" /> Conflict (0/{weight} pts)
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
        <HelpCircle className="w-3 h-3 text-amber-400" /> Unknown (0/{weight} pts)
      </span>
    );
  };

  return (
    <div className="rounded-3xl glass-panel border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[90px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold">
              Classical AI • Goal-Driven
            </span>
            <span className="text-xs font-mono text-slate-400">Backward Chaining Engine</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <span>Verify Compatibility with Backward Chaining</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Tests whether this book satisfies your reading goals by back-chaining through prerequisite sub-goals.
          </p>
        </div>

        {proof && (
          <div className="shrink-0 flex items-center gap-2">
            {getVerdictBadge(proof.verdict, proof.confidenceScore)}
          </div>
        )}
      </div>

      {loading && (
        <div className="py-8 text-center text-slate-400 text-sm animate-pulse flex items-center justify-center gap-2">
          <Cpu className="w-4 h-4 animate-spin text-amber-400" />
          <span>Evaluating backward proof tree...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {proof && !loading && (
        <div className="space-y-6">
          {/* Root Goal Statement Card */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Root Hypothesis Goal:</span>
              <p className="text-sm sm:text-base font-bold text-white font-mono">
                {proof.hypothesis.goal}
              </p>
              <p className="text-xs text-slate-300">{proof.verdictDescription}</p>
            </div>

            <button
              onClick={handleResetToPerfectMatch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 hover:border-amber-500/40 transition-colors cursor-pointer shrink-0"
              title="Test perfect match facts"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Ideal Profile</span>
            </button>
          </div>

          {/* Sub-Goals Breakdown Tree */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Backward Sub-Goals Decomposition ({proof.stats.provenCount}/{proof.stats.totalSubgoals} Proven)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Score: <strong className="text-amber-400 font-bold">{proof.confidenceScore}%</strong> / 100%
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {proof.proofTree.subGoals.map((sg) => (
                <div
                  key={sg.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    sg.status === "PROVEN"
                      ? "bg-emerald-950/20 border-emerald-500/30"
                      : sg.status === "CONFLICT"
                      ? "bg-rose-950/20 border-rose-500/30"
                      : "bg-slate-900/60 border-slate-800"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="shrink-0">
                        {sg.status === "PROVEN" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {sg.status === "CONFLICT" && <XCircle className="w-4 h-4 text-rose-400" />}
                        {sg.status === "UNKNOWN" && <HelpCircle className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-white">{sg.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Required: <span className="text-slate-200 font-semibold">{sg.required}</span>
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">{sg.explanation}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {getSubgoalStatusBadge(sg.status, sg.pointsEarned, sg.weight)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Evidence Prompt Section (Interactive Backward Inference) */}
          {proof.missingEvidence.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider font-mono">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Interactive Backward Inquiry • Missing Evidence to Complete Proof</span>
              </div>
              <p className="text-xs text-slate-300">
                To prove this book hypothesis, answer the missing sub-goals below to supply ground facts:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {proof.missingEvidence.map((me, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="text-xs">
                      <span className="text-slate-200 font-medium block">{me.prompt}</span>
                      <span className="text-[10px] text-amber-400 font-mono">
                        Potential Proof Boost: +{me.weight} pts
                      </span>
                    </div>

                    <button
                      onClick={() => handleApplyMissingFact(me.attribute, me.expectedValue)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>Confirm</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Fired in Backward Trace */}
          {proof.proofTree.rulesEvaluated.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Domain Rules Fired via Backward Deduction ({proof.proofTree.rulesEvaluated.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {proof.proofTree.rulesEvaluated.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-2.5"
                  >
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{rule.name}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          +{rule.bonus} bonus
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-0.5">{rule.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collapsible Step-by-Step Inference Trace */}
          <div className="pt-2">
            <button
              onClick={() => setShowTrace(!showTrace)}
              className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Formal Backward Deduction Trace ({proof.deductionSteps.length} Steps)</span>
              </span>
              {showTrace ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTrace && (
              <div className="mt-2 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                {proof.deductionSteps.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">[{s.step}]</span>
                    <span>{s.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
