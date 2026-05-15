import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('api/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll() {
    return this.tasksService.getAll();
  }

  @Post()
  create(@Body('text') text: string) {
    return this.tasksService.create(text.trim());
  }

  @Put(':id')
  toggle(@Param('id') id: string, @Body('done') done: boolean) {
    return this.tasksService.toggle(id, done);
  }

  @Delete()
  clearDone() {
    return this.tasksService.clearDone();
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
