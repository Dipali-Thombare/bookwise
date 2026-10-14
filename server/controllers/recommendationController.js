/**
 * Recommendation Controller
 * 
 * Supports both classical AI inference paradigms:
 * 1. Forward Chaining: Starts with user facts and infers matching book recommendations.
 * 2. Backward Chaining: Starts with a goal/hypothesis (e.g. "Recommend Book X") and
 *    recursively backtracks through necessary sub-goals, identifying proven facts,
 *    conflicts, and missing evidence.
 */

const recommendationEngine = require("../services/recommendationEngine");
const backwardChainingEngine = require("../services/backwardChainingEngine");

/**
 * Forward Chaining Endpoint:
 * POST /api/recommendations
 */
exports.getRecommendations = (req, res, next) => {
  try {
    const preferences = req.body;
    const result = recommendationEngine.evaluate(preferences);

    res.status(200).json({
      success: true,
      data: {
        preferences: result.appliedPreferences,
        totalRecommendations: result.totalCount,
        isClosestMatch: result.isClosestMatch,
        maxPossibleScore: result.maxPossibleScore,
        recommendations: result.recommendations
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Backward Chaining Hypothesis Verification:
 * POST /api/recommendations/verify-goal
 * 
 * Body: { bookId: string, preferences: Object }
 */
exports.verifyHypothesis = (req, res, next) => {
  try {
    const { bookId, preferences } = req.body;
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Target hypothesis 'bookId' is required for backward chaining verification."
      });
    }

    const proof = backwardChainingEngine.verifyBookHypothesis(bookId, preferences || {});

    res.status(200).json({
      success: true,
      data: proof
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Backward Chaining Hypothesis Search:
 * POST /api/recommendations/backward-search
 * 
 * Evaluates candidate hypotheses from facts and identifies 1-step-away goals.
 */
exports.getBackwardHypotheses = (req, res, next) => {
  try {
    const preferences = req.body || {};
    const result = backwardChainingEngine.findProvenHypotheses(preferences);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
