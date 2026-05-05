'use client' // This page uses useState — must opt into client-side rendering

import { useState } from 'react'
import TaskItem from '@/components/TaskItem'
import Filters from '@/components/Filters'
import styles from './page.module.css'

export default function Home() {
  const [tasks, setTasks]   = useState([])
  const [input, setInput]   = useState('')
  const [filter, setFilter] = useState('all')

  function addTask() {
    const text = input.trim()
    console.log('addTask — trimmed:', JSON.stringify(text))
    if (!text) { console.warn('Empty input, doing nothing'); return }
    const newTask = { id: Date.now(), text, done: false }
    setTasks(prev => { const u = [...prev, newTask]; console.log('tasks now:', u); return u })
    setInput('')
  }

  function toggleTask(id) {
    console.log('toggleTask — id:', id)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  function deleteTask(id) {
    console.log('deleteTask — id:', id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function clearDone() {
    setTasks(prev => { const u = prev.filter(t => !t.done); console.log('remaining:', u); return u })
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

        <Filters current={filter} onChange={f => { console.log('filter:', f); setFilter(f) }} />

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
