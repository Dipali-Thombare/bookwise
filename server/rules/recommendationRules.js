/**
 * BookWise Rule Base
 * 
 * Formal IF-THEN rules used by the Inference Engine for Forward Chaining
 * and transparent explanation generation.
 */

const rules = [
  {
    id: "RULE_01_FANTASY_ENTERTAINMENT",
    name: "Fantasy Entertainment Synergy",
    description: "IF genre = Fantasy AND reading goal = Entertainment THEN recommend fantasy entertainment books",
    condition: (facts, book) => {
      const genres = facts.genres || [];
      const hasFantasy = genres.some(g => g.toLowerCase() === "fantasy");
      const isBookFantasy = book.genre.toLowerCase() === "fantasy";
      const goalMatches = facts.readingGoal && 
        book.readingGoals.some(rg => rg.toLowerCase() === facts.readingGoal.toLowerCase()) && 
        facts.readingGoal.toLowerCase() === "entertainment";
      return hasFantasy && isBookFantasy && goalMatches;
    },
    bonusScore: 5,
    getExplanation: (facts, book) =>
      `Matched Rule 1: Recommended because you selected Fantasy as your preferred genre and Entertainment as your reading goal.`
  },

  {
    id: "RULE_02_SELF_HELP_PERSONAL_DEV",
    name: "Self-Help Growth Alignment",
    description: "IF genre = Self-Help AND reading goal = Personal Development THEN recommend self-help books",
    condition: (facts, book) => {
      const genres = facts.genres || [];
      const hasSelfHelp = genres.some(g => g.toLowerCase() === "self-help");
      const isBookSelfHelp = book.genre.toLowerCase() === "self-help";
      const goalMatches = facts.readingGoal && 
        book.readingGoals.some(rg => rg.toLowerCase() === facts.readingGoal.toLowerCase()) && 
        facts.readingGoal.toLowerCase() === "personal development";
      return hasSelfHelp && isBookSelfHelp && goalMatches;
    },
    bonusScore: 5,
    getExplanation: (facts, book) =>
      `Matched Rule 2: Recommended because you selected Self-Help to pursue Personal Development goals.`
  },

  {
    id: "RULE_03_TECH_ACADEMIC_BEGINNER",
    name: "Beginner Technology Pedagogy",
    description: "IF genre = Technology AND reading goal = Academic Learning AND reading level = Beginner THEN recommend beginner-friendly technology books",
    condition: (facts, book) => {
      const genres = facts.genres || [];
      const hasTech = genres.some(g => g.toLowerCase() === "technology");
      const isBookTech = book.genre.toLowerCase() === "technology";
      const isAcademic = facts.readingGoal && 
        facts.readingGoal.toLowerCase() === "academic learning" && 
        book.readingGoals.some(rg => rg.toLowerCase() === "academic learning");
      const isBeginner = facts.readingLevel && 
        facts.readingLevel.toLowerCase() === "beginner" && 
        book.readingLevel.toLowerCase() === "beginner";
      return hasTech && isBookTech && isAcademic && isBeginner;
    },
    bonusScore: 8,
    getExplanation: (facts, book) =>
      `Matched Rule 3: Recommended because you are a Beginner seeking Academic Learning in Technology.`
  },

  {
    id: "RULE_04_MYSTERY_ENTERTAINMENT",
    name: "Mystery Entertainment Thrill",
    description: "IF genre = Mystery AND reading goal = Entertainment THEN recommend mystery novels",
    condition: (facts, book) => {
      const genres = facts.genres || [];
      const hasMystery = genres.some(g => g.toLowerCase() === "mystery");
      const isBookMystery = book.genre.toLowerCase() === "mystery";
      const goalMatches = facts.readingGoal && 
        book.readingGoals.some(rg => rg.toLowerCase() === facts.readingGoal.toLowerCase()) && 
        facts.readingGoal.toLowerCase() === "entertainment";
      return hasMystery && isBookMystery && goalMatches;
    },
    bonusScore: 5,
    getExplanation: (facts, book) =>
      `Matched Rule 4: Recommended because you enjoy Mystery novels for gripping Entertainment.`
  },

  {
    id: "RULE_05_REGIONAL_LANGUAGE_PRIORITY",
    name: "Language Heritage Prioritization",
    description: "IF user selects a specific language THEN prioritize authentic literature available in that language",
    condition: (facts, book) => {
      if (!facts.language) return false;
      return book.language.toLowerCase() === facts.language.toLowerCase();
    },
    bonusScore: 5,
    getExplanation: (facts, book) =>
      `Matched Rule 5: Prioritized because this title is written in your selected language (${book.language}).`
  },

  {
    id: "RULE_06_ADVANCED_CAREER_GROWTH",
    name: "Advanced Professional Development",
    description: "IF reading level = Advanced AND reading goal = Career Growth THEN recommend advanced business and professional development books",
    condition: (facts, book) => {
      const isAdvanced = facts.readingLevel && facts.readingLevel.toLowerCase() === "advanced" && book.readingLevel.toLowerCase() === "advanced";
      const isCareer = facts.readingGoal && 
        facts.readingGoal.toLowerCase() === "career growth" && 
        book.readingGoals.some(rg => rg.toLowerCase() === "career growth");
      const isProGenre = ["business", "technology", "self-help"].includes(book.genre.toLowerCase());
      return isAdvanced && isCareer && isProGenre;
    },
    bonusScore: 7,
    getExplanation: (facts, book) =>
      `Matched Rule 6: Recommended because of your Advanced reading level paired with Career Growth aspirations.`
  },

  {
    id: "RULE_07_MULTI_PREFERENCE_SYNERGY",
    name: "Multi-Preference Harmony Bonus",
    description: "IF 4 or more preference criteria match a book THEN assign higher recommendation score",
    condition: (facts, book) => {
      let matches = 0;
      if (facts.genres && facts.genres.some(g => g.toLowerCase() === book.genre.toLowerCase())) matches++;
      if (facts.language && facts.language.toLowerCase() === book.language.toLowerCase()) matches++;
      if (facts.readingLevel && facts.readingLevel.toLowerCase() === book.readingLevel.toLowerCase()) matches++;
      if (facts.readingGoal && book.readingGoals.some(rg => rg.toLowerCase() === facts.readingGoal.toLowerCase())) matches++;
      if (facts.bookLength && facts.bookLength.toLowerCase() === book.lengthCategory.toLowerCase()) matches++;
      return matches >= 4;
    },
    bonusScore: 5,
    getExplanation: (facts, book) =>
      `Matched Rule 7: High Synergy Match! Four or more of your exact reading criteria perfectly match this book.`
  },

  {
    id: "RULE_08_HISTORY_GENERAL_KNOWLEDGE",
    name: "Historical Insight",
    description: "IF genre = History AND reading goal = General Knowledge THEN recommend historical deep dives",
    condition: (facts, book) => {
      const genres = facts.genres || [];
      const hasHistory = genres.some(g => g.toLowerCase() === "history");
      const isBookHistory = book.genre.toLowerCase() === "history";
      const isGK = facts.readingGoal && 
        facts.readingGoal.toLowerCase() === "general knowledge" && 
        book.readingGoals.some(rg => rg.toLowerCase() === "general knowledge");
      return hasHistory && isBookHistory && isGK;
    },
    bonusScore: 5,
    getExplanation: (facts, book) =>
      `Matched Rule 8: Recommended because you selected History for General Knowledge enrichment.`
  },

  {
    id: "RULE_09_SCI_FI_ACADEMIC_ENTERTAINMENT",
    name: "Sci-Fi Speculative Learning",
    description: "IF genre = Science Fiction AND reading goal in [Academic Learning, Entertainment] THEN recommend speculative fiction",
    condition: (facts, book) => {
      const genres = facts.genres || [];
      const hasSciFi = genres.some(g => g.toLowerCase() === "science fiction");
      const isBookSciFi = book.genre.toLowerCase() === "science fiction";
      const goalMatches = facts.readingGoal && 
        book.readingGoals.some(rg => rg.toLowerCase() === facts.readingGoal.toLowerCase());
      return hasSciFi && isBookSciFi && goalMatches;
    },
    bonusScore: 5,
    getExplanation: (facts, book) =>
      `Matched Rule 9: Recommended because you seek Science Fiction for imaginative perspective.`
  },

  {
    id: "RULE_10_BIOGRAPHY_PERSONAL_DEV",
    name: "Biographical Life Inspiration",
    description: "IF genre = Biography AND reading goal = Personal Development THEN recommend inspiring real-life memoirs",
    condition: (facts, book) => {
      const genres = facts.genres || [];
      const hasBio = genres.some(g => g.toLowerCase() === "biography");
      const isBookBio = book.genre.toLowerCase() === "biography";
      const goalMatches = facts.readingGoal && 
        facts.readingGoal.toLowerCase() === "personal development" && 
        book.readingGoals.some(rg => rg.toLowerCase() === "personal development");
      return hasBio && isBookBio && goalMatches;
    },
    bonusScore: 5,
    getExplanation: (facts, book) =>
      `Matched Rule 10: Recommended because inspiring Biographies align directly with your Personal Development goal.`
  }
];

module.exports = rules;
