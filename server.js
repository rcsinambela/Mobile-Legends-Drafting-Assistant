const express = require("express");
const cors = require("cors"); // Import cors package
const DraftingAssistant = require("./drafting");

const app = express();
const draftingAssistant = new DraftingAssistant();

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post("/ban-hero", (req, res) => {
  const { hero, isTeamBan } = req.body;
  const result = draftingAssistant.banHero(hero, isTeamBan);
  res.json({
    message: result,
    teamBans: draftingAssistant.teamBans,
    enemyBans: draftingAssistant.enemyBans,
  });
});

app.get("/recommend-ban", (req, res) => {
  res.json({ recommendations: draftingAssistant.getBanRecommendation() });
});

app.post("/reset", (req, res) => {
  draftingAssistant.resetDraft();
  res.json({ message: "Drafting reset successfully." });
});

// app.post("/pick-hero", (req, res) => {
//   const { hero, isTeamPick } = req.body;
//   const result = draftingAssistant.pickHero(hero, isTeamPick);
//   res.json({ message: result, currentPicks: draftingAssistant.currentPicks });
// });

// Endpoint untuk pick hero dengan saran strategi tambahan
app.post("/pick-hero", (req, res) => {
  const { hero, isTeamPick } = req.body;
  const result = draftingAssistant.pickHero(hero, isTeamPick);

  // Memastikan bahwa result memiliki strategi
  if (result.strategy) {
    res.json({
      message: result.message,
      currentPicks: draftingAssistant.currentPicks,
      strategy: result.strategy, // Mengembalikan strategi yang diambil
    });
  } else {
    res.json({
      message: result.message,
      currentPicks: draftingAssistant.currentPicks,
      strategy: null, // Jika tidak ada strategi, set null
    });
  }
});

app.get("/recommend-pick", (req, res) => {
  const { isTeamPick } = req.query;
  res.json({
    recommendations: draftingAssistant.getPickRecommendation(
      isTeamPick === "true"
    ),
  });
});

app.get("/counter-hero", (req, res) => {
  const { hero } = req.query;
  res.json({ counters: draftingAssistant.getCounter(hero) });
});

// Endpoint khusus untuk mendapatkan strategi hero
app.get("/hero-strategy", (req, res) => {
  const { hero, isTeam } = req.query;
  const isTeamBoolean = isTeam === "true";
  const strategy = draftingAssistant.getHeroStrategy(hero, isTeamBoolean);
  res.json(strategy);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
