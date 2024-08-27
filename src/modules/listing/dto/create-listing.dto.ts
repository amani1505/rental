import { ApiProperty } from '@nestjs/swagger';

export class CreateListingDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  pricePerNight: number;

  @ApiProperty()
  amenities: Array<string>;

  @ApiProperty()
  images: Array<string>;
}
