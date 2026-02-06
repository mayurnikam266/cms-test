import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, IsNotEmpty } from 'class-validator';
import { AnnouncementStatus } from './announcement.entity';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  imageKey: string;

  @IsEnum(AnnouncementStatus)
  @IsOptional()
  status?: AnnouncementStatus;

  @IsInt()
  @IsOptional()
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateAnnouncementDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  imageKey?: string;

  @IsEnum(AnnouncementStatus)
  @IsOptional()
  status?: AnnouncementStatus;

  @IsInt()
  @IsOptional()
  displayOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
