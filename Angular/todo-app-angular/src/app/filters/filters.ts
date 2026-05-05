import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-filters',
  imports: [],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters {
  current     = input.required<string>();
  filterChange = output<string>();

  readonly options = ['all', 'active', 'done'];
}
