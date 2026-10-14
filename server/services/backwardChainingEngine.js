/**
 * Backward Chaining Inference Engine
 * 
 * Classical AI Concept: Goal-Driven (Top-Down) Reasoning
 * 
 * In contrast to Forward Chaining (which starts from user facts and scans all books),
 * Backward Chaining starts with a specific Hypothesis / Goal:
 *   Goal: "Should we recommend Book X (title) to the reader?"
 * 
 * It decomposes this Goal backwards into requisite antecedent sub-goals:
 *   - Sub-Goal 1: Genre Compatibility (Is book.genre accepted by user?)
 *   - Sub-Goal 2: Reading Goal Alignment (Does book.readingGoals fulfill user's goal?)
 *   - Sub-Goal 3: Language Match (Is book.language the user's preferred language?)
 *   - Sub-Goal 4: Reading Level Suitability (Is book.readingLevel appropriate?)
 *   - Sub-Goal 5: Length Preference (Does book.lengthCategory match?)
 *   - Sub-Goal 6: Domain Rule Synergies (Backward proof of heuristic IF-THEN rules)
 * 
 * For each sub-goal, it evaluates proof status:
 *   - PROVEN: Ground fact provided and satisfies the sub-goal
 *   - CONFLICT: Ground fact provided but contradicts the sub-goal
 *   - UNKNOWN: Fact not yet provided by the user (Missing Evidence)
 * 
 * Generates an Explainable Proof Tree with deductive reasoning steps and
 * identifies next questions to prove or disprove the hypothesis.
 */

const booksKnowledgeBase = require("../data/books");
const ruleBase = require("../rules/recommendationRules");
const scoringConfig = require("../config/scoringConfig");

class BackwardChainingEngine {
  constructor(books = booksKnowledgeBase, rules = ruleBase, config = scoringConfig) {
    this.knowledgeBase = books;
    this.ruleBase = rules;
    this.config = config;
  }

