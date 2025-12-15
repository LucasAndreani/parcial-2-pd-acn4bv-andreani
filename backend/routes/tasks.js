import express from "express";
import db from "../db.js";

const router = express.Router();

// Valida que el campo title este presente y no vacio
function validateTask(req, res, next) {
  if (!req.body.title || req.body.title.trim() === "") {
    return res.status(400).json({ error: "El campo 'title' es obligatorio" });
  }
  next();
}

// Obtiene todas las tareas
router.get("/", (req, res) => {
  try {
    const rows = db.prepare("SELECT id, title FROM tasks ORDER BY id DESC").all();
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener tareas", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtiene una tarea por id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  try {
    const task = db
      .prepare("SELECT id, title FROM tasks WHERE id = ?")
      .get(id);

    if (!task) {
      return res.status(404).json({ error: "Task no encontrada" });
    }

    res.json(task);
  } catch (err) {
    console.error("Error al obtener tarea", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Crea una nueva tarea
router.post("/", validateTask, (req, res) => {
  try {
    const title = req.body.title.trim();

    const result = db
      .prepare("INSERT INTO tasks (title) VALUES (?)")
      .run(title);

    const newTask = { id: result.lastInsertRowid, title };

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error al crear tarea", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualiza una tarea existente
router.put("/:id", validateTask, (req, res) => {
  const id = Number(req.params.id);
  const title = req.body.title.trim();

  try {
    const exists = db
      .prepare("SELECT id FROM tasks WHERE id = ?")
      .get(id);

    if (!exists) {
      return res.status(404).json({ error: "Task no encontrada" });
    }

    db.prepare("UPDATE tasks SET title = ? WHERE id = ?").run(title, id);

    const updated = db
      .prepare("SELECT id, title FROM tasks WHERE id = ?")
      .get(id);

    res.json(updated);
  } catch (err) {
    console.error("Error al actualizar tarea", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Elimina una tarea
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  try {
    const exists = db
      .prepare("SELECT id FROM tasks WHERE id = ?")
      .get(id);

    if (!exists) {
      return res.status(404).json({ error: "Task no encontrada" });
    }

    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

    res.json({ message: "Task eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar tarea", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;


