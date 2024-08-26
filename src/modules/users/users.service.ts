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

      // Check if the email is already registered
      const existingUser = await this._userModel.findOne({ email });
      if (existingUser) {
        throw new NotFoundException('Email already registered');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;

      // Create and save the user
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
  async findAll() {
    return await this._userModel.find().populate('institute').exec();
  }

  async findOne(id: string): Promise<User> {
    const review = await this._userModel.findById(id).exec();
    if (!review) {
      throw new NotFoundException('user not found');
    }
    return review;
  }

  async update(id: string, updateuserDto: UpdateUserDto): Promise<User> {
    const review = await this._userModel
      .findByIdAndUpdate(id, updateuserDto, { new: true })
      .exec();
    if (!review) {
      throw new NotFoundException('user not found');
    }
    return review;
  }

  async remove(id: string): Promise<void> {
    const result = await this._userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('user not found');
    }
  }
  async findOneByEmail(email: string): Promise<User> {
    const user = await this._userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
