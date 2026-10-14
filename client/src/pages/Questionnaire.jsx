import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, HelpCircle, ShieldAlert, Cpu, Target, ArrowRight } from "lucide-react";
import PreferenceForm from "../components/PreferenceForm";
import api from "../services/api";

export default function Questionnaire() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handlePreferencesSubmit = async (preferences) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.getRecommendations(preferences);

      if (response.success && response.data) {
        // Cache in sessionStorage for persistence across page refresh
        sessionStorage.setItem("bookwise_last_recommendation", JSON.stringify(response.data));
        navigate("/recommendations", { state: { result: response.data } });
      } else {
        setErrorMessage(response.message || "Unable to generate recommendations. Please try again.");
      }
    } catch (err) {
      console.error("Recommendation submission failed:", err);
      const msg = err.response?.data?.message || err.message || "Failed to connect to recommendation service.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Switch Banner to Backward Chaining */}
      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Target className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Already have a specific book in mind? Test whether it satisfies your reading goals.</span>
        </div>
        <Link
          to="/goal-verifier"
          className="inline-flex items-center gap-1.5 text-amber-400 font-bold hover:text-amber-300 transition-colors shrink-0"
        >
          <span>Use Backward Chaining Verifier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span>Forward Chaining Inference Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-white tracking-tight">
          Find Your Recommended Books
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Tell us your reading taste. Our Forward Chaining Inference Engine will match your criteria
          against 58+ curated books using weighted IF–THEN rules and generate transparent explanations.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Submission Error</span>
            <span className="text-xs">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <PreferenceForm onSubmit={handlePreferencesSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
