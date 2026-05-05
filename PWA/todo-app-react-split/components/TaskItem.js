// A single task row component
// Receives the task object and two callbacks from App as props
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />
      <span className="task-text">{task.text}</span>
      <button className="delete-btn" onClick={() => onDelete(task.id)}>✕</button>
    </li>
  );
}
