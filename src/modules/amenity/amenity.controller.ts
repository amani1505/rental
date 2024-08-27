import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AmenityService } from './amenity.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Amenity')
@Controller('amenity')
export class AmenityController {
  constructor(private readonly _amenityService: AmenityService) {}

  @Post()
  create(@Body() createAmenityDto: CreateAmenityDto) {
    return this._amenityService.create(createAmenityDto);
  }

  @Get()
  findAll() {
    return this._amenityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._amenityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAmenityDto: UpdateAmenityDto) {
    return this._amenityService.update(id, updateAmenityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._amenityService.remove(id);
  }
}
