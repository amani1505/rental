import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    try {
      const { email } = createUserDto;

      const existingUser = await this._userModel.findOne({ email });
      if (existingUser) {
        throw new NotFoundException('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;

    
      const createdUser = new this._userModel(createUserDto);
      const savedUser = await createdUser.save();

      // Remove the password field before returning
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = savedUser.toObject();
      return userWithoutPassword;
    } catch (error) {
      throw new HttpException(
        `Failed to create user: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async findAll(): Promise<Partial<User>[]> {
    try {
      const users = await this._userModel.find().select('-password').exec();
      return users.map((user) => user.toObject());
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve users: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this._userModel
        .findById(id)
        .select('-password')
        .exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user.toObject();
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this._userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .select('-password')
        .exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user.toObject();
    } catch (error) {
      throw new HttpException(
        `Failed to update user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this._userModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      throw new HttpException(
        `Failed to delete user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOneByEmail(email: string): Promise<UserDocument | null> {
    try {
      const user = await this._userModel.findOne({ email }).exec();
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve user by email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
