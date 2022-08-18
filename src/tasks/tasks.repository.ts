import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  // ToDo
  // https://gist.github.com/anchan828/9e569f076e7bc18daf21c652f7c3d012
}
