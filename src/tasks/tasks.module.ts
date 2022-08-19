import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { Repositories } from './repositories';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
  ],
  providers: [TasksService, Repositories],
  controllers: [TasksController],
})
export class TasksModule {}
