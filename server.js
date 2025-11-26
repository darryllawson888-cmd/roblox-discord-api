const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let playerData = {};

app.post("/updateData", (req, res) => {
  const { userId, purchaseId, date, playerName, passName, passId, reset } = req.body;

  if (reset) {
    playerData[userId] = [];
    return res.json({ status: "reset" });
  }

  if (!playerData[userId]) {
    playerData[userId] = [];
  }

  // Check uniqueness by purchaseId
  const alreadyExists = playerData[userId].some(
    (p) => p.purchaseId === purchaseId
  );

  if (!alreadyExists) {
    playerData[userId].push({ purchaseId, date, playerName, passName, passId });
    return res.json({ status: "success", message: "New purchase added" });
  } else {
    return res.json({ status: "duplicate", message: "Purchase already exists" });
  }
});

app.get("/getData/:userId", (req, res) => {
  const userId = req.params.userId;
  res.json(playerData[userId] || { error: "No data found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));