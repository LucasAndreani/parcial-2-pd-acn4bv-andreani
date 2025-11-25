import { useState, useEffect } from "react";
import List from "./components/List";
import Form from "./components/Form";

function App() {
    const [tasks, setTasks] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/tasks")
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Error al cargar tasks", err));
    }, []);

    const addTask = async (title) => {
        const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        const newTask = await response.json();
        setTasks(prev => [...prev, newTask]);
    };

    const deleteTask = async (id) => {
        await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE"
        });

        setTasks(tasks.filter(t => t.id !== id));
    };

    const startEditing = (task) => {
        setEditingId(task.id);
        setEditingText(task.title);
    };


    const saveEdit = async () => {
    const res = await fetch(`http://localhost:3000/tasks/${editingId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: editingText })
    });

    if (!res.ok) {
        console.error("Error al editar:", await res.json());
        return;
    }

    const updated = await res.json();

    setTasks(tasks.map(t =>
        t.id === editingId ? updated : t
    ));

    setEditingId(null);
    setEditingText("");
};

    return (
        <div style={{ padding: "20px" }}>
            <h1>Mis Tasks</h1>

            <Form onAdd={addTask} />

            <List
                tasks={tasks}
                deleteTask={deleteTask}
                startEditing={startEditing}
                editingId={editingId}
                editingText={editingText}
                setEditingText={setEditingText}
                saveEdit={saveEdit}
            />
        </div>
    );
}

export default App;
