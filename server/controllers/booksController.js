/**
 * Books Controller
 * Handles retrieval, search, filtering, and detail lookups from the JavaScript Knowledge Base.
 */

const recommendationEngine = require("../services/recommendationEngine");
const books = require("../data/books");

// GET /api/books
exports.getAllBooks = (req, res, next) => {
  try {
    const { genre, language, readingLevel } = req.query;
    let results = [...books];

    if (genre) {
      results = results.filter(
        (b) => b.genre.toLowerCase() === genre.toLowerCase()
      );
    }

    if (language) {
      results = results.filter(
        (b) => b.language.toLowerCase() === language.toLowerCase()
      );
    }

    if (readingLevel) {
      results = results.filter(
        (b) => b.readingLevel.toLowerCase() === readingLevel.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/books/search?query=keyword
exports.searchBooks = (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(200).json({
        success: true,
        count: books.length,
        data: books
      });
    }

    const matchedBooks = recommendationEngine.searchBooks(query);

    res.status(200).json({
      success: true,
      query: query.trim(),
      count: matchedBooks.length,
      data: matchedBooks
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/books/genre/:genre
exports.filterByGenre = (req, res, next) => {
  try {
    const { genre } = req.params;
    const filtered = recommendationEngine.filterByGenre(genre);

    res.status(200).json({
      success: true,
      genre,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/books/:id
exports.getBookById = (req, res, next) => {
  try {
    const { id } = req.params;
    const book = recommendationEngine.getBookById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book with ID '${id}' not found in knowledge base.`
      });
    }

    const similarBooks = recommendationEngine.getSimilarBooks(id, 4);

    res.status(200).json({
      success: true,
      data: {
        ...book,
        similarBooks
      }
    });
  } catch (error) {
    next(error);
  }
};
