import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private _paymentModel: Model<PaymentDocument>,
  ) {}

  async processPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<{ message: string }> {
    const { bookingId, amount, paymentMethod } = createPaymentDto;

    const payment = new this._paymentModel({
      bookingId,
      amount,
      paymentMethod,
      paymentStatus: 'Completed',
    });

    await payment.save();

    return { message: 'Payment processed successfully' };
  }

  async findPaymentsByUser(userId: string): Promise<Payment[]> {
    return this._paymentModel
      .find()
      .populate({
        path: 'bookingId',
        match: { guestId: userId },
      })
      .exec();
  }
}
