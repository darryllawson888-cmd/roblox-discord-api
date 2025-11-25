const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// In-memory store (replace with MongoDB/Firebase later)
let playerData = {};

app.post("/updateData", (req, res) => {
  const { userId, date, playerName, passName, passId, reset } = req.body;

  if (reset) {
    // Clear purchase history for this user
    playerData[userId] = [];
    return res.json({ status: "reset" });
  }

  if (!playerData[userId]) {
    playerData[userId] = [];
  }

  playerData[userId].push({ date, playerName, passName, passId });
  res.json({ status: "success" });
});

app.get("/getData/:userId", (req, res) => {
    const userId = req.params.userId;
    res.json(playerData[userId] || { error: "No data found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));