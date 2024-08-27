import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty()
  listingId: string;

  @ApiProperty()
  checkIn: Date;

  @ApiProperty()
  checkOut: Date;

  @ApiProperty()
  totalPrice: number;
}
