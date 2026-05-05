// --- DOM references: grab each HTML element we need to read or control ---
const taskInput = document.getElementById('taskInput');       // The text field where the user types a new task
const addBtn = document.getElementById('addBtn1');             // The "Add" button that submits a new task
const taskList = document.getElementById('taskList');         // The <ul> where task <li> items are rendered
const itemCount = document.getElementById('itemCount');       // The <span> that shows "X items left"
const clearDoneBtn = document.getElementById('clearDoneBtn'); // The button that removes all completed tasks
const filterBtns = document.querySelectorAll('.filter-btn');  // All three filter buttons (All / Active / Done) as a NodeList

console.log('DOM elements loaded:', { taskInput, addBtn, taskList, itemCount, clearDoneBtn, filterBtns });

// --- App state: the single source of truth for the whole UI ---
let tasks = [];              // Array of task objects: { id: number, text: string, done: boolean }
let currentFilter = 'all';  // Tracks which filter is active; controls what render() shows

console.log('Initial state — tasks:', tasks, '| currentFilter:', currentFilter);

// --- addTask: called when the user clicks Add or presses Enter ---
function addTask() {
  const text = taskInput.value.trim(); // Read the input and strip leading/trailing whitespace
  console.log('addTask called — raw input:', JSON.stringify(taskInput.value), '| trimmed:', JSON.stringify(text));

  if (!text) {
    console.warn('addTask: input is empty, doing nothing');
    return;
  }

  const newTask = { id: Date.now(), text, done: false };
  tasks.push(newTask); // Add a new task; Date.now() gives a unique numeric ID
  console.log('New task added:', newTask, '| tasks array is now:', tasks);

  taskInput.value = ''; // Clear the input field so the user can type the next task
  render();             // Rebuild the list to show the new task
}

// --- toggleTask: flips a task between done and not-done ---
function toggleTask(id) {
  console.log('toggleTask called — id:', id);
  // Replace the matching task with a copy that has its done flag flipped; leave all others unchanged
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  const toggled = tasks.find(t => t.id === id);
  console.log('Task after toggle:', toggled, '| full tasks array:', tasks);
  render(); // Re-render so the checkbox state and strikethrough update immediately
}

// --- deleteTask: permanently removes a task from the list ---
function deleteTask(id) {
  const target = tasks.find(t => t.id === id);
  console.log('deleteTask called — id:', id, '| task being deleted:', target);
  tasks = tasks.filter(t => t.id !== id); // Keep every task whose id does NOT match
  console.log('Tasks after deletion:', tasks);
  render(); // Re-render so the removed task disappears from the UI
}

// --- clearDone: removes all completed tasks at once ---
function clearDone() {
  const doneCount = tasks.filter(t => t.done).length;
  console.log('clearDone called — removing', doneCount, 'completed task(s)');
  tasks = tasks.filter(t => !t.done); // Keep only tasks that are still incomplete
  console.log('Tasks remaining after clear:', tasks);
  render(); // Re-render so the cleared tasks disappear from the UI
}

// --- setFilter: switches the active filter and highlights the correct button ---
function setFilter(filter) {
  console.log('setFilter called — switching from', currentFilter, 'to', filter);
  currentFilter = filter; // Save the chosen filter so render() knows what to show
  filterBtns.forEach(btn => {
    // Add the "active" CSS class to the clicked button, remove it from the others
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  render(); // Re-render the list using the new filter
}

// --- render: rebuilds the entire task list and updates the item counter ---
function render() {
  console.group('render()'); // Groups all logs inside render under a collapsible label in DevTools
  console.log('currentFilter:', currentFilter, '| total tasks:', tasks.length);

  // Decide which tasks to show based on the current filter
  const visible = tasks.filter(t => {
    if (currentFilter === 'active') return !t.done; // Active filter: only incomplete tasks
    if (currentFilter === 'done') return t.done;    // Done filter: only completed tasks
    return true;                                     // All filter: every task
  });

  console.log('visible tasks after filtering:', visible);

  // Convert the visible tasks array into HTML <li> strings and inject them into the <ul>
  // list-group-item: Bootstrap class that styles each row with padding and a bottom border
  taskList.innerHTML = visible.map(t => `
    <li class="list-group-item d-flex align-items-center gap-3 ${t.done ? 'done' : ''}">
      <input type="checkbox" ${t.done ? 'checked' : ''} data-id="${t.id}" />
      <span class="task-text flex-grow-1">${t.text}</span>
      <button class="btn btn-link delete-btn p-0" data-id="${t.id}">✕</button>
    </li>
  `).join(''); // join('') merges the array of strings into one HTML string with no separator

  // Count how many tasks are still incomplete and update the footer label
  const remaining = tasks.filter(t => !t.done).length;
  // Use "item" for exactly 1, "items" for any other number (0, 2, 3…)
  itemCount.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;

  console.log('remaining (incomplete) count:', remaining);
  console.groupEnd(); // Close the render() group in DevTools
}

// --- Event listeners: connect user interactions to the functions above ---

addBtn.addEventListener('click', () => {
  console.log('Event: Add button clicked');
  addTask();
});

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    console.log('Event: Enter key pressed in input');
    addTask();
  }
});

// Event delegation on the list: one listener handles checkboxes for all tasks,
// even ones added after the page loaded (they don't need their own listeners)
taskList.addEventListener('change', e => {
  if (e.target.type === 'checkbox') {
    console.log('Event: checkbox changed — data-id:', e.target.dataset.id, '| checked:', e.target.checked);
    toggleTask(Number(e.target.dataset.id)); // Read the task id from data-id and toggle it
  }
});

// Event delegation on the list: one listener handles delete buttons for all tasks
taskList.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    console.log('Event: delete button clicked — data-id:', e.target.dataset.id);
    deleteTask(Number(e.target.dataset.id)); // Read the task id from data-id and delete it
  }
});

clearDoneBtn.addEventListener('click', () => {
  console.log('Event: Clear Done button clicked');
  clearDone();
});

// Wire up each filter button to call setFilter with its own data-filter value
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('Event: filter button clicked — filter:', btn.dataset.filter);
    setFilter(btn.dataset.filter);
  });
});

console.log('All event listeners attached. Running initial render...');
render(); // Run render once on page load so the UI is in a consistent initial state
