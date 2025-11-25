export default function List({ tasks }) {
    return (
        <ul>
            {tasks.map(item => (
                <li key={item.id}>{item.title}</li>
            ))}
        </ul>
    )
}