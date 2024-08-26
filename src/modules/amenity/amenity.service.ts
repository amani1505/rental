import { Injectable, NotFoundException } from '@nestjs/common';
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
    const amenity = new this._amenityModel(createAmenityDto);
    return amenity.save();
  }

  async findAll(): Promise<Amenity[]> {
    return this._amenityModel.find().exec();
  }
  async findOne(amenityId: string): Promise<Amenity> {
    const amenity = await this._amenityModel.findById(amenityId).exec();
    if (!amenity) {
      throw new NotFoundException('Amenity not found');
    }
    return amenity;
  }

  async update(
    amenityId: string,
    updateAmenityDto: UpdateAmenityDto,
  ): Promise<Amenity> {
    const amenity = await this._amenityModel
      .findByIdAndUpdate(amenityId, updateAmenityDto, { new: true })
      .exec();
    if (!amenity) {
      throw new NotFoundException('Amenity not found');
    }
    return amenity;
  }

  async remove(amenityId: string): Promise<void> {
    const result = await this._amenityModel.findByIdAndDelete(amenityId).exec();
    if (!result) {
      throw new NotFoundException('Amenity not found');
    }
  }
}
