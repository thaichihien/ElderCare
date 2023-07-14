import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Model } from 'mongoose';
import { Admin } from './schemas/admin.schema';
import { getModelToken } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateAdminDto } from './dto/create-admin.dto';
import { BadRequestException } from '@nestjs/common';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { AccessTokenStratery } from './strategies/access-token.stratery';
import { RefreshTokenStratery } from './strategies/refresh-token.stratery';
import { AuthDto } from './dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let adminModel: Model<Admin>;

  const mockAdminModelService = {
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const adminTestAccount = {
    _id: '64b0f2e302dd5aabb031cd48',
    name: 'Hiện',
    username: 'chihien',
    password: '$2b$10$sEh5HQCf2WgDF3GHw2LX9OG2/zYYSt6zbzQl3wCCCHRJnixJvXRlu',
    createdAt: '2023-07-14T07:01:55.152Z',
    updatedAt: '2023-07-14T07:01:55.152Z',
    __v: 0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        ConfigService,
        JwtService,
        AuthService,
        {
          provide: getModelToken(Admin.name),
          useValue: mockAdminModelService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    adminModel = module.get<Model<Admin>>(getModelToken(Admin.name));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('signUp', () => {
  //   it('should return Bad request when admin account is already exist', async () => {
  //     jest.spyOn(adminModel, 'findOne').mockResolvedValue(adminTestAccount);

  //     const authBody: CreateAdminDto = {
  //       username: 'chihien',
  //       name: 'Hiện',
  //       password: '123456',
  //     };

  //     await expect(controller.signUp(authBody)).rejects.toThrow(
  //       BadRequestException,
  //     );

  //     expect(adminModel.findOne).toHaveBeenCalledWith({
  //       username: authBody.username,
  //     });
  //   });

  //   it('should return two token when created new admin account succesffully', async () => {
  //     const authBody: CreateAdminDto = {
  //       username: 'chihien',
  //       name: 'Hiện',
  //       password: '123456',
  //     };
      
  //     jest.spyOn(adminModel, 'findOne').mockResolvedValue(null)
  //     jest.spyOn(adminModel, 'create').mockImplementation(jest.fn().mockResolvedValueOnce( adminTestAccount ))
  //     jest.spyOn(adminModel, 'findByIdAndUpdate');

      

  //     const tokens = await controller.signUp(authBody);

  //     expect(tokens).toHaveProperty('accessToken', 'refreshToken');

  //     expect(adminModel.findOne).toHaveBeenCalledWith({
  //       username: authBody.username,
  //     });
  //     expect(adminModel.findByIdAndUpdate).toHaveBeenCalled();
  //   });
  // });

  // describe('signIn', () => {
  //   //it('should return Bad Request when admin with username does not exist');

  //   //it('should return Bad request when the password is wrong');

  //   it('should return two token when created sign in succesffully', async () => {
  //     jest.spyOn(adminModel, 'findOne').mockResolvedValue(adminTestAccount);
  //     jest.spyOn(adminModel, 'findByIdAndUpdate');

  //     const authBody: AuthDto = {
  //       username: 'chihien',
  //       password: '123456',
  //     };

  //     const tokens = await controller.signIn(authBody);

  //     expect(tokens).toHaveProperty('accessToken', 'refreshToken');

  //     expect(adminModel.findOne).toHaveBeenCalledWith({
  //       username: authBody.username,
  //     });
  //     expect(adminModel.findByIdAndUpdate).toHaveBeenCalled();
  //   });
  // });

  // describe('logOut', () => {
  //   it('should return Unauthorized when no access token in header');

  //   it('return should successfully status when log out admin account');
  // });

  // describe('refresh token', () => {
  //   it('should return Unauthorized when no refresh token in header');
  // });
});