  /**
   * Evaluates a single book hypothesis using backward chaining.
   * 
   * @param {string} bookId Target book ID to verify as recommendation goal
   * @param {Object} userFacts Ground facts provided by user (can be partial or full)
   * @returns {Object} Proof tree, status, confidence score, missing evidence, and deduction steps
   */
  verifyBookHypothesis(bookId, userFacts = {}) {
    const book = this.knowledgeBase.find((b) => b.id === bookId);
    if (!book) {
      throw new Error(`Target hypothesis book with ID '${bookId}' does not exist in knowledge base.`);
    }

    // Normalize facts
    const facts = {
      genres: Array.isArray(userFacts.genres) 
        ? userFacts.genres 
        : (userFacts.genres ? [userFacts.genres] : []),
      language: userFacts.language ? String(userFacts.language).trim() : "",
      readingLevel: userFacts.readingLevel ? String(userFacts.readingLevel).trim() : "",
      readingGoal: userFacts.readingGoal ? String(userFacts.readingGoal).trim() : "",
      bookLength: userFacts.bookLength ? String(userFacts.bookLength).trim() : ""
    };

    const deductionSteps = [];
    deductionSteps.push({
      step: 1,
      type: "GOAL_FORMULATION",
      message: `Formulated Root Goal: Prove Recommend("${book.title}") for reader profile.`
    });

    const subGoals = [];
    let provenPoints = 0;
    let maxEvaluatedPoints = 0;
    const missingEvidence = [];
    const conflicts = [];

    // =========================================================================
    // SUB-GOAL 1: Genre Constraint (Weight: 40)
    // Rule: IF book.genre in user.genres THEN Genre Constraint PROVEN
    // =========================================================================
    const genreWeight = this.config.weights.genre;
    if (facts.genres.length === 0) {
      subGoals.push({
        id: "SG_GENRE",
        name: "Genre Compatibility",
        required: book.genre,
        provided: null,
        status: "UNKNOWN",
        weight: genreWeight,
        pointsEarned: 0,
        explanation: `User has not specified preferred genres. Missing evidence: requires "${book.genre}".`
      });
      missingEvidence.push({
        attribute: "genres",
        prompt: `Do you enjoy ${book.genre} literature?`,
        expectedValue: book.genre,
        weight: genreWeight
      });
      deductionSteps.push({
        step: 2,
        subGoal: "SG_GENRE",
        status: "UNKNOWN",
        message: `Backtracking to Sub-goal 1 (Genre): Missing ground fact for genre "${book.genre}". Evidence needed.`
      });
    } else {
      maxEvaluatedPoints += genreWeight;
      const matches = facts.genres.some((g) => g.toLowerCase() === book.genre.toLowerCase());
      if (matches) {
        provenPoints += genreWeight;
        subGoals.push({
          id: "SG_GENRE",
          name: "Genre Compatibility",
          required: book.genre,
          provided: facts.genres.join(", "),
          status: "PROVEN",
          weight: genreWeight,
          pointsEarned: genreWeight,
          explanation: `Proven: User selected "${book.genre}", matching the book's primary genre.`
        });
        deductionSteps.push({
          step: 2,
          subGoal: "SG_GENRE",
          status: "PROVEN",
          message: `Backtracking to Sub-goal 1 (Genre): Fact matches "${book.genre}". Sub-goal PROVEN (+${genreWeight} pts).`
        });
      } else {
        conflicts.push(`Preferred genre is ${facts.genres.join(", ")}, but this book is ${book.genre}.`);
        subGoals.push({
          id: "SG_GENRE",
          name: "Genre Compatibility",
          required: book.genre,
          provided: facts.genres.join(", "),
          status: "CONFLICT",
          weight: genreWeight,
          pointsEarned: 0,
          explanation: `Conflict: User selected [${facts.genres.join(", ")}], but this book is strictly categorized under "${book.genre}".`
        });
        deductionSteps.push({
          step: 2,
          subGoal: "SG_GENRE",
          status: "CONFLICT",
          message: `Backtracking to Sub-goal 1 (Genre): Contradiction detected. Book is "${book.genre}", user prefers [${facts.genres.join(", ")}].`
        });
      }
    }

    // =========================================================================
    // SUB-GOAL 2: Reading Goal Alignment (Weight: 25)
    // Rule: IF user.readingGoal in book.readingGoals THEN Reading Goal PROVEN
    // =========================================================================
    const goalWeight = this.config.weights.readingGoal;
    if (!facts.readingGoal) {
      subGoals.push({
        id: "SG_READING_GOAL",
        name: "Reading Goal Alignment",
        required: book.readingGoals.join(" OR "),
        provided: null,
        status: "UNKNOWN",
        weight: goalWeight,
        pointsEarned: 0,
        explanation: `User reading goal unknown. Missing evidence: requires one of [${book.readingGoals.join(", ")}].`
      });
      missingEvidence.push({
        attribute: "readingGoal",
        prompt: `Is your reading objective one of: ${book.readingGoals.join(", ")}?`,
        expectedValue: book.readingGoals[0],
        options: book.readingGoals,
        weight: goalWeight
      });
      deductionSteps.push({
        step: 3,
        subGoal: "SG_READING_GOAL",
        status: "UNKNOWN",
        message: `Backtracking to Sub-goal 2 (Reading Goal): Fact unknown. Goal alignment requires [${book.readingGoals.join(", ")}].`
      });
    } else {
      maxEvaluatedPoints += goalWeight;
      const matches = book.readingGoals.some((rg) => rg.toLowerCase() === facts.readingGoal.toLowerCase());
      if (matches) {
        provenPoints += goalWeight;
        subGoals.push({
          id: "SG_READING_GOAL",
          name: "Reading Goal Alignment",
          required: book.readingGoals.join(" OR "),
          provided: facts.readingGoal,
          status: "PROVEN",
          weight: goalWeight,
          pointsEarned: goalWeight,
          explanation: `Proven: User goal "${facts.readingGoal}" aligns with book's goals [${book.readingGoals.join(", ")}].`
        });
        deductionSteps.push({
          step: 3,
          subGoal: "SG_READING_GOAL",
          status: "PROVEN",
          message: `Backtracking to Sub-goal 2 (Reading Goal): User goal "${facts.readingGoal}" matches book profile (+${goalWeight} pts).`
        });
      } else {
        conflicts.push(`Reading goal is "${facts.readingGoal}", but this book serves [${book.readingGoals.join(", ")}].`);
        subGoals.push({
          id: "SG_READING_GOAL",
          name: "Reading Goal Alignment",
          required: book.readingGoals.join(" OR "),
          provided: facts.readingGoal,
          status: "CONFLICT",
          weight: goalWeight,
          pointsEarned: 0,
          explanation: `Conflict: User goal is "${facts.readingGoal}", which does not align with book goals [${book.readingGoals.join(", ")}].`
        });
        deductionSteps.push({
          step: 3,
          subGoal: "SG_READING_GOAL",
          status: "CONFLICT",
          message: `Backtracking to Sub-goal 2 (Reading Goal): Conflict with "${facts.readingGoal}".`
        });
      }
    }

    // =========================================================================
    // SUB-GOAL 3: Language Match (Weight: 15)
    // Rule: IF user.language == book.language THEN Language PROVEN
    // =========================================================================
    const langWeight = this.config.weights.language;
    if (!facts.language) {
      subGoals.push({
        id: "SG_LANGUAGE",
        name: "Language Heritage",
        required: book.language,
        provided: null,
        status: "UNKNOWN",
        weight: langWeight,
        pointsEarned: 0,
        explanation: `User language preference unknown. Missing evidence: requires "${book.language}".`
      });
      missingEvidence.push({
        attribute: "language",
        prompt: `Can you read books published in ${book.language}?`,
        expectedValue: book.language,
        weight: langWeight
      });
      deductionSteps.push({
        step: 4,
        subGoal: "SG_LANGUAGE",
        status: "UNKNOWN",
        message: `Backtracking to Sub-goal 3 (Language): Missing ground fact for "${book.language}".`
      });
    } else {
      maxEvaluatedPoints += langWeight;
      const matches = book.language.toLowerCase() === facts.language.toLowerCase();
      if (matches) {
        provenPoints += langWeight;
        subGoals.push({
          id: "SG_LANGUAGE",
          name: "Language Heritage",
          required: book.language,
          provided: facts.language,
          status: "PROVEN",
          weight: langWeight,
          pointsEarned: langWeight,
          explanation: `Proven: User requested "${facts.language}", exactly matching the book's edition.`
        });
        deductionSteps.push({
          step: 4,
          subGoal: "SG_LANGUAGE",
          status: "PROVEN",
          message: `Backtracking to Sub-goal 3 (Language): "${facts.language}" matches book edition (+${langWeight} pts).`
        });
      } else {
        conflicts.push(`Language requested is ${facts.language}, but book is written in ${book.language}.`);
        subGoals.push({
          id: "SG_LANGUAGE",
          name: "Language Heritage",
          required: book.language,
          provided: facts.language,
          status: "CONFLICT",
          weight: langWeight,
          pointsEarned: 0,
          explanation: `Conflict: User requested "${facts.language}", but this book is written in "${book.language}".`
        });
        deductionSteps.push({
          step: 4,
          subGoal: "SG_LANGUAGE",
          status: "CONFLICT",
          message: `Backtracking to Sub-goal 3 (Language): Incompatible language "${facts.language}" vs "${book.language}".`
        });
      }
    }

    // =========================================================================
    // SUB-GOAL 4: Reading Level Suitability (Weight: 10)
    // Rule: IF user.readingLevel == book.readingLevel THEN Level PROVEN
    // =========================================================================
    const levelWeight = this.config.weights.readingLevel;
    if (!facts.readingLevel) {
      subGoals.push({
        id: "SG_READING_LEVEL",
        name: "Reading Level Suitability",
        required: book.readingLevel,
        provided: null,
        status: "UNKNOWN",
        weight: levelWeight,
        pointsEarned: 0,
        explanation: `User reading level unknown. Missing evidence: requires "${book.readingLevel}".`
      });
      missingEvidence.push({
        attribute: "readingLevel",
        prompt: `Is your reading level ${book.readingLevel}?`,
        expectedValue: book.readingLevel,
        weight: levelWeight
      });
      deductionSteps.push({
        step: 5,
        subGoal: "SG_READING_LEVEL",
        status: "UNKNOWN",
        message: `Backtracking to Sub-goal 4 (Reading Level): Level unknown, requires "${book.readingLevel}".`
      });
    } else {
      maxEvaluatedPoints += levelWeight;
      const matches = book.readingLevel.toLowerCase() === facts.readingLevel.toLowerCase();
      if (matches) {
        provenPoints += levelWeight;
        subGoals.push({
          id: "SG_READING_LEVEL",
          name: "Reading Level Suitability",
          required: book.readingLevel,
          provided: facts.readingLevel,
          status: "PROVEN",
          weight: levelWeight,
          pointsEarned: levelWeight,
          explanation: `Proven: User reading level "${facts.readingLevel}" matches book complexity.`
        });
        deductionSteps.push({
          step: 5,
          subGoal: "SG_READING_LEVEL",
          status: "PROVEN",
          message: `Backtracking to Sub-goal 4 (Reading Level): Matched "${facts.readingLevel}" (+${levelWeight} pts).`
        });
      } else {
        conflicts.push(`Reading level is ${facts.readingLevel}, but book is ${book.readingLevel}.`);
        subGoals.push({
          id: "SG_READING_LEVEL",
          name: "Reading Level Suitability",
          required: book.readingLevel,
          provided: facts.readingLevel,
          status: "CONFLICT",
          weight: levelWeight,
          pointsEarned: 0,
          explanation: `Minor conflict: User selected "${facts.readingLevel}", while book is calibrated for "${book.readingLevel}".`
        });
        deductionSteps.push({
          step: 5,
          subGoal: "SG_READING_LEVEL",
          status: "CONFLICT",
          message: `Backtracking to Sub-goal 4 (Reading Level): Level discrepancy ("${facts.readingLevel}" vs "${book.readingLevel}").`
        });
      }
    }

    // =========================================================================
    // SUB-GOAL 5: Book Length Preference (Weight: 10)
    // Rule: IF user.bookLength == book.lengthCategory THEN Length PROVEN
    // =========================================================================
    const lengthWeight = this.config.weights.bookLength;
    if (!facts.bookLength) {
      subGoals.push({
        id: "SG_BOOK_LENGTH",
        name: "Length Preference",
        required: book.lengthCategory,
        provided: null,
        status: "UNKNOWN",
        weight: lengthWeight,
        pointsEarned: 0,
        explanation: `User length preference unknown. Missing evidence: requires "${book.lengthCategory}".`
      });
      missingEvidence.push({
        attribute: "bookLength",
        prompt: `Do you prefer ${book.lengthCategory} books (~${book.pageCount} pages)?`,
        expectedValue: book.lengthCategory,
        weight: lengthWeight
      });
      deductionSteps.push({
        step: 6,
        subGoal: "SG_BOOK_LENGTH",
        status: "UNKNOWN",
        message: `Backtracking to Sub-goal 5 (Length): Length preference unknown, book is "${book.lengthCategory}".`
      });
    } else {
      maxEvaluatedPoints += lengthWeight;
      const matches = book.lengthCategory.toLowerCase() === facts.bookLength.toLowerCase();
      if (matches) {
        provenPoints += lengthWeight;
        subGoals.push({
          id: "SG_BOOK_LENGTH",
          name: "Length Preference",
          required: book.lengthCategory,
          provided: facts.bookLength,
          status: "PROVEN",
          weight: lengthWeight,
          pointsEarned: lengthWeight,
          explanation: `Proven: User preferred length "${facts.bookLength}" matches this edition (${book.pageCount} pages).`
        });
        deductionSteps.push({
          step: 6,
          subGoal: "SG_BOOK_LENGTH",
          status: "PROVEN",
          message: `Backtracking to Sub-goal 5 (Length): Matched length category "${facts.bookLength}" (+${lengthWeight} pts).`
        });
      } else {
        conflicts.push(`Preferred length is ${facts.bookLength}, but book is ${book.lengthCategory}.`);
        subGoals.push({
          id: "SG_BOOK_LENGTH",
          name: "Length Preference",
          required: book.lengthCategory,
          provided: facts.bookLength,
          status: "CONFLICT",
          weight: lengthWeight,
          pointsEarned: 0,
          explanation: `Minor conflict: User prefers "${facts.bookLength}" books, but this title is "${book.lengthCategory}".`
        });
        deductionSteps.push({
          step: 6,
          subGoal: "SG_BOOK_LENGTH",
          status: "CONFLICT",
          message: `Backtracking to Sub-goal 5 (Length): Length mismatch ("${facts.bookLength}" vs "${book.lengthCategory}").`
        });
      }
    }

    // =========================================================================
    // SUB-GOAL 6: Backward Rule Synergies (Evaluate Rules concluding target book)
    // =========================================================================
    const relevantRules = [];
    let ruleBonus = 0;

    for (const rule of this.ruleBase) {
      // Check if the rule condition is satisfied
      if (typeof rule.condition === "function") {
        const fires = rule.condition(facts, book);
        if (fires) {
          const bonus = rule.bonusScore || 0;
          ruleBonus += bonus;
          relevantRules.push({
            id: rule.id,
            name: rule.name,
            status: "FIRED",
            bonus,
            explanation: rule.getExplanation ? rule.getExplanation(facts, book) : rule.description
          });
          deductionSteps.push({
            step: deductionSteps.length + 1,
            type: "RULE_SYNERGY",
            ruleId: rule.id,
            message: `Backward Rule Fired: [${rule.name}] proved valid for target book (+${bonus} bonus).`
          });
        }
      }
    }

    // Calculate final proof confidence score
    let totalScore = provenPoints;
    if (provenPoints > 0 && provenPoints < this.config.maxScore) {
      totalScore = Math.min(this.config.maxScore, provenPoints + Math.min(10, ruleBonus));
    } else if (provenPoints >= this.config.maxScore) {
      totalScore = this.config.maxScore;
    }

    // Determine Proof Verdict
    let verdict = "UNTESTED";
    let verdictDescription = "";

    const provenSubgoalsCount = subGoals.filter((sg) => sg.status === "PROVEN").length;
    const conflictSubgoalsCount = subGoals.filter((sg) => sg.status === "CONFLICT").length;
    const unknownSubgoalsCount = subGoals.filter((sg) => sg.status === "UNKNOWN").length;

    if (totalScore >= this.config.thresholds.strongMatch) {
      verdict = "PROVEN";
      verdictDescription = `Hypothesis fully proven! The user's preferences strongly substantiate recommending "${book.title}" with a confidence score of ${totalScore}%.`;
    } else if (totalScore >= this.config.thresholds.moderateMatch) {
      verdict = "PARTIALLY_PROVEN";
      verdictDescription = `Hypothesis partially proven (${totalScore}% confidence). While several key criteria match, ${unknownSubgoalsCount > 0 ? `${unknownSubgoalsCount} preference(s) remain unconfirmed` : "some preferences differ"}.`;
    } else if (conflictSubgoalsCount >= 2 || (facts.genres.length > 0 && subGoals.find((s) => s.id === "SG_GENRE")?.status === "CONFLICT")) {
      verdict = "DISPROVED";
      verdictDescription = `Hypothesis disproved (${totalScore}% confidence). Fundamental preference conflicts contradict recommending "${book.title}".`;
    } else if (unknownSubgoalsCount >= 4) {
      verdict = "INCONCLUSIVE";
      verdictDescription = `Hypothesis inconclusive due to insufficient evidence. Provide additional preferences to prove compatibility with "${book.title}".`;
    } else {
      verdict = "PARTIALLY_PROVEN";
      verdictDescription = `Hypothesis moderately verified (${totalScore}% confidence).`;
    }

    deductionSteps.push({
      step: deductionSteps.length + 1,
      type: "PROOF_SYNTHESIS",
      message: `Backward Chaining Proof Completed: Verdict is ${verdict} (${totalScore}% confidence).`
    });

    return {
      hypothesis: {
        goal: `Recommend("${book.title}")`,
        bookId: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        language: book.language,
        readingLevel: book.readingLevel,
        readingGoals: book.readingGoals,
        lengthCategory: book.lengthCategory,
        rating: book.rating,
        coverImage: book.coverImage
      },
      verdict,
      verdictDescription,
      confidenceScore: totalScore,
      matchPercentage: Math.round(totalScore),
      stats: {
        totalSubgoals: subGoals.length,
        provenCount: provenSubgoalsCount,
        conflictCount: conflictSubgoalsCount,
        unknownCount: unknownSubgoalsCount,
        basePoints: provenPoints,
        bonusPoints: ruleBonus,
        maxPossiblePoints: this.config.maxScore
      },
      proofTree: {
        rootGoal: `Recommend("${book.title}")`,
        subGoals,
        rulesEvaluated: relevantRules
      },
      conflicts,
      missingEvidence,
      deductionSteps,
      appliedFacts: facts
    };
  }

