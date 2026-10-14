import React from "react";
import BookCard from "./BookCard";
import EmptyState from "./EmptyState";

export default function BookGrid({ 
  books = [], 
  showRecommendationDetails = true,
  emptyMessage = "No books match your selection.",
  onReset
}) {
  if (!books || books.length === 0) {
    return (
      <EmptyState
        title="No Books Found"
        message={emptyMessage}
        onAction={onReset}
        actionText="Reset Filters"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          showRecommendationDetails={showRecommendationDetails}
        />
      ))}
    </div>
  );
}
