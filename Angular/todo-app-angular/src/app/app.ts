import { Component, signal, computed } from '@angular/core';
import { TaskItem } from './task-item/task-item';
import { Filters } from './filters/filters';

export interface Task {
  id: number;
  text: string;
  done: boolean;
}

@Component({
  selector: 'app-root',
  imports: [TaskItem, Filters],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // All state lives here as signals — Angular re-renders when signals change
  tasks  = signal<Task[]>([]);
  input  = signal('');
  filter = signal('all');

  // Derived state — recomputes automatically when tasks or filter changes
  visible = computed(() => {
    const f = this.filter();
    return this.tasks().filter(t => {
      if (f === 'active') return !t.done;
      if (f === 'done')   return t.done;
      return true;
    });
  });

  remaining = computed(() => this.tasks().filter(t => !t.done).length);

  addTask() {
    const text = this.input().trim();
    if (!text) return;
    this.tasks.update(prev => [...prev, { id: Date.now(), text, done: false }]);
    this.input.set('');
  }

  toggleTask(id: number) {
    this.tasks.update(prev =>
      prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  }

  deleteTask(id: number) {
    this.tasks.update(prev => prev.filter(t => t.id !== id));
  }

  clearDone() {
    this.tasks.update(prev => prev.filter(t => !t.done));
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.addTask();
  }
}
