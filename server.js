const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let playerData = {};

app.post("/updateData", (req, res) => {
  const { userId, date, playerName, passName, passId, reset } = req.body;

  if (reset) {
    playerData[userId] = [];
    return res.json({ status: "reset" });
  }

  if (!playerData[userId]) {
    playerData[userId] = [];
  }

  // Composite key check: same passId + same date + same playerName
  const alreadyExists = playerData[userId].some(
    (p) => p.passId === passId && p.date === date && p.playerName === playerName
  );

  if (!alreadyExists) {
    playerData[userId].push({ date, playerName, passName, passId });
    return res.json({ status: "success", message: "New purchase added" });
  } else {
    return res.json({ status: "duplicate", message: "Purchase already exists" });
  }
});

function deduplicateUserData(userId) {
  if (!playerData[userId]) return;

  const seen = new Set();
  playerData[userId] = playerData[userId].filter((p) => {
    const key = `${p.passId}-${p.date}-${p.playerName}`;
    if (seen.has(key)) {
      return false; // skip duplicate
    }
    seen.add(key);
    return true;
  });
}

app.get("/getData/:userId", (req, res) => {
  const userId = req.params.userId;
  deduplicateUserData(userId); // ensure clean data before returning
  res.json(playerData[userId] || { error: "No data found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));