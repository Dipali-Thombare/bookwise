import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SavedBooksProvider } from "./context/SavedBooksContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Questionnaire from "./pages/Questionnaire";
import Recommendations from "./pages/Recommendations";
import BookDetails from "./pages/BookDetails";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import ReadingList from "./pages/ReadingList";
import GoalVerifier from "./pages/GoalVerifier";

export default function App() {
  return (
    <SavedBooksProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#0b0e17] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/goal-verifier" element={<GoalVerifier />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/reading-list" element={<ReadingList />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </SavedBooksProvider>
  );
}
