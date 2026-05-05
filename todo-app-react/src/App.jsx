import { useState } from 'react'
import './App.css'

// A single task row — receives the task object and callbacks from the parent
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      {/* Checkbox: calls onToggle with this task's id when clicked */}
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />
      {/* The task label text */}
      <span className="task-text">{task.text}</span>
      {/* Delete button: calls onDelete with this task's id when clicked */}
      <button className="delete-btn" onClick={() => onDelete(task.id)}>✕</button>
    </li>
  )
}

// The filter button bar — highlights whichever filter is currently active
function Filters({ current, onChange }) {
  const filters = ['all', 'active', 'done']

  return (
    <div className="filters">
      {filters.map(f => (
        <button
          key={f}
          className={`filter-btn ${current === f ? 'active' : ''}`}
          onClick={() => onChange(f)}
        >
          {/* Capitalise the first letter for display */}
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  )
}

// Root component — owns all state and wires everything together
export default function App() {
  const [tasks, setTasks] = useState([])       // Array of { id, text, done } objects
  const [input, setInput] = useState('')       // Controlled value for the text input
  const [filter, setFilter] = useState('all') // Which filter is currently active

  // Add a new task — do nothing if the input is blank
  function addTask() {
    const text = input.trim()
    console.log('addTask called — input:', JSON.stringify(input), '| trimmed:', JSON.stringify(text))
    if (!text) {
      console.warn('addTask: input is empty, doing nothing')
      return
    }
    const newTask = { id: Date.now(), text, done: false }
    setTasks(prev => {
      const updated = [...prev, newTask]
      console.log('New task added:', newTask, '| tasks now:', updated)
      return updated
    })
    setInput('') // Clear the input field after adding
  }

  // Flip the done flag on the task matching the given id
  function toggleTask(id) {
    console.log('toggleTask called — id:', id)
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const updated = { ...t, done: !t.done }
        console.log('Task after toggle:', updated)
        return updated
      })
    )
  }

  // Remove the task with the given id
  function deleteTask(id) {
    console.log('deleteTask called — id:', id)
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id)
      console.log('Tasks after deletion:', updated)
      return updated
    })
  }

  // Remove all completed tasks at once
  function clearDone() {
    setTasks(prev => {
      const doneCount = prev.filter(t => t.done).length
      console.log('clearDone — removing', doneCount, 'completed task(s)')
      const updated = prev.filter(t => !t.done)
      console.log('Tasks remaining:', updated)
      return updated
    })
  }

  // Decide which tasks to show based on the active filter
  const visible = tasks.filter(t => {
    if (filter === 'active') return !t.done
    if (filter === 'done') return t.done
    return true
  })

  // Count incomplete tasks for the footer label
  const remaining = tasks.filter(t => !t.done).length

  console.log('render — filter:', filter, '| total:', tasks.length, '| visible:', visible.length, '| remaining:', remaining)

  return (
    <div className="container">
      <h1>My Tasks</h1>

      {/* Input row: controlled text input + Add button */}
      <div className="input-row">
        <input
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={e => setInput(e.target.value)}          // Update state on every keystroke
          onKeyDown={e => e.key === 'Enter' && addTask()}   // Also add on Enter key
        />
        <button onClick={addTask}>Add</button>
      </div>

      {/* Filter buttons */}
      <Filters current={filter} onChange={f => {
        console.log('filter changed to:', f)
        setFilter(f)
      }} />

      {/* Task list — each task gets a TaskItem component */}
      <ul id="taskList">
        {visible.map(task => (
          <TaskItem
            key={task.id}          // React uses key to track which item is which in the list
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </ul>

      {/* Footer: item count + clear done button */}
      <div className="footer">
        <span id="itemCount">{remaining} item{remaining !== 1 ? 's' : ''} left</span>
        <button id="clearDoneBtn" onClick={clearDone}>Clear Done</button>
      </div>
    </div>
  )
}
