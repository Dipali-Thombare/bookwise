const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

// GET /api/books/search?query=keyword
router.get("/search", booksController.searchBooks);

// GET /api/books/genre/:genre
router.get("/genre/:genre", booksController.filterByGenre);

// GET /api/books/:id
router.get("/:id", booksController.getBookById);

// GET /api/books
router.get("/", booksController.getAllBooks);

module.exports = router;
