/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Headers,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshJwtAuthGuard } from './guard/refresh-auth.guard';
import { UsersService } from '@modules/users/users.service';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '@modules/users/dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private _authService: AuthService,
    private _userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @ApiResponse({
    status: 201,
    description: 'you have succesfull login.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async login(@Body() createUserDto: LoginDto) {
    return await this._authService.login(createUserDto);
  }

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this._userService.create(createUserDto);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@Request() req: any) {
    return await this._authService.refreshToken(req.user);
  }

  @Get('signInWithToken')
  async signInWithToken(
    @Headers('authorization') authorizationHeader: string,
  ): Promise<{ message: string }> {
    try {
      const token = authorizationHeader.replace('Bearer ', ''); // Extract the token from the "Bearer " prefix
      const decodedUser = await this._authService.verifyToken(token);

      return { message: 'Sign-in with token successful' };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
