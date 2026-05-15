const DB_NAME = 'todo-db'
const DB_VERSION = 1
const STORE = 'tasks'

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('created', 'created', { unique: false })
      }
    }

    request.onsuccess = (event) => resolve(event.target.result)
    request.onerror  = (event) => reject(event.target.error)
  })
}

export async function idbGetAll() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(STORE, 'readonly')
    const request = tx.objectStore(STORE).getAll()
    request.onsuccess = () =>
      resolve(request.result.sort((a, b) => b.created - a.created))
    request.onerror = () => reject(request.error)
  })
}

export async function idbPut(task) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(STORE, 'readwrite')
    const request = tx.objectStore(STORE).put(task)
    request.onsuccess = () => resolve()
    request.onerror   = () => reject(request.error)
  })
}

export async function idbDelete(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx      = db.transaction(STORE, 'readwrite')
    const request = tx.objectStore(STORE).delete(id)
    request.onsuccess = () => resolve()
    request.onerror   = () => reject(request.error)
  })
}

// Clears the entire store then writes all tasks atomically in one transaction.
// Used when syncing from the server so stale/deleted tasks don't linger.
export async function idbReplaceAll(tasks) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    store.clear()
    tasks.forEach(task => store.put(task))
    tx.oncomplete = () => resolve()
    tx.onerror    = () => reject(tx.error)
  })
}
