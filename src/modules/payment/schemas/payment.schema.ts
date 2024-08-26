import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  bookingId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  paymentMethod: string; // e.g., "Credit Card", "PayPal"

  @Prop({ required: true, enum: ['Pending', 'Completed'], default: 'Pending' })
  paymentStatus: string; // "Pending", "Completed"
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
