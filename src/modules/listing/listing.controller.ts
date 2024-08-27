import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ListingService } from './listing.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('listings')
export class ListingController {
  constructor(private readonly _listingService: ListingService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('listing', 2, {
      storage: diskStorage({
        destination: './uploads/listings',
        filename: (req: any, file: any, callback: any) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @Body() createListingDto: CreateListingDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this._listingService.create(createListingDto, files);
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
