import express from "express"; // Importiert das Express-Framework für die Erstellung eines Webservers
import cors from "cors"; // Importiert das CORS-Modul für Cross-Origin Resource Sharing, um Anfragen von anderen Domains zu erlauben
import fs from "fs"; // Importiert das File System-Modul zum Lesen und Schreiben in Dateien

const app = express(); // Erstellt eine Express-Anwendung

// Middleware
app.use(cors()); // Aktiviert CORS für alle eingehenden Anfragen
app.use(express.json()); // Fügt Middleware hinzu, um JSON-Anfragen zu parsen

const PORT = 5050; // Definiert den Port, auf dem die Anwendung laufen wird

// Lade Todos aus der JSON-Datei
let todos = []; // Initialisiert das 'todos'-Array
fs.readFile("todos.json", "utf8", (err, data) => {
  // Liest die 'todos.json'-Datei asynchron
  if (err) {
    // Überprüft auf Fehler beim Lesen der Datei
    console.error("Error loading todos:", err); // Gibt eine Fehlermeldung in der Konsole aus
  } else {
    todos = JSON.parse(data); // Parst die JSON-Daten und speichert sie im 'todos'-Array
  }
});

// Definiert die Haupt-Route "/"
app.get("/", function (req, res) {
  res.send("Hello my name is Tom"); // Antwortet mit einer einfachen Nachricht
});

// Route: Gibt alle Todos zurück
app.get("/todos/all", (req, res) => {
  res.json(todos); // Sendet das gesamte 'todos'-Array als JSON
});

// Route: Gibt ein Todo nach ID zurück
app.get("/todos/byid", (req, res) => {
  const todoId = req.query.todoId; // Holt die ID aus dem Query-Parameter 'todoId'
  console.log("MY TODOID", typeof todoId); // Gibt den Typ der 'todoId' in der Konsole aus
  if (!todoId) res.send("No Todo Id provided"); // Sendet eine Nachricht, falls 'todoId' nicht vorhanden ist
  const todoIdNr = parseInt(todoId); // Wandelt 'todoId' in eine Zahl um
  const todo = todos.find((item) => item.id === todoIdNr); // Sucht das Todo mit der entsprechenden ID
  res.json(todo); // Gibt das gefundene Todo als JSON zurück
});

// Route: Gibt alle Todos eines bestimmten Nutzers zurück
app.get("/todos/byuserid", (req, res) => {
  const userId = req.query.userId; // Holt die User-ID aus dem Query-Parameter 'userId'
  if (!userId) res.send("No User Id provided"); // Sendet eine Nachricht, falls 'userId' nicht vorhanden ist
  const userIdNr = parseInt(userId); // Wandelt 'userId' in eine Zahl um
  const userTodos = todos.filter((item) => item.userId === userIdNr); // Filtert alle Todos nach User-ID
  res.json(userTodos); // Gibt die gefilterten Todos als JSON zurück
});

// Route: Gibt Todos nach Namen zurück
app.get("/todos/byname", (req, res) => {
  const nameTodo = req.query.name; // Holt den Namen aus dem Query-Parameter 'name'
  console.log("MY TODONAME", nameTodo); // Gibt den Namen in der Konsole aus
  if (!nameTodo) {
    // Überprüft, ob 'nameTodo' nicht vorhanden ist
    return res.send("No Todo name provided"); // Gibt eine Nachricht zurück, falls 'nameTodo' fehlt
  }
  const matchingTodos = todos.filter(
    (
      item // Filtert Todos, die den Namen enthalten
    ) => item.name.toLowerCase().includes(nameTodo.toLowerCase())
  );
  if (matchingTodos.length === 0) {
    // Überprüft, ob keine Todos gefunden wurden
    return res.json({ message: "Todo not found" }); // Gibt eine Nachricht zurück, falls nichts gefunden wurde
  }
  res.json(matchingTodos); // Gibt die gefundenen Todos als JSON zurück
});

