import { IsEnum } from "class-validator";
import { TaskStatus } from "../task.model";

export class UpdateTaksStatusDto {
    @IsEnum(TaskStatus)
    status: TaskStatus;
}