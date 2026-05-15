import * as dynamoose from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import { randomUUID } from 'crypto';

export class Task extends Item {
  id!: string;
  text!: string;
  done!: boolean;
  created!: number;
}

export const TaskSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: () => randomUUID(),
  },
  text: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Number,
    default: () => Date.now(),
  },
});

export const TaskModel = dynamoose.model<Task>('Tasks', TaskSchema, {
  create: true,
  waitForActive: false,
  throughput: 'ON_DEMAND',
});
