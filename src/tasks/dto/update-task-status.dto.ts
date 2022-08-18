import { IsEnum } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class UpdateTaksStatusDto {
    @IsEnum(TaskStatus)
    status: TaskStatus;
}