import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private _bookingModel: Model<BookingDocument>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const booking = new this._bookingModel(createBookingDto);
    return booking.save();
  }

  async findAll(): Promise<Booking[]> {
    return this._bookingModel.find().populate('listingId guestId').exec();
  }
  async findOne(bookingId: string): Promise<Booking> {
    const booking = await this._bookingModel
      .findById(bookingId)
      .populate('listingId guestId')
      .exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async update(
    bookingId: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    const booking = await this._bookingModel
      .findByIdAndUpdate(bookingId, updateBookingDto, { new: true })
      .exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async remove(bookingId: string): Promise<void> {
    const result = await this._bookingModel.findByIdAndDelete(bookingId).exec();
    if (!result) {
      throw new NotFoundException('Booking not found');
    }
  }
}
