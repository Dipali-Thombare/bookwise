/**
 * BookWise Rule-Based Recommendation Engine
 * 
 * Implements:
 * 1. Knowledge Base Integration (books data)
 * 2. Rule Base Integration (declarative IF-THEN rules)
 * 3. Inference Engine (Forward Chaining evaluation and deterministic scoring)
 * 4. Explanation Module (transparent, explainable AI reasoning)
 */

const booksKnowledgeBase = require("../data/books");
const ruleBase = require("../rules/recommendationRules");
const scoringConfig = require("../config/scoringConfig");

class RecommendationEngine {
  constructor(books = booksKnowledgeBase, rules = ruleBase, config = scoringConfig) {
    this.knowledgeBase = books;
    this.ruleBase = rules;
    this.config = config;
  }

  /**
   * Explanation Module
   * Constructs human-readable explanation for why a book is recommended.
   */
  generateExplanation(matchedCriteria, triggeredRules, book, facts) {
    const reasons = [];

    if (matchedCriteria.genre) {
      reasons.push(`${book.genre} as your preferred genre`);
    }
    if (matchedCriteria.readingGoal) {
      reasons.push(`${facts.readingGoal} as your reading goal`);
    }
    if (matchedCriteria.language) {
      reasons.push(`${facts.language} language`);
    }
    if (matchedCriteria.readingLevel) {
      reasons.push(`${facts.readingLevel} reading level`);
    }
    if (matchedCriteria.bookLength) {
      reasons.push(`${facts.bookLength} book length`);
    }

    let summaryText = "";
    if (reasons.length > 0) {
      summaryText = `Recommended because you selected ${reasons.slice(0, 2).join(" and ")}${reasons.length > 2 ? `, matching ${reasons.length} of your criteria` : ""}.`;
    } else {
      summaryText = `Recommended as an adjacent discovery matching some of your reading interests.`;
    }

    const ruleExplanations = triggeredRules.map(r => r.explanation);

    return {
      summary: summaryText,
      matchedAttributes: matchedCriteria,
      ruleExplanations,
      ruleNames: triggeredRules.map(r => r.name)
    };
  }