  /**
   * Evaluates all candidate books as hypotheses and returns ranked proof statuses.
   * Identifies which hypotheses are fully proven and which are 1 fact away from being proven.
   * 
   * @param {Object} userFacts Ground facts provided by user
   * @returns {Object} Categorized hypotheses
   */
  findProvenHypotheses(userFacts = {}) {
    const verifiedList = this.knowledgeBase.map((book) => {
      return this.verifyBookHypothesis(book.id, userFacts);
    });

    // Sort by confidence score descending
    verifiedList.sort((a, b) => b.confidenceScore - a.confidenceScore);

    const proven = verifiedList.filter((r) => r.verdict === "PROVEN");
    const partiallyProven = verifiedList.filter((r) => r.verdict === "PARTIALLY_PROVEN");
    const disproved = verifiedList.filter((r) => r.verdict === "DISPROVED");

    // Hypotheses that can reach PROVEN status with just 1 more question answered
    const oneStepAway = partiallyProven.filter((r) => {
      return r.missingEvidence.length > 0 && 
             (r.confidenceScore + (r.missingEvidence[0]?.weight || 0) >= this.config.thresholds.strongMatch);
    });

    return {
      totalCandidatesEvaluated: verifiedList.length,
      provenCount: proven.length,
      partiallyProvenCount: partiallyProven.length,
      disprovedCount: disproved.length,
      proven,
      partiallyProven,
      oneStepAway,
      topCandidate: verifiedList[0] || null
    };
  }
}

module.exports = new BackwardChainingEngine();
