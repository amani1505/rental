import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Listing, ListingDocument } from './schemas/listing.schema';
import { Model } from 'mongoose';
import { unlinkSync } from 'fs';
import { User, UserDocument } from '@modules/users/schemas/user.schema';

@Injectable()
export class ListingService {
  constructor(
    @InjectModel(Listing.name) private _listingModel: Model<ListingDocument>,
    @InjectModel(User.name) private _userModel: Model<UserDocument>,
  ) {}

  async create(
    createListingDto: CreateListingDto,
    files: Array<Express.Multer.File>,
  ): Promise<Listing> {
    const imagePaths = files.map((file) => file.path);
    const listingData = {
      ...createListingDto,
      images: imagePaths,
    };
    const listing = new this._listingModel(listingData);
    return listing.save();
  }

  async findAll(): Promise<Listing[]> {
    return this._listingModel.find().populate('hostId amenities').exec();
  }
  async findOne(listingId: string): Promise<Listing> {
    const listing = await this._listingModel
      .findById(listingId)
      .populate('hostId amenities')
      .exec();
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }

  async update(
    listingId: string,
    updateListingDto: UpdateListingDto,
  ): Promise<Listing> {
    const listing = await this._listingModel
      .findByIdAndUpdate(listingId, updateListingDto, { new: true })
      .exec();
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }
    return listing;
  }

  async remove(id: string): Promise<string> {
    try {
      const listing = await this._listingModel.findById({
        id,
      });

      if (!listing) {
        throw new NotFoundException(`listing not found`);
      }

      for (const file of listing.images) {
        try {
          unlinkSync(file);
        } catch (error) {
          return JSON.stringify({
            message: `Failed to delete file:${error.message}`,
            status: 'error',
          });
        }
      }

      await this._listingModel.findByIdAndDelete(id).exec();

      return JSON.stringify({
        message: `Successfully removed listing with name ${listing.title}`,
        status: 'success',
      });
    } catch (error) {
      return JSON.stringify({
        message: `Failed to delete the listing: ${error.message}`,
        status: 'error',
      });
    }
  }
}
