import axios from "axios";

// Automatically uses proxy in dev or full URL if configured
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});

export const api = {
  // Fetch all books with optional query filters (genre, language, readingLevel)
  getBooks: async (params = {}) => {
    const response = await apiClient.get("/books", { params });
    return response.data;
  },

  // Fetch single book by ID
  getBookById: async (id) => {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  },

  // Search books by title, author, or keywords
  searchBooks: async (query) => {
    const response = await apiClient.get("/books/search", {
      params: { query }
    });
    return response.data;
  },

  // Filter books by specific genre
  getBooksByGenre: async (genre) => {
    const response = await apiClient.get(`/books/genre/${encodeURIComponent(genre)}`);
    return response.data;
  },

  // Forward Chaining: Post user preferences to the rule-based recommendation engine
  getRecommendations: async (preferences) => {
    const response = await apiClient.post("/recommendations", preferences);
    return response.data;
  },

  // Backward Chaining: Verify a specific book goal/hypothesis against user facts
  verifyHypothesis: async (bookId, preferences = {}) => {
    const response = await apiClient.post("/recommendations/verify-goal", {
      bookId,
      preferences
    });
    return response.data;
  },

  // Backward Chaining: Evaluate candidate hypotheses across the knowledge base
  getBackwardHypotheses: async (preferences = {}) => {
    const response = await apiClient.post("/recommendations/backward-search", preferences);
    return response.data;
  }
};

export default api;
