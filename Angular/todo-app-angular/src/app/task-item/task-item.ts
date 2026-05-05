import { Component, input, output } from '@angular/core';
import { Task } from '../app';

@Component({
  selector: 'app-task-item',
  imports: [],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  // Signal-based inputs — parent passes the task object down
  task = input.required<Task>();

  // Outputs — emit the task id back up to the parent
  toggle = output<number>();
  delete = output<number>();
}
