import { ApiProperty } from '@nestjs/swagger';

export class CreateAmenityDto {
  @ApiProperty()
  name: string;
}
