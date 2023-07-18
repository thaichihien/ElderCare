import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';
import mongoose from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Admin.name)
    private adminModel: mongoose.Model<Admin>,
  ) {}

  async signUp(createAdminDto: CreateAdminDto) {
    // - Check admin exist

    const checkExist = await this.adminModel.findOne({
      username: createAdminDto.username,
    });

    if (checkExist) {
      throw new BadRequestException('admin is already exists');
    }

    // - Hash password
    const bcryptPassword = await this.hashPassword(createAdminDto.password);

    // - create ADmin
    createAdminDto.password = bcryptPassword;
    const newAdmin = await this.adminModel.create(createAdminDto);

    // - Generate 2 token
    const tokens = await this.generateTokens(
      newAdmin._id.toString(),
      newAdmin.username,
    );

    // - update refreshtoken in database
    await this.updateRefreshToken(newAdmin._id.toString(), tokens.refreshToken);

    return tokens;
  }

  async signIn(authDio: AuthDto) {
    const admin = await this.adminModel.findOne({ username: authDio.username });

    if (!admin) {
      throw new BadRequestException('Admin does not exist');
    }

    const validPassword = await bcrypt.compareSync(
      authDio.password,
      admin.password,
    );
    if (!validPassword) {
      throw new BadRequestException('password is wrong');
    }

    const tokens = await this.generateTokens(
      admin._id.toString(),
      admin.username,
    );
    await this.updateRefreshToken(admin._id.toString(), tokens.refreshToken);

    return tokens;
  }

  async logOut(id: string) {
    await this.adminModel.findByIdAndUpdate(id, {
      refresh_token: null,
    });
  }

  async refreshingToken(id: string, refreshToken: string) {
    const admin = await this.adminModel.findById(id);

    if (!admin || !admin.refresh_token) {
      throw new ForbiddenException('access denied');
    }

    const validRefreshToken = await bcrypt.compareSync(
      refreshToken,
      admin.refresh_token,
    );

    if (!validRefreshToken) {
      throw new ForbiddenException('access denied');
    }

    const tokens = await this.generateTokens(
      admin._id.toString(),
      admin.username,
    );
    await this.updateRefreshToken(admin._id.toString(), tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashRefreshToken = await this.hashPassword(refreshToken);
    await this.adminModel.findByIdAndUpdate(id, {
      refresh_token: hashRefreshToken,
    });
  }

  async hashPassword(source: string) {
    
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(source, salt);
    return bcryptPassword;
  }

  async generateTokens(id: string, username: string) {
    const payload = {
      sub: id,
      username,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: '1d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