  /**
   * Inference Engine
   * Evaluates facts against candidate books using forward chaining rules and deterministic scoring.
   * 
   * @param {Object} preferences User input facts
   * @returns {Array} Ranked recommendations with scores and explanations
   */
  evaluate(preferences = {}) {
    const facts = {
      genres: Array.isArray(preferences.genres) ? preferences.genres : (preferences.genres ? [preferences.genres] : []),
      language: preferences.language || "",
      readingLevel: preferences.readingLevel || "",
      readingGoal: preferences.readingGoal || "",
      bookLength: preferences.bookLength || ""
    };

    const evaluatedBooks = this.knowledgeBase.map((book) => {
      let baseScore = 0;
      const scoreBreakdown = {
        genrePoints: 0,
        goalPoints: 0,
        languagePoints: 0,
        levelPoints: 0,
        lengthPoints: 0,
        bonusPoints: 0
      };

      const matchedCriteria = {
        genre: false,
        readingGoal: false,
        language: false,
        readingLevel: false,
        bookLength: false
      };

      // 1. Evaluate Genre (40 points)
      if (facts.genres.length > 0) {
        const matchesGenre = facts.genres.some(
          (g) => g.toLowerCase() === book.genre.toLowerCase()
        );
        if (matchesGenre) {
          matchedCriteria.genre = true;
          scoreBreakdown.genrePoints = this.config.weights.genre;
          baseScore += scoreBreakdown.genrePoints;
        }
      }

      // 2. Evaluate Reading Goal (25 points)
      if (facts.readingGoal && Array.isArray(book.readingGoals)) {
        const matchesGoal = book.readingGoals.some(
          (rg) => rg.toLowerCase() === facts.readingGoal.toLowerCase()
        );
        if (matchesGoal) {
          matchedCriteria.readingGoal = true;
          scoreBreakdown.goalPoints = this.config.weights.readingGoal;
          baseScore += scoreBreakdown.goalPoints;
        }
      }

      // 3. Evaluate Language (15 points)
      if (facts.language && book.language) {
        if (book.language.toLowerCase() === facts.language.toLowerCase()) {
          matchedCriteria.language = true;
          scoreBreakdown.languagePoints = this.config.weights.language;
          baseScore += scoreBreakdown.languagePoints;
        }
      }

      // 4. Evaluate Reading Level (10 points)
      if (facts.readingLevel && book.readingLevel) {
        if (book.readingLevel.toLowerCase() === facts.readingLevel.toLowerCase()) {
          matchedCriteria.readingLevel = true;
          scoreBreakdown.levelPoints = this.config.weights.readingLevel;
          baseScore += scoreBreakdown.levelPoints;
        }
      }

      // 5. Evaluate Book Length (10 points)
      if (facts.bookLength && book.lengthCategory) {
        if (book.lengthCategory.toLowerCase() === facts.bookLength.toLowerCase()) {
          matchedCriteria.bookLength = true;
          scoreBreakdown.lengthPoints = this.config.weights.bookLength;
          baseScore += scoreBreakdown.lengthPoints;
        }
      }

      // ==========================================================
      // FORWARD CHAINING INFERENCE: Evaluate Rule Base
      // ==========================================================
      const triggeredRules = [];
      let ruleBonus = 0;

      for (const rule of this.ruleBase) {
        if (typeof rule.condition === "function" && rule.condition(facts, book)) {
          const explanation = rule.getExplanation ? rule.getExplanation(facts, book) : rule.description;
          triggeredRules.push({
            id: rule.id,
            name: rule.name,
            explanation,
            bonus: rule.bonusScore || 0
          });
          ruleBonus += (rule.bonusScore || 0);
        }
      }

      scoreBreakdown.bonusPoints = ruleBonus;

      // Final score calculation with cap at 100
      let totalScore = baseScore;
      if (baseScore > 0 && baseScore < this.config.maxScore) {
        totalScore = Math.min(this.config.maxScore, baseScore + Math.min(10, ruleBonus));
      } else if (baseScore >= this.config.maxScore) {
        totalScore = this.config.maxScore;
      }

      const matchPercentage = Math.round(totalScore);

      // Generate transparent explanation
      const explanation = this.generateExplanation(matchedCriteria, triggeredRules, book, facts);

      return {
        ...book,
        score: totalScore,
        matchPercentage,
        scoreBreakdown,
        triggeredRules,
        explanation
      };
    });

    // Rank from highest to lowest score, breaking ties by triggered rules then rating
    evaluatedBooks.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.triggeredRules.length !== a.triggeredRules.length) {
        return b.triggeredRules.length - a.triggeredRules.length;
      }
      return b.rating - a.rating;
    });

    // Check if we have strong or moderate matches
    const relevantBooks = evaluatedBooks.filter(
      (b) => b.score >= this.config.thresholds.minimumDisplayThreshold
    );

    // If no books pass minimum threshold, return top 6 closest matches with an explanation flag
    const isFallback = relevantBooks.length === 0;
    const finalResults = isFallback ? evaluatedBooks.slice(0, 6) : relevantBooks;

    return {
      recommendations: finalResults,
      totalCount: finalResults.length,
      isClosestMatch: isFallback,
      appliedPreferences: facts,
      maxPossibleScore: this.config.maxScore
    };
  }

  /**
   * Search books by keyword in title, author, description, or genre
   */
  searchBooks(query) {
    if (!query || typeof query !== "string") return this.knowledgeBase;
    const cleanQuery = query.trim().toLowerCase();
    return this.knowledgeBase.filter(
      (book) =>
        book.title.toLowerCase().includes(cleanQuery) ||
        book.author.toLowerCase().includes(cleanQuery) ||
        book.genre.toLowerCase().includes(cleanQuery) ||
        book.description.toLowerCase().includes(cleanQuery)
    );
  }

  /**
   * Filter books by genre
   */
  filterByGenre(genre) {
    if (!genre) return this.knowledgeBase;
    return this.knowledgeBase.filter(
      (b) => b.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  /**
   * Get single book by ID
   */
  getBookById(id) {
    return this.knowledgeBase.find((b) => b.id === id);
  }

  /**
   * Get similar books based on shared genre and language
   */
  getSimilarBooks(bookId, limit = 4) {
    const target = this.getBookById(bookId);
    if (!target) return [];

    return this.knowledgeBase
      .filter((b) => b.id !== bookId)
      .map((b) => {
        let similarity = 0;
        if (b.genre.toLowerCase() === target.genre.toLowerCase()) similarity += 50;
        if (b.language.toLowerCase() === target.language.toLowerCase()) similarity += 25;
        if (b.readingLevel.toLowerCase() === target.readingLevel.toLowerCase()) similarity += 15;
        if (b.lengthCategory.toLowerCase() === target.lengthCategory.toLowerCase()) similarity += 10;
        return { ...b, similarityScore: similarity };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);
  }
}

module.exports = new RecommendationEngine();
