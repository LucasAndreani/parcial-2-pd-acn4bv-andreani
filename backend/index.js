import express from "express";
import cors from "cors";
import tasksRouter from "./routes/tasks.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Middleware para registrar todas las peticiones
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
})

// Endpoint para verificar que el servidor esta funcionando
app.get("/", (req, res) => {
    res.json({ message: "Servidor funcionando" });
});

// Usa las rutas de tareas bajo /tasks
app.use("/tasks", tasksRouter);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});