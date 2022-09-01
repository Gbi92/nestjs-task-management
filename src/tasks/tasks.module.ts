import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { Repositories } from './repositories';
import { TasksService } from './tasks.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule
  ],
  providers: [TasksService, Repositories],
  controllers: [TasksController],
})
export class TasksModule {}