// Route: Gibt alle Todos zurück (zum Testen)
app.get("/todos", (req, res) => {
  res.json(todos); // Gibt das 'todos'-Array als JSON zurück
});

// POST-Route: Fügt ein neues Todo hinzu
app.post("/todos", (req, res) => {
  const { name, userId } = req.body; // Holt 'name' und 'userId' aus dem Anfrage-Body
  if (!name || !userId) {
    // Überprüft, ob 'name' und 'userId' vorhanden sind
    return res.status(400).send("Name and UserId are required"); // Gibt Fehler 400 zurück, falls etwas fehlt
  }
  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1, // Neue ID basierend auf der letzten ID
    name,
    userId,
  };
  todos.push(newTodo); // Fügt das neue Todo ins Array hinzu
  fs.writeFile("todos.json", JSON.stringify(todos, null, 2), (err) => {
    // Speichert das Array in die JSON-Datei
    if (err) {
      console.error("Error saving todos:", err); // Gibt eine Fehlermeldung in der Konsole aus
      return res.status(500).send("Error saving todo"); // Gibt Fehler 500 zurück, falls ein Fehler auftritt
    }
    res.status(201).json(newTodo); // Gibt das neue Todo als JSON zurück
  });
});

// DELETE-Route: Löscht alle Todos
app.delete("/todos", (req, res) => {
  todos = []; // Setzt das 'todos'-Array auf leer
  res.send("Todos deleted"); // Sendet eine Bestätigung zurück
});

// DELETE-Route: Löscht ein Todo nach ID
app.delete("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id); // Holt die Todo-ID aus den URL-Parametern
  const index = todos.findIndex((todo) => todo.id === todoId); // Sucht die Position des Todos
  if (index === -1) {
    // Überprüft, ob das Todo existiert
    return res.status(404).send("Todo not found"); // Gibt Fehler 404 zurück, falls nicht gefunden
  }
  todos.splice(index, 1); // Entfernt das Todo aus dem Array
  fs.writeFile("todos.json", JSON.stringify(todos, null, 2), (err) => {
    // Speichert das aktualisierte Array
    if (err) {
      console.error("Error saving todos:", err); // Gibt eine Fehlermeldung in der Konsole aus
      return res.status(500).send("Error deleting todo"); // Gibt Fehler 500 zurück, falls Fehler beim Speichern
    }
    res.status(200).send("Todo deleted successfully"); // Bestätigt das erfolgreiche Löschen
  });
});

// PUT-Route: Aktualisiert ein Todo nach ID
app.put("/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id); // Holt die Todo-ID aus den URL-Parametern
  const { name, userId } = req.body; // Holt 'name' und 'userId' aus dem Anfrage-Body
  if (!name || !userId) {
    // Überprüft, ob 'name' und 'userId' vorhanden sind
    return res.status(400).send("Name and UserId are required"); // Gibt Fehler 400 zurück, falls etwas fehlt
  }
  const todo = todos.find((todo) => todo.id === todoId); // Sucht das Todo mit der entsprechenden ID
  if (!todo) {
    // Überprüft, ob das Todo existiert
    return res.status(404).send("Todo not found"); // Gibt Fehler 404 zurück, falls nicht gefunden
  }
  todo.name = name; // Aktualisiert den Namen des Todos
  todo.userId = userId; // Aktualisiert die User-ID des Todos
  fs.writeFile("todos.json", JSON.stringify(todos, null, 2), (err) => {
    // Speichert das aktualisierte Array
    if (err) {
      console.error("Error saving todos:", err); // Gibt eine Fehlermeldung in der Konsole aus
      return res.status(500).send("Error updating todo"); // Gibt Fehler 500 zurück, falls Fehler beim Speichern
    }
    res.status(200).json(todo); // Gibt das aktualisierte Todo als JSON zurück
  });
});

// Startet den Server und lauscht auf dem angegebenen Port
app.listen(PORT, () => {
  console.log(`Express App is running on http://localhost:${PORT}`);
});
