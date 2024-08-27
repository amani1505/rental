/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@modules/users/users.service';
import { LoginDto } from '@modules/users/dto/login.dto';
import { User, UserDocument } from '@modules/users/schemas/user.schema';
import { Document } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UsersService,
    private _jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user: UserDocument = await this._userService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;

      return result;
    }
    return null;
  }
  async login(user: LoginDto) {
    const payload = {
      email: user.email,
      //   sub: {
      //     name: user.role,
      //   },
    };

    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      accessToken: this._jwtService.sign(payload),
      refreshToken: this._jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
  async refreshToken(user: User) {
    const payload = {
      email: user.email,
      // sub: {
      //   name: user.role,
      // },
    };

    return {
      accessToken: this._jwtService.sign(payload),
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = this._jwtService.verify(token);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
