import { Test, TestingModule } from '@nestjs/testing';
import { TutorialService } from './tutorial.service';
import { Model } from 'mongoose';
import { Tutorial } from './schemas/tutorial.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('TutorialService', () => {
  let tutorialService: TutorialService;
  let tutorialModel: Model<Tutorial>;
  const mockTutorialService = {
    findById: jest.fn(),
  };
  const tutorialMock = {
    _id: '64abe3f639c6f4212c66b02b',
    title: 'NestJS Tutorial',
    author: 'Chi Hien',
    tag: 'Node JS',
    view: 7,
    createdAt: '2023-07-10T10:56:54.209Z',
    updatedAt: '2023-07-10T10:56:54.209Z',
    __v: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TutorialService,
        {
          provide: getModelToken(Tutorial.name),
          useValue: mockTutorialService,
        },
      ],
    }).compile();

    tutorialService = module.get<TutorialService>(TutorialService);
    tutorialModel = module.get<Model<Tutorial>>(getModelToken(Tutorial.name));
  });

  // it('should be defined', () => {
  //   expect(tutorialService).toBeDefined();
  // });

  describe('findById', () => {
    it('should find and return tutorial by id', async () => {
      jest.spyOn(tutorialModel, 'findById').mockResolvedValue(tutorialMock);

      const data = await tutorialService.findById(tutorialMock._id)
      expect(tutorialModel.findById).toHaveBeenCalledWith(tutorialMock._id)
      expect(data).toEqual(tutorialMock)
    });
  });
});
