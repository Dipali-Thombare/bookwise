import React, { createContext, useContext, useState, useEffect } from "react";

const SavedBooksContext = createContext();

const FAVORITES_KEY = "bookwise_favorites";
const READING_LIST_KEY = "bookwise_reading_list";

export function SavedBooksProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load favorites from localStorage", e);
      return [];
    }
  });

  const [readingList, setReadingList] = useState(() => {
    try {
      const saved = localStorage.getItem(READING_LIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load reading list from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(READING_LIST_KEY, JSON.stringify(readingList));
    } catch (e) {
      console.error("Failed to save reading list to localStorage", e);
    }
  }, [readingList]);

  // Toggle book in favorites
  const toggleFavorite = (book) => {
    setFavorites((prev) => {
      const exists = prev.some((b) => b.id === book.id);
      if (exists) {
        return prev.filter((b) => b.id !== book.id);
      } else {
        return [...prev, book];
      }
    });
  };

  const isFavorite = (bookId) => {
    return favorites.some((b) => b.id === bookId);
  };

  // Add or remove from reading list
  const toggleReadingList = (book) => {
    setReadingList((prev) => {
      const exists = prev.some((b) => b.id === book.id);
      if (exists) {
        return prev.filter((b) => b.id !== book.id);
      } else {
        return [
          ...prev,
          {
            ...book,
            status: "want_to_read",
            addedAt: new Date().toISOString()
          }
        ];
      }
    });
  };

  const isInReadingList = (bookId) => {
    return readingList.some((b) => b.id === bookId);
  };

  // Mark book as completed or back to want_to_read
  const toggleReadingStatus = (bookId) => {
    setReadingList((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const nextStatus = b.status === "completed" ? "want_to_read" : "completed";
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
  };

  const removeFromReadingList = (bookId) => {
    setReadingList((prev) => prev.filter((b) => b.id !== bookId));
  };

  return (
    <SavedBooksContext.Provider
      value={{
        favorites,
        readingList,
        toggleFavorite,
        isFavorite,
        toggleReadingList,
        isInReadingList,
        toggleReadingStatus,
        removeFromReadingList
      }}
    >
      {children}
    </SavedBooksContext.Provider>
  );
}

export function useSavedBooks() {
  const context = useContext(SavedBooksContext);
  if (!context) {
    throw new Error("useSavedBooks must be used within a SavedBooksProvider");
  }
  return context;
}
