import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Repositories } from './repositories';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockRepositories = () => ({
    tasksRepository: {
        getTasks: jest.fn(),
        findOne: jest.fn(),
    }
});

const mockUser = {
    username: 'Gabs',
    id: 'someId',
    password: 'somePassword',
    tasks: [],
}

describe('TasksService', () => {
    let tasksService: TasksService;
    let repositories;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: Repositories, useFactory: mockRepositories },
            ],
        }).compile();

        tasksService = module.get(TasksService);
        repositories = module.get(Repositories);
    });

    describe('getTasks', () => {
        it('calls repositories.tasksRepository.getTasks and returns the result', async () => {
            repositories.tasksRepository.getTasks.mockResolvedValue('someValue');
            const result = await tasksService.getTasks(null, mockUser);
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls findOne and returns the result', async () => {
            const mockTask = {
                title: 'Test title',
                description: 'Test desc',
                id: 'someId',
                status: TaskStatus.OPEN,
            };

            repositories.tasksRepository.findOne.mockResolvedValue(mockTask);
            const result = await tasksService.getTaskById('someId', mockUser);
            expect(result).toEqual(mockTask);
        });

        it('calls findOne and handles an error', async () => {
            repositories.tasksRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(NotFoundException);
        });
    });
});