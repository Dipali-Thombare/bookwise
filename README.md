# BookWise — Rule-Based Book Recommendation & Verification System

> **A deterministic, explainable AI book discovery system built with the MERN stack (without database dependencies), featuring both Forward Chaining and Backward Chaining inference engines.**
🚀 **Live Demo:** [https://bookwise-bay.vercel.app](https://bookwise-bay.vercel.app)

---

## 1. Project Overview

**BookWise** is an intelligent web application designed to recommend and verify books matching individual reader preferences. Unlike opaque machine learning or LLM-based black-box recommenders, BookWise implements a classic **Expert System Architecture** powered by dual inference paradigms:
1. **Forward Chaining (Data-Driven Discovery)**: Starts with user facts (genres, goals, level, language, length) and moves forward through declarative IF–THEN rules to deduce ranked recommendations.
2. **Backward Chaining (Goal-Driven Verification)**: Starts with a specific hypothesis (e.g., *"Should I read Atomic Habits?"*), backtracks through prerequisite sub-goals, identifies proven facts, detects contradictions, and prompts for missing evidence.

### Key Architectural Highlights
- **Zero Database Requirement**: Book data is maintained as an immutable, structured JavaScript Knowledge Base (`server/data/books.js`) containing 58+ curated titles across multiple genres and languages.
- **Dual Inference Engines**:
  - `recommendationEngine.js` — Classical Forward-Chaining engine with 100-point deterministic scoring.
  - `backwardChainingEngine.js` — Goal-driven Backward-Chaining engine with recursive proof trees and missing evidence prompts.
- **Explainable AI (XAI)**: Every single recommendation and goal proof produces a human-readable justification detailing which user preferences and domain rules triggered the conclusion.
- **Client-Side Persistence**: Favorites and Reading Lists use browser `localStorage`, keeping the server stateless while preserving user selections across sessions.

---

## 2. Technology Stack

### Frontend
- **React.js 19** with **Vite**
- **JavaScript (ES6+)**
- **Tailwind CSS v4** (Modern aesthetic with literary dark-theme, glassmorphism, responsive grid)
- **React Router DOM v7** (Declarative client routing)
- **Lucide React** (Crisp modern iconography)
- **Axios** (REST API client)

### Backend
- **Node.js** & **Express.js**
- **JavaScript Knowledge Base** (`server/data/books.js` — 58+ authentic titles)
- **Declarative Rule Base** (`server/rules/recommendationRules.js`)
- **Forward-Chaining Inference Engine** (`server/services/recommendationEngine.js`)
- **Backward-Chaining Inference Engine** (`server/services/backwardChainingEngine.js`)
- **CORS & Centralized Error Middleware**

---

## 3. Classical AI Concepts Demonstrated

### A. Forward Chaining (Data-Driven / Bottom-Up)

```
┌────────────────────────────────────────────────────────┐
│                      USER FACTS                        │
│   (Genres, Language, Goal, Level, Length Category)     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             FORWARD CHAINING INFERENCE                 │
│                                                        │
│  ┌────────────────────┐        ┌────────────────────┐  │
│  │   KNOWLEDGE BASE   │        │     RULE BASE      │  │
│  │  (58+ Book Records)│◄──────►│  (IF-THEN Rules)   │  │
│  └────────────────────┘        └────────────────────┘  │
│                            │                           │
│                            ▼                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │           DETERMINISTIC SCORER (Max 100)         │  │
│  │  Genre (40) + Goal (25) + Lang (15)              │  │
│  │  + Level (10) + Length (10) + Rule Synergy       │  │
│  └──────────────────────────────────────────────────┘  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             RECOMMENDATION RANKING & OUTPUT            │
│               All Matching Books Derived               │
└────────────────────────────────────────────────────────┘
```

### B. Backward Chaining (Goal-Driven / Top-Down)

```
┌────────────────────────────────────────────────────────┐
│                  HYPOTHESIS / ROOT GOAL                │
│             "Recommend('Atomic Habits')?"              │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             BACKWARD SUB-GOAL DECOMPOSITION            │
│                                                        │
│  ├── Sub-Goal 1: Genre Constraint ("Self-Help")        │
│  ├── Sub-Goal 2: Reading Goal ("Personal Dev")         │
│  ├── Sub-Goal 3: Language Match ("English")            │
│  ├── Sub-Goal 4: Reading Level ("Beginner")            │
│  ├── Sub-Goal 5: Length Category ("Medium")            │
│  └── Sub-Goal 6: Rule Synergies (Check Rule Base)      │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 GROUND FACT EVALUATION                 │
│                                                        │
│  [PROVEN]    Fact provided and satisfies sub-goal      │
│  [CONFLICT]  Fact provided but contradicts sub-goal    │
│  [UNKNOWN]   Fact missing -> Formulate user inquiry    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                  PROOF TREE & VERDICT                  │
│       Verdict: PROVEN (100%) / PARTIALLY / DISPROVED   │
│           Missing Evidence List & Deduction Trace      │
└────────────────────────────────────────────────────────┘
```

### Comparison Matrix

| Dimension | Forward Chaining | Backward Chaining |
| :--- | :--- | :--- |
| **Primary Question** | *"Given my taste, what books should I read?"* | *"Is Book X specifically right for me?"* |
| **Reasoning Flow** | Antecedent (Facts) $\rightarrow$ Consequent (Conclusions) | Consequent (Hypothesis) $\rightarrow$ Antecedent (Prerequisites) |
| **User Interaction** | Fill full preference form upfront | Test specific book, interactively answer missing evidence |
| **Handled By** | `recommendationEngine.js` | `backwardChainingEngine.js` |
| **Frontend UI** | Questionnaire (`/questionnaire`) & Results (`/recommendations`) | Goal Verifier (`/goal-verifier`) & Book Details (`/books/:id`) |

---

## 4. Scoring Logic (Max 100 Points)

| Attribute Match | Points |
| :--- | :--- |
| **Genre Match** | **40 pts** |
| **Reading Goal Match** | **25 pts** |
| **Language Match** | **15 pts** |
| **Reading Level Match** | **10 pts** |
| **Book Length Match** | **10 pts** |
| **Rule Synergy Bonus** | **+5 to +8 pts** (Capped at 100 total) |

---

## 5. API Endpoints

### Books API
- `GET /api/books` — Retrieve all predefined books in the knowledge base.
- `GET /api/books/:id` — Retrieve a single book by ID, including similar recommendations.
- `GET /api/books/search?query=keyword` — Search books by title, author, genre, or synopsis.
- `GET /api/books/genre/:genre` — Filter books by specific genre.

### Forward Chaining Recommendations API
- `POST /api/recommendations` — Evaluate preferences forward through the inference engine.

#### Sample Request Body:
```json
{
  "genres": ["Fantasy", "Adventure"],
  "language": "English",
  "readingLevel": "Beginner",
  "readingGoal": "Entertainment",
  "bookLength": "Medium"
}
```

### Backward Chaining Goal Verification API
- `POST /api/recommendations/verify-goal` — Verify whether a specific book satisfies a reader's goals backwards.

#### Sample Request Body:
```json
{
  "bookId": "b-015",
  "preferences": {
    "genres": ["Self-Help"],
    "language": "English"
  }
}
```

#### Sample Response:
```json
{
  "success": true,
  "data": {
    "hypothesis": {
      "goal": "Recommend(\"Atomic Habits\")",
      "bookId": "b-015",
      "title": "Atomic Habits"
    },
    "verdict": "PARTIALLY_PROVEN",
    "confidenceScore": 60,
    "proofTree": {
      "rootGoal": "Recommend(\"Atomic Habits\")",
      "subGoals": [
        { "id": "SG_GENRE", "status": "PROVEN", "pointsEarned": 40 },
        { "id": "SG_READING_GOAL", "status": "UNKNOWN", "pointsEarned": 0 },
        { "id": "SG_LANGUAGE", "status": "PROVEN", "pointsEarned": 15 },
        { "id": "SG_READING_LEVEL", "status": "UNKNOWN", "pointsEarned": 0 },
        { "id": "SG_BOOK_LENGTH", "status": "UNKNOWN", "pointsEarned": 0 }
      ]
    },
    "missingEvidence": [
      {
        "attribute": "readingGoal",
        "prompt": "Is your reading objective one of: Personal Development, Career Growth?",
        "weight": 25
      }
    ]
  }
}
```

- `POST /api/recommendations/backward-search` — Scan all 58 candidate books as hypotheses and return grouped proven, partially proven, and 1-step-away books.

---

## 6. Directory Structure

```
bookwise/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── BookCard.jsx
│   │   │   ├── BookGrid.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── GenreFilter.jsx
│   │   │   ├── PreferenceForm.jsx
│   │   │   ├── RecommendationScore.jsx
│   │   │   ├── RecommendationExplanation.jsx
│   │   │   ├── BackwardChainingVerifier.jsx  <-- Interactive Backward Proof Tree
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Questionnaire.jsx             <-- Forward Chaining Discovery
│   │   │   ├── Recommendations.jsx           <-- Forward Chaining Results
│   │   │   ├── GoalVerifier.jsx              <-- Dedicated Backward Chaining Page
│   │   │   ├── BookDetails.jsx               <-- Embedded Backward Chaining Verifier
│   │   │   ├── Search.jsx
│   │   │   ├── Favorites.jsx
│   │   │   └── ReadingList.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── SavedBooksContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── scoringConfig.js
│   ├── controllers/
│   │   ├── booksController.js
│   │   └── recommendationController.js       <-- Forward & Backward Chaining endpoints
│   ├── routes/
│   │   ├── booksRoutes.js
│   │   └── recommendationRoutes.js
│   ├── services/
│   │   ├── recommendationEngine.js           <-- Forward Chaining Engine
│   │   └── backwardChainingEngine.js         <-- Backward Chaining Engine
│   ├── rules/
│   │   └── recommendationRules.js
│   ├── data/
│   │   └── books.js
│   ├── middleware/
│   │   ├── validator.js
│   │   └── errorHandler.js
│   ├── app.js
│   ├── server.js
│   ├── test-engine.js                        <-- Test suite for both engines
│   └── package.json
│
├── package.json
├── README.md
└── .gitignore
```

---

## 7. How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Step 1: Run Backend Server
```bash
cd server
npm install
node server.js
```
The server will start on: **`http://localhost:5000`**

### Step 2: Run Frontend Client
In a separate terminal:
```bash
cd client
npm install
npm run dev
```
The client application will start on: **`http://localhost:3000`**

### Step 3: Run AI Inference Test Suite
To verify both Forward Chaining and Backward Chaining inference engines:
```bash
cd server
node test-engine.js
```

---

## 8. Verification & Test Cases

| Mode | Scenario | Input / Goal | Expected Result |
| :--- | :--- | :--- | :--- |
| **Forward** | Case 1 | Fantasy, English, Beginner, Entertainment, Medium | *Harry Potter and the Sorcerer's Stone* (100%) |
| **Forward** | Case 2 | Self-Help, English, Intermediate, Personal Dev, Medium | *Atomic Habits* (100%) |
| **Forward** | Case 3 | Technology, English, Beginner, Academic Learning, Short | *Grokking Algorithms* (100%) |
| **Forward** | Case 4 | Mystery, Marathi, Intermediate, Entertainment, Short | *Akleche Tare* (100%) |
| **Backward** | BC 1 | Goal: `Recommend("Atomic Habits")` with matching facts | `PROVEN` (100% confidence, all sub-goals satisfied) |
| **Backward** | BC 2 | Goal: `Recommend("Harry Potter")` with partial facts | `PARTIALLY_PROVEN` (60%), 3 missing evidence prompts |
| **Backward** | BC 3 | Goal: `Recommend("Harry Potter")` with History & Marathi | `DISPROVED` (0%), conflicts explicitly logged |
| **Backward** | BC 4 | Multi-hypothesis search across 58 books | Identifies 1-step-away books with potential proof boosts |

---

## 9. License & Credits

Built as an AI Mini-Project showcasing Rule-Based Reasoning, Forward Chaining, Backward Chaining, and Explainable AI within a modern React + Express architecture. Zero external database configuration required.
