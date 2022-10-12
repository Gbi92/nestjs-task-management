import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { Repositories } from './repositories';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
    constructor(private readonly repositories: Repositories,) {}
    
    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.repositories.tasksRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.repositories.tasksRepository.findOne({where: {id, user}});

        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.repositories.tasksRepository.createTask(createTaskDto, user);
    }

    async deleteTaskById(id: string, user: User): Promise<void> {
        // Solution with 'delete':
        const result = await this.repositories.tasksRepository.delete({ id, user });

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        // Solution with 'remove':
        // const toDelete = await this.tasksRepository.findOne({where: {id: id}});
        // if (!toDelete) {
        //     throw new NotFoundException(`Task with ID ${id} not found`);
        // }
        // const deleted = await this.tasksRepository.remove(toDelete);
    }

    async updateTaskStatus(
        id: string, 
        status: TaskStatus, 
        user: User
        ): Promise<Task> {
        const task = await this.getTaskById(id, user);

        task.status = status;
        await this.repositories.tasksRepository.save(task);

        return task;
    }
}
