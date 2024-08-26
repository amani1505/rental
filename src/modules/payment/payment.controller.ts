import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly _paymentService: PaymentService) {}

  @Post()
  async processPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this._paymentService.processPayment(createPaymentDto);
  }

  @Get(':userId')
  async findPaymentsByUser(@Param('userId') userId: string) {
    return this._paymentService.findPaymentsByUser(userId);
  }
}
