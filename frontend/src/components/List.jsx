function List({
    tasks,
    deleteTask,
    startEditing,
    editingId,
    editingText,
    setEditingText,
    saveEdit
}) {
    return (
        <ul>
            {tasks.map(task => (
                <li key={task.id} style={{ marginBottom: "10px" }}>
                    
                    {editingId === task.id ? (
                        <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                        />
                    ) : (
                        <span>{task.title}</span>
                    )}

                    {editingId === task.id ? (
                        <button onClick={saveEdit}>Save</button>
                    ) : (
                        <button onClick={() => startEditing(task)}>Edit</button>
                    )}

                    <button onClick={() => deleteTask(task.id)}>
                        Delete
                    </button>

                </li>
            ))}
        </ul>
    );
}

export default List;
