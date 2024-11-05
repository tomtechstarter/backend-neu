import express from "express";
import cors from "cors";
const app = express();

// Middleware
app.use(cors());

const PORT = 5050;

const todos = [
  { id: 1, name: "Milch holen", userId: 1 },
  { id: 2, name: "Wasser holen", userId: 2 },
  { id: 3, name: "Brötchen holen", userId: 1 },
];

app.get("/", function (req, res) {
  res.send("Hello my name is Tom");
});

app.get("/todos/all", (req, res) => {
  res.json(todos);
});

app.get("/todos/byid", (req, res) => {
  // const query = req.query --> {"todoId": 1}
  const todoId = req.query.todoId;
  console.log("MY TODOID", typeof todoId);
  if (!todoId) res.send("No Todo Id provided");
  const todoIdNr = parseInt(todoId);
  const todo = todos.find((item) => item.id === todoIdNr);
  res.json(todo);
});

app.get("/todos/byuserid", (req, res) => {
  const userId = req.query.userId;

  if (!userId) res.send("No User Id provided");
  const userIdNr = parseInt(userId);
  const userTodos = todos.filter((item) => item.userId === userIdNr);
  res.json(userTodos);
});

app.listen(PORT, () => {
  console.log(`Express App is running on http://localhost:${PORT}`);
});
