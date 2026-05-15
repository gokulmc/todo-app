import { Injectable } from '@nestjs/common';
import { TaskModel } from './task.schema';

@Injectable()
export class TasksService {
  async getAll() {
    const tasks = await TaskModel.scan().exec();
    return tasks.sort((a, b) => b.created - a.created);
  }

  async create(text: string) {
    return TaskModel.create({ text });
  }

  async toggle(id: string, done: boolean) {
    await TaskModel.update({ id }, { done });
    return { ok: true };
  }

  async delete(id: string) {
    await TaskModel.delete({ id });
    return { ok: true };
  }

  async clearDone() {
    const doneTasks = await TaskModel.scan('done').eq(true).exec();
    if (doneTasks.length === 0) return { ok: true };
    await TaskModel.batchDelete(doneTasks.map(t => ({ id: t.id })));
    return { ok: true };
  }
}
