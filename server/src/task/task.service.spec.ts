import { Model } from 'mongoose';
import { TaskService } from './task.service';
import Task from './schemas/task.schema';
import { Schedule } from '../schedule/schemas/schedule.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ImageModule } from 'src/image/image.module';
import { ImageService } from 'src/image/image.service';

describe('TaskService', () => {
  let taskService: TaskService;

  let taskModel: Model<Task>;
  let scheduleModel: Model<Schedule>;

  const taskTest = {
    title: 'Clean the house',
    detail: 'Clean the first floor',
    isDone: false,
    deadline: '2023-08-06T16:00:00.234Z',
    isCycle: false,
    guardian: '64bf9f81942202aa3f16025b',
    aip: '64bf9f64942202aa3f160259',
    schedule: '64cfa302dcd3b0787689184c',
    note: 'Aip is happier than yesterday.',
    _id: '64d0f5526df9556714f491d8',
    createdAt: '2023-08-07T13:44:50.185Z',
    updatedAt: '2023-08-07T13:44:50.185Z',
    __v: 0,
  };

  const scheduleTest = {
    _id: '64cfa302dcd3b0787689184c',
    startTime: new Date(),
    endTime: new Date(),
    isCycle: false,
    guardian: '64bf9fe4942202aa3f16025e',
    createdAt: '2023-08-06T13:41:22.664Z',
    updatedAt: '2023-08-06T13:41:22.664Z',
    __v: 0,
  };

  const mockModel = {
    findById: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [ImageModule],
      providers: [
        TaskService,
        {
          provide: ImageService,
          useValue: {},
        },
        {
          provide: getModelToken(Task.name),
          useValue: mockModel,
        },
        {
          provide: getModelToken(Schedule.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskModel = module.get<Model<Task>>(getModelToken(Task.name));
    scheduleModel = module.get<Model<Schedule>>(getModelToken(Schedule.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create a task', () => {
    it('should throw BadRequestException when guardian id is invalid', async () => {
      const invalidGuardianId = 'sdsad5sa46w4';
      const createTaskDto: CreateTaskDto = {
        title: 'Clean the house',
        detail: 'Clean the first floor',
        isDone: false,
        isCycle: false,
        guardian: "khjugjgjhgj",
        aip: '64bf9f64942202aa3f160259',
        schedule: '64cfa302dcd3b0787689184c',
        note: 'Aip is happier than yesterday.',
        deadline: undefined,
      };

      await expect(taskService.create(createTaskDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when schedule is not found', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Clean the house',
        detail: 'Clean the first floor',
        isDone: false,
        isCycle: false,
        guardian: '64bf9f81942202aa3f16025b',
        aip: '64bf9f64942202aa3f160259',
        schedule: '64cfa302dcd3b0787689184c',
        note: 'Aip is happier than yesterday.',
        deadline: undefined,
      };

      jest.spyOn(scheduleModel, 'findById').mockResolvedValue(null);

      await expect(taskService.create(createTaskDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(scheduleModel.findById).toHaveBeenCalledWith(
        createTaskDto.schedule,
      );
    });
    it("should throw BadRequestException when the schedule doesn't repeat every week but the task request it to be repeated", async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Clean the house',
        detail: 'Clean the first floor',
        isDone: false,
        isCycle: true,
        guardian: '64bf9f81942202aa3f16025b',
        aip: '64bf9f64942202aa3f160259',
        schedule: '64cfa302dcd3b0787689184c',
        note: 'Aip is happier than yesterday.',
        deadline: undefined,
      };

      jest.spyOn(scheduleModel, 'findById').mockResolvedValue(scheduleTest);

      await expect(taskService.create(createTaskDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(scheduleModel.findById).toHaveBeenCalledWith(
        createTaskDto.schedule,
      );
    });
    it('should return the newly created task successfully', async () => {
      let createTaskDto: CreateTaskDto = {
        title: 'Clean the house',
        detail: 'Clean the first floor',
        isDone: false,
        isCycle: false,
        guardian: '64bf9f81942202aa3f16025b',
        aip: '64bf9f64942202aa3f160259',
        schedule: '64cfa302dcd3b0787689184c',
        note: 'Aip is happier than yesterday.',
        deadline: undefined,
      };

      jest.spyOn(scheduleModel, 'findById').mockResolvedValue(scheduleTest);
      jest
        .spyOn(taskModel, 'create')
        .mockImplementation(jest.fn().mockResolvedValueOnce(taskTest));

      const createdTask = await taskService.create(createTaskDto);

    //   expect(scheduleModel.findById).toHaveBeenCalledWith(
    //     createTaskDto.schedule,
    //   );

      expect(createdTask).toEqual(taskTest);
    });
  });
});
