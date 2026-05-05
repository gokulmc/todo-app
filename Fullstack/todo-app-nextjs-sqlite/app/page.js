'use client'

import { useState, useEffect } from 'react'
import TaskItem from '@/components/TaskItem'
import Filters from '@/components/Filters'
import styles from './page.module.css'

export default function Home() {
  const [tasks, setTasks]   = useState([])
  const [input, setInput]   = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchTasks() }, [])

  async function fetchTasks() {
    const res = await fetch('/api/tasks')
    setTasks(await res.json())
  }

  async function addTask() {
    const text = input.trim()
    if (!text) return
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    setInput('')
    fetchTasks()
  }

  async function toggleTask(id) {
    const task = tasks.find(t => t.id === id)
    await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !task.done }),
    })
    fetchTasks()
  }

  async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    fetchTasks()
  }

  async function clearDone() {
    await fetch('/api/tasks', { method: 'DELETE' })
    fetchTasks()
  }

  const visible = tasks.filter(t => {
    if (filter === 'active') return !t.done
    if (filter === 'done')   return t.done
    return true
  })

  const remaining = tasks.filter(t => !t.done).length

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>My Tasks</h1>

        <div className={styles.inputRow}>
          <input
            type="text"
            placeholder="Add a new task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <Filters current={filter} onChange={setFilter} />

        <ul className={styles.taskList}>
          {visible.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>

        <div className={styles.footer}>
          <span>{remaining} item{remaining !== 1 ? 's' : ''} left</span>
          <button onClick={clearDone}>Clear Done</button>
        </div>
      </div>
    </main>
  )
}
