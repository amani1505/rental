import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { ReviewModule } from './modules/review/review.module';
import { AmenityModule } from './modules/amenity/amenity.module';
import { BookingModule } from './modules/booking/booking.module';
import { ListingModule } from './modules/listing/listing.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
        dbName: configService.get<string>('DB_NAME'),
      }),
    }),
    UsersModule,
    ListingModule,
    BookingModule,
    AmenityModule,
    ReviewModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
