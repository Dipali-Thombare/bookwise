const express = require("express");
const cors = require("cors");
const booksRoutes = require("./routes/booksRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// API Health / Meta Route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "BookWise Recommendation API",
    engine: "Dual Rule-Based Inference Engine (Forward Chaining & Backward Chaining)",
    database: "None (Predefined JavaScript Knowledge Base)"
  });
});

// Mount Routes
app.use("/api/books", booksRoutes);
app.use("/api/recommendations", recommendationRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
