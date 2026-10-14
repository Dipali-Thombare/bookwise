/**
 * Configurable Scoring Weights and Constants for BookWise Recommendation System
 * Total Maximum Base Score: 100 points
 */

const scoringConfig = {
  maxScore: 100,
  weights: {
    genre: 40,        // Genre match weight (40 points)
    readingGoal: 25,  // Reading goal match weight (25 points)
    language: 15,     // Language match weight (15 points)
    readingLevel: 10, // Reading level match weight (10 points)
    bookLength: 10    // Book length match weight (10 points)
  },
  thresholds: {
    strongMatch: 80,
    moderateMatch: 50,
    minimumDisplayThreshold: 15
  },
  ruleSynergyBonus: 5 // Bonus points for high synergy multi-rule matches
};

module.exports = scoringConfig;
