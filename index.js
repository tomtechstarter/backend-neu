import express from "express";
const app = express();

const PORT = 3000;

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/time", (req, res) => {
  const now = new Date();
  const time = now.toLocaleTimeString(); // Gibt die aktuelle Zeit im lokalen Format zurück
  res.send(`Current server time is: ${time}`);
});

app.listen(PORT, () => {
  console.log(`Express App is running on http://localhost:${PORT}`);
});

