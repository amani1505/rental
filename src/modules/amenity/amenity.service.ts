import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Amenity, AmenityDocument } from './schemas/amenity.schema';

@Injectable()
export class AmenityService {
  constructor(
    @InjectModel(Amenity.name) private _amenityModel: Model<AmenityDocument>,
  ) {}

  async create(createAmenityDto: CreateAmenityDto): Promise<Amenity> {
    try {
      const amenity = new this._amenityModel(createAmenityDto);
      return await amenity.save();
    } catch (error) {
      throw new HttpException(
        `Failed to create amenity: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<Amenity[]> {
    try {
      return await this._amenityModel.find().exec();
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve amenities: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(amenityId: string): Promise<Amenity> {
    try {
      const amenity = await this._amenityModel.findById(amenityId).exec();
      if (!amenity) {
        throw new NotFoundException('Amenity not found');
      }
      return amenity;
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve amenity: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    amenityId: string,
    updateAmenityDto: UpdateAmenityDto,
  ): Promise<Amenity> {
    try {
      const amenity = await this._amenityModel
        .findByIdAndUpdate(amenityId, updateAmenityDto, { new: true })
        .exec();
      if (!amenity) {
        throw new NotFoundException('Amenity not found');
      }
      return amenity;
    } catch (error) {
      throw new HttpException(
        `Failed to update amenity: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(amenityId: string): Promise<void> {
    try {
      const result = await this._amenityModel
        .findByIdAndDelete(amenityId)
        .exec();
      if (!result) {
        throw new NotFoundException('Amenity not found');
      }
    } catch (error) {
      throw new HttpException(
        `Failed to delete amenity: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
