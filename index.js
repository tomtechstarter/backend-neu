import express from "express" // wir benutzen Express, weil es das Erstellen von Webservern in Node.js super einfach macht
import cors from "cors" // CORS brauchen wir, damit unsere API auch von anderen Domains aus aufgerufen werden kann (zb. für Frontend-Apps)
const app = express() // hier starten wir unsere Express-App

// Middleware
app.use(cors()) // Aktiviert CORS, damit andere Apps Anfragen an unsere API stellen können
app.use(express.json()) // Damit wir JSON-Daten aus dem Body der Anfragen lesen können

const PORT = 5050 // Unser Server wird auf diesem Port laufen

// hier haben wir ein einfaches Array, das als "Datenbank" für unsere Todos dient
let todos = [
  { id: 1, name: "Milch holen", userId: 1 },
  { id: 2, name: "Wasser holen", userId: 2 },
  { id: 3, name: "Brötchen holen", userId: 1 },
]

// ein Endpunkt, der einfach eine Begrüßung zurückgibt
app.get("/", (req, res) => {
  res.send("Hello my name is Tom") // Einfach mal 'Hallo' sagen
})

// Ein Endpunkt, der alle Todos zurückgibt
app.get("/todos/all", (req, res) => {
  res.json(todos) // Schickt alle Todos als JSON zurück
})

// endpunkt um ein Todo anhand der ID zu suchen
app.get("/todos/byid", (req, res) => {
  const todoId = req.query.todoId // Holen uns die "todoId" aus den Query-Parametern
  if (!todoId) {
    res.status(400).send("No Todo Id provided") // Wenn keine ID mitgegeben wird, sagen wir dem Nutzer, dass was fehlt
    return
  }
  const todo = todos.find(item => item.id === parseInt(todoId)) // Suchen das Todo mit der passenden ID
  if (!todo) {
    res.status(404).send("Todo not found") // Wenn wir kein Todo finden, geben wir das zurück
    return
  }
  res.json(todo) // Wenn wir das Todo gefunden haben, schicken wir es zurück
})

// Endpunkt, um alle Todos eines bestimmten Benutzers abzurufen
app.get("/todos/byuserid", (req, res) => {
  const userId = req.query.userId // Holen uns die "userId" aus den Query-Parametern
  if (!userId) {
    res.status(400).send("No User Id provided") // Gleiche Idee wie oben: Wenn keine User-ID mitgegeben wird, sagen wir Bescheid
    return
  }
  const userTodos = todos.filter(item => item.userId === parseInt(userId)) // Filtern die Todos nach der User-ID
  res.json(userTodos) // Schicken die Todos des Nutzers zurück
})

// Neuer Endpunkt, um Todos nach Namen zu filtern
app.get("/todos/byname", (req, res) => {
  const name = req.query.name // Holen uns den name-Parameter aus der URL
  if (!name) {
    res.status(400).send("No name provided") // Falls kein Name mitgegeben wird, meckern wir
    return
  }
  // filtern die Todos nach namen (case-insensitive damit es nicht auf Groß und Kleinschreibung ankommt)
  const matchingTodos = todos.filter(item => item.name.toLowerCase() === name.toLowerCase())
  res.json(matchingTodos) // Schicken die passenden Todos zurück (oder eine leere Liste, wenn nix gefunden wurde)
})

// Endpunkt, um ein neues Todo hinzuzufügen
app.post("/todos", (req, res) => {
  const { name, userId } = req.body // Extrahieren "name" und "userId" aus dem Body der Anfrage
  if (!name || !userId) {
    res.status(400).send("Name and UserId are required") // Wenn was fehlt, geben wir dem Nutzer eine Fehlermeldung
    return
  }
  const newTodo = {
    id: todos.length + 1, // Vergeben eine neue ID (einfach die Länge des Arrays + 1)
    name,
    userId: parseInt(userId),
  }
  todos.push(newTodo) // Fügen das neue Todo zur Liste hinzu
  res.status(201).json(newTodo) // Schicken das neue Todo zurück und sagen, dass es erfolgreich erstellt wurde
})

// Endpunkt, um mehrere Todos zu löschen
app.delete("/todos", (req, res) => {
  const todoIds = req.query.todoId // Holen uns die "todoId"s aus den Query-Parametern
  if (!todoIds) {
    res.status(400).send("No Todo Ids provided") // Falls keine IDs mitgegeben werden, geben wir Bescheid
    return
  }
  // Falls mehrere IDs mitgegeben wurden, wandeln wir sie in ein Array um sonst machen wir ein Array mit einer einzigen ID
  const idsToDelete = Array.isArray(todoIds) ? todoIds.map(id => parseInt(id)) : [parseInt(todoIds)]
  const initialLength = todos.length // Speichern die ursprüngliche Länge der Todos
  // Filtern die Todos raus, die gelöscht werden sollen
  todos = todos.filter(todo => !idsToDelete.includes(todo.id))
  if (todos.length === initialLength) {
    res.status(404).send("None of the specified Todos were found") // Falls keine Todos gelöscht wurden, sagen wir das
    return
  }
  res.json({ message: "Todos deleted successfully" }) // Alles gut Todos wurden gelöscht
})

// Bonus-Aufgabe: Endpunkt, um ein Todo zu aktualisieren
app.put("/todos/update", (req, res) => {
  const todoId = req.query.todoId // Holen uns die "todoId" aus den Query-Parametern
  const { name } = req.body // Holen uns den neuen Namen aus dem Body
  if (!todoId || !name) {
    res.status(400).send("Todo Id and name are required") // Fehlermeldung, wenn einer der Parameter fehlt
    return
  }
  const todo = todos.find(item => item.id === parseInt(todoId)) // Suchen das Todo, das wir aktualisieren wollen
  if (!todo) {
    res.status(404).send("Todo not found") // Falls wir es nicht finden, geben wir eine Fehlermeldung
    return
  }
  todo.name = name // Aktualisieren den Namen
  res.json(todo) // Schicken das aktualisierte Todo zurück
})

// Startet den Server und gibt im Terminal Bescheid, dass er läuft
app.listen(PORT, () => {
  console.log(`Express App is running on http://localhost:${PORT}`) // Loggt, dass alles erfolgreich läuft
})
