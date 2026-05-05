// Root component — owns all state and wires everything together
// TaskItem and Filters are available as globals, loaded via script tags in index.html
function App() {
  const { useState } = React;

  const [tasks, setTasks]   = useState([]);
  const [input, setInput]   = useState('');
  const [filter, setFilter] = useState('all');

  function addTask() {
    const text = input.trim();
    console.log('addTask — trimmed:', JSON.stringify(text));
    if (!text) { console.warn('Empty input, doing nothing'); return; }
    const newTask = { id: Date.now(), text, done: false };
    setTasks(prev => { const u = [...prev, newTask]; console.log('tasks now:', u); return u; });
    setInput('');
  }

  function toggleTask(id) {
    console.log('toggleTask — id:', id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function deleteTask(id) {
    console.log('deleteTask — id:', id);
    setTasks(prev => { const u = prev.filter(t => t.id !== id); console.log('tasks now:', u); return u; });
  }

  function clearDone() {
    setTasks(prev => { const u = prev.filter(t => !t.done); console.log('remaining:', u); return u; });
  }

  const visible = tasks.filter(t => {
    if (filter === 'active') return !t.done;
    if (filter === 'done')   return t.done;
    return true;
  });

  const remaining = tasks.filter(t => !t.done).length;

  return (
    <div className="container">
      <h1>My Tasks</h1>

      <div className="input-row">
        <input
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <Filters current={filter} onChange={f => { console.log('filter:', f); setFilter(f); }} />

      <ul id="taskList">
        {visible.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </ul>

      <div className="footer">
        <span id="itemCount">{remaining} item{remaining !== 1 ? 's' : ''} left</span>
        <button id="clearDoneBtn" onClick={clearDone}>Clear Done</button>
      </div>
    </div>
  );
}
