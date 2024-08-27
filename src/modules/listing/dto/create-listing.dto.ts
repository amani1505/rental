export class CreateListingDto {
  title: string;
  description: string;
  address: string;
  city: string;
  country: string;
  pricePerNight: number;
  amenities: Array<string>;
  images: Array<string>;
}
