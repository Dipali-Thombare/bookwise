/**
 * Request Validation Middleware for Recommendation Inputs
 */

const VALID_GENRES = [
  "Fiction", "Mystery", "Thriller", "Fantasy", "Science Fiction",
  "Romance", "Self-Help", "Biography", "History", "Technology",
  "Business", "Adventure"
];

const VALID_LANGUAGES = ["English", "Hindi", "Marathi"];
const VALID_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const VALID_GOALS = [
  "Entertainment", "Personal Development", "Academic Learning",
  "Career Growth", "General Knowledge"
];
const VALID_LENGTHS = ["Short", "Medium", "Long"];

function validatePreferences(req, res, next) {
  const { genres, language, readingLevel, readingGoal, bookLength } = req.body;

  // At least one preference should be selected
  const hasGenre = Array.isArray(genres) ? genres.length > 0 : !!genres;
  if (!hasGenre && !language && !readingLevel && !readingGoal && !bookLength) {
    return res.status(400).json({
      success: false,
      message: "Please select at least one reading preference to generate recommendations."
    });
  }

  // Validate genres if present
  if (genres) {
    const genreList = Array.isArray(genres) ? genres : [genres];
    const invalidGenres = genreList.filter(
      (g) => !VALID_GENRES.some((vg) => vg.toLowerCase() === g.toLowerCase())
    );
    if (invalidGenres.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid genre(s) specified: ${invalidGenres.join(", ")}. Valid options: ${VALID_GENRES.join(", ")}`
      });
    }
  }

  // Validate language if present
  if (language && !VALID_LANGUAGES.some((vl) => vl.toLowerCase() === language.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid language '${language}'. Allowed: ${VALID_LANGUAGES.join(", ")}`
    });
  }

  // Validate readingLevel if present
  if (readingLevel && !VALID_LEVELS.some((vl) => vl.toLowerCase() === readingLevel.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid readingLevel '${readingLevel}'. Allowed: ${VALID_LEVELS.join(", ")}`
    });
  }

  // Validate readingGoal if present
  if (readingGoal && !VALID_GOALS.some((vg) => vg.toLowerCase() === readingGoal.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid readingGoal '${readingGoal}'. Allowed: ${VALID_GOALS.join(", ")}`
    });
  }

  // Validate bookLength if present
  if (bookLength && !VALID_LENGTHS.some((vl) => vl.toLowerCase() === bookLength.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid bookLength '${bookLength}'. Allowed: ${VALID_LENGTHS.join(", ")}`
    });
  }

  next();
}

module.exports = {
  validatePreferences,
  VALID_GENRES,
  VALID_LANGUAGES,
  VALID_LEVELS,
  VALID_GOALS,
  VALID_LENGTHS
};
