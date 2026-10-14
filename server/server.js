const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  BookWise Server running on http://localhost:${PORT}`);
  console.log(`  Mode: Rule-Based Recommendation Engine`);
  console.log(`  Database: None (Predefined JavaScript Knowledge Base)`);
  console.log(`===============================================`);
});
