import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { Repositories } from './repositories';

@Injectable()
export class TasksService {
    constructor(private readonly repositories: Repositories,) {}
    
    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.repositories.tasksRepository.getTasks(filterDto);
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.repositories.tasksRepository.findOne({where: {id: id}});

        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.repositories.tasksRepository.createTask(createTaskDto);
    }

    async deleteTaskById(id: string): Promise<void> {
        // Solution with 'remove':
        // const toDelete = await this.tasksRepository.findOne({where: {id: id}});
        // if (!toDelete) {
        //     throw new NotFoundException(`Task with ID ${id} not found`);
        // }
        // const deleted = await this.tasksRepository.remove(toDelete);

        // --------------------

        // Solution with 'delete':
        const result = await this.repositories.tasksRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);

        task.status = status;
        await this.repositories.tasksRepository.save(task);

        return task;
    }
}
