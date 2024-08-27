import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty()
  listingId: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  comment: string;
}
