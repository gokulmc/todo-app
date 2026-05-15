'use client'

import { useState, useEffect } from 'react'
import TaskItem from '@/components/TaskItem'
import Filters from '@/components/Filters'
import styles from './page.module.css'
import { idbGetAll, idbPut, idbDelete, idbReplaceAll } from '@/lib/idb'

export default function Home() {
  const [tasks, setTasks]   = useState([])
  const [input, setInput]   = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => { init() }, [])

  async function init() {
    // Step 1: paint the UI instantly from IndexedDB (works offline)
    const cached = await idbGetAll()
    if (cached.length > 0) setTasks(cached)

    // Step 2: fetch fresh data from the server and sync IndexedDB
    try {
      const res        = await fetch('/api/tasks')
      const serverTasks = await res.json()
      await idbReplaceAll(serverTasks)  // full replace so stale items don't linger
      setTasks(serverTasks)
    } catch {
      // server unreachable — keep showing cached IndexedDB data
    }
  }

  async function addTask() {
    const text = input.trim()
    if (!text) return
    const res     = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const newTask = await res.json()
    await idbPut(newTask)                          // cache the server-assigned task
    setInput('')
    setTasks(prev => [newTask, ...prev])
  }

  async function toggleTask(id) {
    const task    = tasks.find(t => t.id === id)
    const updated = { ...task, done: !task.done }

    // Optimistic: update UI and IndexedDB before waiting for server
    setTasks(prev => prev.map(t => t.id === id ? updated : t))
    await idbPut(updated)

    await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !task.done }),
    })
  }

  async function deleteTask(id) {
    // Optimistic: remove from UI and IndexedDB immediately
    setTasks(prev => prev.filter(t => t.id !== id))
    await idbDelete(id)

    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  }

  async function clearDone() {
    const doneTasks = tasks.filter(t => t.done)

    // Optimistic: wipe done tasks from UI and IndexedDB immediately
    setTasks(prev => prev.filter(t => !t.done))
    await Promise.all(doneTasks.map(t => idbDelete(t.id)))

    await fetch('/api/tasks', { method: 'DELETE' })
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
