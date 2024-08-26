import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Listing, ListingDocument } from './schemas/listing.schema';
import { Model } from 'mongoose';

@Injectable()
export class ListingService {
  constructor(
    @InjectModel(Listing.name) private _listingModel: Model<ListingDocument>,
  ) {}

  async create(createListingDto: CreateListingDto): Promise<Listing> {
    const listing = new this._listingModel(createListingDto);
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

  async remove(listingId: string): Promise<void> {
    const result = await this._listingModel.findByIdAndDelete(listingId).exec();
    if (!result) {
      throw new NotFoundException('Listing not found');
    }
  }
}
