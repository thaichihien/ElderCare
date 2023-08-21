import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AipService } from './aip.service';
import { Aip } from './schemas/aip.schema';
import { AipDto } from './dto/aip.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import Task from '../task/schemas/task.schema';
import { Guardian } from '../guardian/schemas/guardian.schema';
import { ImageModule } from 'src/image/image.module';
import { Report } from 'src/report/schemas/report.schema';

describe('GuardianService', () => {

  // các biến dịch vụ sẽ thực hiện unit test
  let aipService: AipService;
  let aipModel: Model<Aip>;
  let guardianModel: Model<Guardian>;

  // Các hàm thực hiện mock (giả lập) cho unit tets
  const mockAipModel = {
    findById: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  // Dữ liệu mẫu
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

  // Thực hiện cài đặt môi trường test cho AipService
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
        {
          provide: getModelToken(Report.name),
          useValue: mockAipModel,
        },
      ],
    }).compile();

    aipService = module.get<AipService>(AipService);
    aipModel = module.get<Model<Aip>>(getModelToken(Aip.name));
    guardianModel = module.get<Model<Guardian>>(getModelToken(Guardian.name));
  });

  // Xóa các mock sau khi test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Thực hiện test tính năng tạo aip
  describe('create a aip', () => {

    // Unit test 1 : 
    it('should create new aip in database and return new aip', async () => {

      // Dữ liệu mẫu tạo aip
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

      // Thực hiện mock giá trị trả về null của hàm findOne của aipModel
      jest.spyOn(aipModel, 'findOne').mockResolvedValue(null);
      // Thực hiện mock giá trị trả về aipTest của hàm create của aipModel
      jest
        .spyOn(aipModel, 'create')
        .mockImplementation(jest.fn().mockResolvedValueOnce(aipTest));

      // Thực hiện unit test hàm create của aipService
      const newAip = await aipService.create(createAipDto);

      // Kiểm tra hàm findOne của aipModel có được gọi với tham số là CCCD của dữ liệu mẫu tạo
      expect(aipModel.findOne).toHaveBeenCalledWith({
        CCCD: createAipDto.CCCD,
      });

      // Kiểm tra hàm create của aipModel có được gọi với tham số là createAipDto
      expect(aipModel.create).toHaveBeenCalledWith(createAipDto);
      
      // Kiểm tra giá trị trả về từ aipService có trùng khớp với kết quả mong muốn
      expect(newAip).toEqual(aipTest);
    });

    // Unit test 2 :
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

      // Lần này thực hiện mock giá trị trả về là aipTest cho hàm findOne của aipModel
      jest.spyOn(aipModel, 'findOne').mockResolvedValue(aipTest);
      jest
        .spyOn(aipModel, 'create')
        .mockImplementation(jest.fn().mockResolvedValueOnce(aipTest));

      // Kiểm tra xem hàm create của aipService có ném ra BadRequestException không
      await expect(aipService.create(createAipDto)).rejects.toThrow(
        BadRequestException,
      );


      expect(aipModel.findOne).toHaveBeenCalledWith({
        CCCD: createAipDto.CCCD,
      });
    });
  });

  // Thực hiện test tính năng tìm aip bằng CCCD
  describe('find aip by CCCD', () => {

    // Unit test 1 :
    it('should find aip with this cccd in the database and return that aip', async () => {
      // Dữ liệu đầu vào mẫu
      const CCCDTest = '0865216548';

      // Thực hiện mock giá trị trả về là aipTest cho hàm findOne của aipModel
      jest.spyOn(aipModel, 'findOne').mockResolvedValue(aipTest);

      // Thực hiện unit test hàm findByCCCD của aipService
      const existAip = await aipService.findByCCCD(CCCDTest);

      
      expect(aipModel.findOne).toHaveBeenCalledWith({
        CCCD: CCCDTest,
      });

      // Kiểm tra kết quả có trùng khớp mong đợi
      expect(existAip).toEqual(aipTest);
    });

    // Unit test 2 :
    it('should throw NotFoundException when not find any aip with this cccd', async () => {
      
      const CCCDTest = '0865216548';

      // Thực hiện mock giá trị trả về là null
      jest.spyOn(aipModel, 'findOne').mockResolvedValue(null);

      // Kiểm tra có ném NotFoundException không
      await expect(aipService.findByCCCD(CCCDTest)).rejects.toThrow(
        NotFoundException,
      );
      expect(aipModel.findOne).toHaveBeenCalledWith({
        CCCD: CCCDTest,
      });
    });
  });

  // Thực hiện test tính năng gán guardian cho aip
  describe('assign guardian to aip', () => {

    //Unit test 1 :
    it('should throw BadRequestException when guardian with id is not found', async () => {

      // Dữ liệu đầu vào
      const aipId = aipTest._id;
      const guardianId = '64c9f0466a8c61cd08c9e19b';

      // Thực hiện mock giá trị trả về là null cho hàm findById của guardianModel
      jest.spyOn(guardianModel, 'findById').mockResolvedValue(null);

      // Kiểm tra có ném ra BadRequestException không
      await expect(
        aipService.assignGuardian(aipId, guardianId),
      ).rejects.toThrow(BadRequestException);

      expect(guardianModel.findById).toHaveBeenCalledWith(guardianId);
    });

    // Unit test 2:
    it('should throw BadRequestException when aip with id is not found', async () => {
      const aipId = aipTest._id;
      const guardianId = '64c9f0466a8c61cd08c9e19b';

      // Thực hiện mock giá trị trả về guardianTest và null
      jest.spyOn(guardianModel, 'findById').mockResolvedValue(guardianTest);
      jest.spyOn(aipModel, 'findByIdAndUpdate').mockResolvedValue(null);

      // Kiểm tra có ném ra BadRequestException không
      await expect(
        aipService.assignGuardian(aipId, guardianId),
      ).rejects.toThrow(BadRequestException);

      // Kiểm tra xem các hàm có được đúng không
      expect(guardianModel.findById).toHaveBeenCalledWith(guardianId);
      expect(aipModel.findByIdAndUpdate).toHaveBeenCalledWith(
        aipId,
        {
          guardian: guardianTest._id,
        },
        { new: true },
      );
    });

    // Unit test 3 :
    it('should return aip with guardian id when assign guardian to aip successfully', async () => {
      const aipId = aipTest._id;
      const guardianId = '64c9f0466a8c61cd08c9e19b';

      // Thực hiện mock giá trị trả về guardianTest và aipTestWithGuardian
      jest.spyOn(guardianModel, 'findById').mockResolvedValue(guardianTest);
      jest
        .spyOn(aipModel, 'findByIdAndUpdate')
        .mockResolvedValue(aipTestWithGuardian);

      // Thực hiện unit test cho hàm assignGuardian của aipService
      const aipWithGuardian = await aipService.assignGuardian(
        aipId,
        guardianId,
      );

      expect(guardianModel.findById).toHaveBeenCalledWith(guardianId);
      expect(aipModel.findByIdAndUpdate).toHaveBeenCalledWith(
        aipId,
        {
          guardian: guardianTest._id,
        },
        { new: true },
      );

      // Kiểm tra giá trị trả về có giống với kết quả mong muốn
      expect(aipWithGuardian).toEqual(aipTestWithGuardian);
    });
  });
});
