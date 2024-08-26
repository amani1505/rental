import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private _reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = new this._reviewModel(createReviewDto);
    return review.save();
  }

  async findAll(): Promise<Review[]> {
    return this._reviewModel.find().populate('listingId guestId').exec();
  }
  async findOne(reviewId: string): Promise<Review> {
    const review = await this._reviewModel
      .findById(reviewId)
      .populate('listingId guestId')
      .exec();
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async update(
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this._reviewModel
      .findByIdAndUpdate(reviewId, updateReviewDto, { new: true })
      .exec();
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  async remove(reviewId: string): Promise<void> {
    const result = await this._reviewModel.findByIdAndDelete(reviewId).exec();
    if (!result) {
      throw new NotFoundException('Review not found');
    }
  }
}
