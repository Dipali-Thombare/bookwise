const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");
const { validatePreferences } = require("../middleware/validator");

// POST /api/recommendations — Forward Chaining Inference
router.post("/", validatePreferences, recommendationController.getRecommendations);

// POST /api/recommendations/verify-goal — Backward Chaining Hypothesis Verification
router.post("/verify-goal", recommendationController.verifyHypothesis);

// POST /api/recommendations/backward-search — Backward Chaining Hypothesis Search
router.post("/backward-search", recommendationController.getBackwardHypotheses);

module.exports = router;
