import { useState, useEffect } from "react";
import { Container, Alert, Nav } from "react-bootstrap";
import { Routes, Route, Link, useParams } from "react-router-dom";
import List from "./components/List";
import Form from "./components/Form";

// Pagina de detalle de una tarea
function TaskDetailPage() {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadTask = async () => {
            try {
                const res = await fetch(`http://localhost:3000/tasks/${id}`);
                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || "Error al cargar tarea");
                }
                const data = await res.json();
                setTask(data);
            } catch (err) {
                console.error("Error al cargar tarea:", err);
                setError(err.message || "Error al cargar tarea");
            } finally {
                setLoading(false);
            }
        };

        loadTask();
    }, [id]);

    if (loading) {
        return <p>Cargando tarea...</p>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!task) {
        return <p>No se encontro la tarea.</p>;
    }

    return (
        <div>
            <h2 className="mb-3">Detalle de tarea</h2>
            <p><strong>ID:</strong> {task.id}</p>
            <p><strong>Titulo:</strong> {task.title}</p>
        </div>
    );
}

// Pagina principal con la lista de tareas
function TasksPage({
    tasks,
    message,
    addTask,
    deleteTask,
    startEditing,
    editingId,
    editingText,
    setEditingText,
    saveEdit,
    cancelEdit
}) {
    return (
        <div className="card border">
            <div className="card-body p-4">
                <h1 className="mb-4 text-center">
                    Gestor de Tareas
                </h1>

                {message.text && (
                    <Alert
                        variant={message.type}
                        dismissible
                        onClose={() => message.onClose && message.onClose()}
                        className="mb-4"
                    >
                        {message.text}
                    </Alert>
                )}

                <Form onAdd={addTask} />

                <List
                    tasks={tasks}
                    deleteTask={deleteTask}
                    startEditing={startEditing}
                    editingId={editingId}
                    editingText={editingText}
                    setEditingText={setEditingText}
                    saveEdit={saveEdit}
                    cancelEdit={cancelEdit}
                />
            </div>
        </div>
    );
}

function App() {
    const [tasks, setTasks] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });

    // Carga las tareas al montar el componente
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const res = await fetch("http://localhost:3000/tasks");
                if (!res.ok) throw new Error("Error al cargar tareas");
                const data = await res.json();
                setTasks(data);
            } catch (err) {
                console.error("Error al cargar tasks", err);
                showMessage("danger", "Error al cargar las tareas");
            }
        };
        loadTasks();
    }, []);

    // Muestra un mensaje temporal al usuario
    const showMessage = (type, text) => {
        setMessage({ type, text, onClose: () => setMessage({ type: "", text: "" }) });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    };

    // Agrega una nueva tarea
    const addTask = async (title) => {
        try {
            const response = await fetch("http://localhost:3000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al agregar tarea");
            }

            const newTask = await response.json();
            setTasks(prev => [...prev, newTask]);
            showMessage("success", "Tarea agregada correctamente");
        } catch (err) {
            console.error("Error al agregar tarea:", err);
            showMessage("danger", err.message || "Error al agregar la tarea");
        }
    };

    // Elimina una tarea
    const deleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al eliminar tarea");
            }

            setTasks(tasks.filter(t => t.id !== id));
            showMessage("success", "Tarea eliminada correctamente");
        } catch (err) {
            console.error("Error al eliminar tarea:", err);
            showMessage("danger", err.message || "Error al eliminar la tarea");
        }
    };

    // Activa el modo edicion para una tarea
    const startEditing = (task) => {
        setEditingId(task.id);
        setEditingText(task.title);
    };

    // Guarda los cambios de una tarea editada
    const saveEdit = async () => {
        try {
            const res = await fetch(`http://localhost:3000/tasks/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title: editingText })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Error al editar tarea");
            }

            const updated = await res.json();
            setTasks(tasks.map(t => (t.id === editingId ? updated : t)));
            setEditingId(null);
            setEditingText("");
            showMessage("success", "Tarea actualizada correctamente");
        } catch (err) {
            console.error("Error al editar:", err);
            showMessage("danger", err.message || "Error al editar la tarea");
        }
    };

    // Cancela el modo edicion
    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    return (
        <Container className="my-5">
            <Nav className="mb-4 gap-3">
                <Nav.Item>
                    <Nav.Link as={Link} to="/">Lista de tareas</Nav.Link>
                </Nav.Item>
            </Nav>

            <Routes>
                <Route
                    path="/"
                    element={
                        <TasksPage
                            tasks={tasks}
                            message={message}
                            addTask={addTask}
                            deleteTask={deleteTask}
                            startEditing={startEditing}
                            editingId={editingId}
                            editingText={editingText}
                            setEditingText={setEditingText}
                            saveEdit={saveEdit}
                            cancelEdit={cancelEdit}
                        />
                    }
                />
                <Route path="/tasks/:id" element={<TaskDetailPage />} />
            </Routes>
        </Container>
    );
}

export default App;
