import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum MediaType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
}

export class UploadMediaDto {
  @ApiProperty({ enum: MediaType, example: MediaType.PHOTO })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({ example: 0 })
  @IsNumber()
  order: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
