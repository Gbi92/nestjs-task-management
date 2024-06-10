import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../auth/user.entity';
import { DataSource } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Repositories {
  constructor(private dataSource: DataSource) {}
  get tasksRepository() {
    return this.dataSource.getRepository(Task).extend({
      async getTasks(
        filterDto: GetTasksFilterDto,
        user: User,
      ): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.createQueryBuilder('task');
        query.where({ user });

        if (status) {
          query.andWhere('task.status = :status', { status });
        }

        if (search) {
          query.andWhere(
            '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
            { search: `%${search}%` },
          );
        }

        const tasks = await query.getMany();
        return tasks;
      },

      async createTask(
        createTaskDto: CreateTaskDto,
        user: User,
      ): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.create({
          title,
          description,
          status: TaskStatus.OPEN,
          user,
        });

        await this.save(task);
        return task;
      },
    });
  }

  get usersRepository() {
    return this.dataSource.getRepository(User).extend({
      async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({ username, password: hashedPassword });

        try {
          await this.save(user);
        } catch (error) {
          if (error.code === '23505') {
            // duplicate username
            throw new ConflictException('Username already exists');
          } else {
            throw new InternalServerErrorException();
          }
        }
      },
    });
  }
}
