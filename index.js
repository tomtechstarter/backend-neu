import express from "express";
const app = express();

const PORT = 3000;

const todos = [
  { id: 1, name: "Milch holen", userId: 1 },
  { id: 2, name: "Brötchen holen", userId: 1 },
];

app.get("/", function (req, res) {
  res.send("Hello my name is Tom");
});

app.get("/todos/all", (req, res) => {
  res.json(todos);
});

app.listen(PORT, () => {
  console.log(`Express App is running on http://localhost:${PORT}`);
});
