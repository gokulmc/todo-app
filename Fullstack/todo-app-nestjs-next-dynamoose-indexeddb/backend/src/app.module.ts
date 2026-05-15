import { Module } from '@nestjs/common';
import { DynamooseModule } from './dynamoose/dynamoose.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [DynamooseModule, TasksModule],
})
export class AppModule {}
