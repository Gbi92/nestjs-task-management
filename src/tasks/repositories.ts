import { Injectable } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { DataSource } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@Injectable()
export class Repositories {
  constructor(private dataSource: DataSource) {}
  get tasksRepository() {
    return this.dataSource.getRepository(Task).extend({
      async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;

        const query = this.createQueryBuilder('task');

        if (status) {
          query.andWhere('task.status = :status', { status });
        }

        if (search) {
          query.andWhere(
            'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
            { search: `%${search}%`},
          );
        }

        const tasks = await query.getMany();
        return tasks;
      },

      async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
        });

        await this.save(task);
        return task;
      }
    });
  }

  get usersRepository() {
    return this.dataSource.getRepository(User).extend({
      async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        const user = this.create({ username, password });
        await this.save(user);
      }
    });
  }
}
