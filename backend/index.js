import fs from "fs";
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

const DATA_PATH = "./data.json";

function readData() {
    const json = fs.readFileSync(DATA_PATH, "utf8")
    return JSON.parse(json);
}

function writeData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2))
}

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
})

app.get("/", (req, res) => {
    res.json({ message: "Servidor funcionando" });
});

app.get("/tasks", (req, res) => {
    const tasks = readData();
    res.json(tasks)
});

function validateTask(req, res, next) {
    if (!req.body.title || req.body.title.trim() === "") {
        return res.status(400).json({ error: "El campo 'title' es obligatorio" })
    }
    next()
}

app.post("/tasks", validateTask, (req, res) => {
    const tasks = readData();

    const newTask = {
        id: Date.now(),
        title: req.body.title
    };

    tasks.push(newTask);
    writeData(tasks);

    res.status(201).json(newTask);
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});