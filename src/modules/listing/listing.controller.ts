import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';

@Controller('listing')
export class ListingController {
  constructor(private readonly _listingService: ListingService) {}

  @Post()
  create(@Body() createListingDto: CreateListingDto) {
    return this._listingService.create(createListingDto);
  }

  @Get()
  findAll() {
    return this._listingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this._listingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
    return this._listingService.update(id, updateListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this._listingService.remove(id);
  }
}
