import {
  IsString,
  IsEmail,
  IsUUID,
  IsDateString,
  IsOptional,
  IsEnum,
  IsNumber,
  MinLength,
} from 'class-validator';
import { QuoteStatus } from './quote.entity';

export class CreateQuoteDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  phone: string;

  @IsString()
  @MinLength(10)
  address: string;

  @IsDateString()
  expectedDeliveryDate: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsUUID()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  productPrice: number;
}

export class UpdateQuoteDto {
  @IsOptional()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus;
}
