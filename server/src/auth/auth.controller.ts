import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RefreshTokenGuard } from '../common/guards/refresh-token.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.signUp(createAdminDto);
  }
  @Post('signin')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logOut(@Req() req: Request) {
    const id = req.user['sub'];
    return this.authService.logOut(id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshingToken(@Req() req: Request) {
    const id = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshingToken(id, refreshToken);
  }
}
