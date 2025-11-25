import { useState } from "react";
import List from "./components/List";
import Form from "./components/Form";

function App() {
    const [tasks, setTasks] = useState([]);


    const addTask = (title) => {
        const newTask = {
            id: crypto.randomUUID(),
            title
        }
        setTasks([...tasks, newTask])
    }


    return (
        <div style={{ padding: "20px" }}>
            <h1>Mis Tasks</h1>

            <Form onAdd={addTask} />

            <List tasks={tasks}/>
        </div>
    )
}

export default App;