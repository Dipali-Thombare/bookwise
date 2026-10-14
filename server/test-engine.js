/**
 * Test Suite for BookWise Recommendation Engine & Knowledge Base
 * Covers both Forward Chaining and Backward Chaining Inference Engines
 */

const recommendationEngine = require("./services/recommendationEngine");
const backwardChainingEngine = require("./services/backwardChainingEngine");
const books = require("./data/books");

console.log(`Knowledge Base loaded with ${books.length} books.`);

console.log("\n========================================================");
console.log("FORWARD CHAINING TESTS (Data-Driven Inference)");
console.log("========================================================");

console.log("\n--- TEST CASE 1: Fantasy, English, Beginner, Entertainment ---");
const res1 = recommendationEngine.evaluate({
  genres: ["Fantasy"],
  language: "English",
  readingLevel: "Beginner",
  readingGoal: "Entertainment",
  bookLength: "Medium"
});
console.log(`Top recommendation: "${res1.recommendations[0].title}" by ${res1.recommendations[0].author}`);
console.log(`Score: ${res1.recommendations[0].score}%`);
console.log(`Explanation: ${res1.recommendations[0].explanation.summary}`);
console.log(`Triggered Rules:`, res1.recommendations[0].triggeredRules.map(r => r.name));

console.log("\n--- TEST CASE 2: Self-Help, English, Intermediate, Personal Development ---");
const res2 = recommendationEngine.evaluate({
  genres: ["Self-Help"],
  language: "English",
  readingLevel: "Intermediate",
  readingGoal: "Personal Development",
  bookLength: "Medium"
});
console.log(`Top recommendation: "${res2.recommendations[0].title}" by ${res2.recommendations[0].author}`);
console.log(`Score: ${res2.recommendations[0].score}%`);
console.log(`Explanation: ${res2.recommendations[0].explanation.summary}`);
console.log(`Triggered Rules:`, res2.recommendations[0].triggeredRules.map(r => r.name));

console.log("\n--- TEST CASE 3: Technology, English, Beginner, Academic Learning ---");
const res3 = recommendationEngine.evaluate({
  genres: ["Technology"],
  language: "English",
  readingLevel: "Beginner",
  readingGoal: "Academic Learning",
  bookLength: "Medium"
});
console.log(`Top recommendation: "${res3.recommendations[0].title}" by ${res3.recommendations[0].author}`);
console.log(`Score: ${res3.recommendations[0].score}%`);
console.log(`Explanation: ${res3.recommendations[0].explanation.summary}`);
console.log(`Triggered Rules:`, res3.recommendations[0].triggeredRules.map(r => r.name));

console.log("\n--- TEST CASE 4: Mystery, Marathi, Intermediate, Entertainment ---");
const res4 = recommendationEngine.evaluate({
  genres: ["Mystery"],
  language: "Marathi",
  readingLevel: "Intermediate",
  readingGoal: "Entertainment",
  bookLength: "Short"
});
console.log(`Top recommendation: "${res4.recommendations[0].title}" by ${res4.recommendations[0].author}`);
console.log(`Score: ${res4.recommendations[0].score}%`);
console.log(`Explanation: ${res4.recommendations[0].explanation.summary}`);
console.log(`Triggered Rules:`, res4.recommendations[0].triggeredRules.map(r => r.name));

console.log("\n--- TEST CASE 5: Fallback / Partial Match Scenario ---");
const res5 = recommendationEngine.evaluate({
  genres: ["Adventure"],
  language: "Marathi",
  readingLevel: "Beginner",
  readingGoal: "Career Growth",
  bookLength: "Short"
});
console.log(`Count of recommendations: ${res5.recommendations.length}, isClosestMatch: ${res5.isClosestMatch}`);
console.log(`Top recommendation: "${res5.recommendations[0].title}" - Score: ${res5.recommendations[0].score}%`);

console.log("\n========================================================");
console.log("BACKWARD CHAINING TESTS (Goal-Driven Inference)");
console.log("========================================================");

console.log("\n--- TEST BC 1: Fully Proving Goal Recommend('Atomic Habits') ---");
const bc1 = backwardChainingEngine.verifyBookHypothesis("b-015", {
  genres: ["Self-Help"],
  language: "English",
  readingLevel: "Beginner",
  readingGoal: "Personal Development",
  bookLength: "Medium"
});
console.log(`Goal: ${bc1.hypothesis.goal}`);
console.log(`Verdict: ${bc1.verdict} (${bc1.confidenceScore}% confidence)`);
console.log(`Sub-goals evaluated: ${bc1.proofTree.subGoals.length}`);
bc1.proofTree.subGoals.forEach(sg => {
  console.log(`  - [${sg.status}] ${sg.name}: ${sg.pointsEarned}/${sg.weight} pts -> ${sg.explanation}`);
});
console.log(`Rules Fired in Backward Trace:`, bc1.proofTree.rulesEvaluated.map(r => r.name));

console.log("\n--- TEST BC 2: Partial Evidence / Missing Ground Facts ---");
const bc2 = backwardChainingEngine.verifyBookHypothesis("b-003", {
  genres: ["Fantasy"],
  language: "English"
});
console.log(`Goal: ${bc2.hypothesis.goal}`);
console.log(`Verdict: ${bc2.verdict} (${bc2.confidenceScore}% confidence)`);
console.log(`Missing Evidence Count: ${bc2.missingEvidence.length}`);
bc2.missingEvidence.forEach(me => {
  console.log(`  - Query prompt: "${me.prompt}" (Expected: ${me.expectedValue}, Potential gain: +${me.weight} pts)`);
});

console.log("\n--- TEST BC 3: Contradicted Hypothesis (Conflict Detection) ---");
const bc3 = backwardChainingEngine.verifyBookHypothesis("b-003", {
  genres: ["History"], // Conflicts with Fantasy
  language: "Marathi"  // Conflicts with English
});
console.log(`Goal: ${bc3.hypothesis.goal}`);
console.log(`Verdict: ${bc3.verdict} (${bc3.confidenceScore}% confidence)`);
console.log(`Conflicts recorded:`, bc3.conflicts);

console.log("\n--- TEST BC 4: Hypothesis Search Across Knowledge Base ---");
const bcSearch = backwardChainingEngine.findProvenHypotheses({
  genres: ["Technology"],
  language: "English",
  readingLevel: "Beginner"
});
console.log(`Total candidates tested: ${bcSearch.totalCandidatesEvaluated}`);
console.log(`Fully Proven Hypotheses: ${bcSearch.provenCount}`);
console.log(`Partially Proven Hypotheses: ${bcSearch.partiallyProvenCount}`);
console.log(`Hypotheses 1 Step Away from Proof: ${bcSearch.oneStepAway.length}`);
if (bcSearch.oneStepAway.length > 0) {
  console.log(`  Example 1-step-away book: "${bcSearch.oneStepAway[0].hypothesis.title}" (Needs: ${bcSearch.oneStepAway[0].missingEvidence[0]?.attribute})`);
}

console.log("\n--- TEST SEARCH & GET ---");
const searchRes = recommendationEngine.searchBooks("Premchand");
console.log(`Search 'Premchand' matched ${searchRes.length} books:`, searchRes.map(b => b.title));

const bookDetails = recommendationEngine.getBookById("b-001");
console.log(`Book b-001 details: ${bookDetails.title}, similar count: ${recommendationEngine.getSimilarBooks("b-001").length}`);

console.log("\nAll Forward and Backward Chaining tests completed successfully!");
