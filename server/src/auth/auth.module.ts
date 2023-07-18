import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStratery } from './strategies/access-token.stratery';
import { RefreshTokenStratery } from './strategies/refresh-token.stratery';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  providers: [AccessTokenStratery, RefreshTokenStratery, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
