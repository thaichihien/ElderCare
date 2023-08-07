import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AipService } from './aip.service';
import { Aip } from './schemas/aip.schema';
import { AipDto } from './dto/aip.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import Task from '../task/schemas/task.schema';
import { Guardian } from '../guardian/schemas/guardian.schema';

describe('GuardianService', () => {
  let aipService: AipService;

  let aipModel: Model<Aip>;
  let taskModel: Model<Task>;
  let guardianModel: Model<Guardian>;

  const mockAipModel = {
    findById: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const aipTest = {
    firstName: 'Nguyen',
    lastName: 'Phu',
    CCCD: '0865216548',
    phoneNumber: '0787888787',
    dateOfBirth: '12/06/2002',
    address: '135B Tran Hung Dao',
    healthStatus: 'Hay quên',
    note: 'Cần chăm sóc thường xuyên',
    _id: '64d04be7456803886df340bd',
    createdAt: '2023-08-07T01:41:59.956Z',
    updatedAt: '2023-08-07T01:41:59.956Z',
    __v: 0,
  };

  const aipTestWithGuardian = {
    firstName: 'Nguyen',
    lastName: 'Phu',
    CCCD: '0865216548',
    phoneNumber: '0787888787',
    dateOfBirth: '12/06/2002',
    address: '135B Tran Hung Dao',
    healthStatus: 'Hay quên',
    note: 'Cần chăm sóc thường xuyên',
    _id: '64d04be7456803886df340bd',
    createdAt: '2023-08-07T01:41:59.956Z',
    updatedAt: '2023-08-07T01:41:59.956Z',
    __v: 0,
    guardian: '64c9f0466a8c61cd08c9e19b',
  };
  const guardianTest = {
    _id: '64c9f0466a8c61cd08c9e19b',
    firstName: 'Nguyen',
    lastName: 'Phu',
    CCCD: '08652...',
    phoneNumber: '0787888787',
    dateOfBirth: '12/06/2002',
    address: '135B Tran Hung Dao',
    level: '0',
    certificates: [],
    experiences: [],
    createdAt: '2023-08-02T05:57:26.794Z',
    updatedAt: '2023-08-02T13:34:08.072Z',
    __v: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AipService,
        {
          provide: getModelToken(Aip.name),
          useValue: mockAipModel,
        },
        {
          provide: getModelToken(Task.name),
          useValue: mockAipModel,
        },
        {
          provide: getModelToken(Guardian.name),
          useValue: mockAipModel,
        },
      ],
    }).compile();

    aipService = module.get<AipService>(AipService);
    aipModel = module.get<Model<Aip>>(getModelToken(Aip.name));
    taskModel = module.get<Model<Task>>(getModelToken(Task.name));
    guardianModel = module.get<Model<Guardian>>(getModelToken(Guardian.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create a aip', () => {
    it('should create new aip in database and return new aip', async () => {
      const createAipDto: AipDto = {
        firstName: 'Nguyen',
        lastName: 'Phu',
        CCCD: '0865216548',
        phoneNumber: '0787888787',
        dateOfBirth: '12/06/2002',
        address: '135B Tran Hung Dao',
        healthStatus: 'Hay quên',
        note: 'Cần chăm sóc thường xuyên',
      };

      jest.spyOn(aipModel, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(aipModel, 'create')
        .mockImplementation(jest.fn().mockResolvedValueOnce(aipTest));

      const newAip = await aipService.create(createAipDto);

      expect(aipModel.findOne).toHaveBeenCalledWith({
        CCCD: createAipDto.CCCD,
      });
      expect(aipModel.create).toHaveBeenCalledWith(createAipDto);
      expect(newAip).toEqual(aipTest);
    });

    it('should throw BadRequestException when create aip with an existing CCCD in the database', async () => {
      const createAipDto: AipDto = {
        firstName: 'Nguyen',
        lastName: 'Phu',
        CCCD: '0865216548',
        phoneNumber: '0787888787',
        dateOfBirth: '12/06/2002',
        address: '135B Tran Hung Dao',
        healthStatus: 'Hay quên',
        note: 'Cần chăm sóc thường xuyên',
      };

      jest.spyOn(aipModel, 'findOne').mockResolvedValue(aipTest);
      jest
        .spyOn(aipModel, 'create')
        .mockImplementation(jest.fn().mockResolvedValueOnce(aipTest));

      await expect(aipService.create(createAipDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(aipModel.findOne).toHaveBeenCalledWith({
        CCCD: createAipDto.CCCD,
      });
    });
  });

  describe('find aip by CCCD', () => {
    it('should find aip with this cccd in the database and return that aip', async () => {
      const CCCDTest = '0865216548';

      jest.spyOn(aipModel, 'findOne').mockResolvedValue(aipTest);

      const existAip = await aipService.findByCCCD(CCCDTest);

      expect(aipModel.findOne).toHaveBeenCalledWith({
        CCCD: CCCDTest,
      });
      expect(existAip).toEqual(aipTest);
    });

    it('should throw NotFoundException when not find any aip with this cccd', async () => {
      const CCCDTest = '0865216548';

      jest.spyOn(aipModel, 'findOne').mockResolvedValue(null);

      await expect(aipService.findByCCCD(CCCDTest)).rejects.toThrow(
        NotFoundException,
      );
      expect(aipModel.findOne).toHaveBeenCalledWith({
        CCCD: CCCDTest,
      });
    });
  });

  describe('assign guardian to aip', () => {
    it('should throw BadRequestException when guardian with id is not found', async () => {
      const aipId = aipTest._id;
      const guardianId = '64c9f0466a8c61cd08c9e19b';

      jest.spyOn(guardianModel, 'findById').mockResolvedValue(null);

      await expect(
        aipService.assignGuardian(aipId, guardianId),
      ).rejects.toThrow(BadRequestException);

      expect(guardianModel.findById).toHaveBeenCalledWith(guardianId);
    });

    it('should throw BadRequestException when aip with id is not found', async () => {
      const aipId = aipTest._id;
      const guardianId = '64c9f0466a8c61cd08c9e19b';

      jest.spyOn(guardianModel, 'findById').mockResolvedValue(guardianTest);
      jest.spyOn(aipModel, 'findByIdAndUpdate').mockResolvedValue(null);

      await expect(
        aipService.assignGuardian(aipId, guardianId),
      ).rejects.toThrow(BadRequestException);

      expect(guardianModel.findById).toHaveBeenCalledWith(guardianId);
      expect(aipModel.findByIdAndUpdate).toHaveBeenCalledWith(
        aipId,
        {
          guardian: guardianTest._id,
        },
        { new: true },
      );
    });

    it('should return aip with guardian id when assign guardian to aip successfully', async () => {
      const aipId = aipTest._id;
      const guardianId = '64c9f0466a8c61cd08c9e19b';

      jest.spyOn(guardianModel, 'findById').mockResolvedValue(guardianTest);
      jest.spyOn(aipModel, 'findByIdAndUpdate').mockResolvedValue(aipTestWithGuardian);

      const aipWithGuardian = await aipService.assignGuardian(aipId, guardianId)

      expect(guardianModel.findById).toHaveBeenCalledWith(guardianId);
      expect(aipModel.findByIdAndUpdate).toHaveBeenCalledWith(
        aipId,
        {
          guardian: guardianTest._id,
        },
        { new: true },
      );

      expect(aipWithGuardian).toEqual(aipTestWithGuardian)


    });
  });
});
