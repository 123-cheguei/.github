import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, MaxLength } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @MaxLength(100)
  displayName: string;

  @ApiProperty({ example: 'Profissional experiente...', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ example: 'São Paulo, SP', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  location?: string;

  @ApiProperty({
    example: [
      { name: 'Consulta', duration: '1h', description: 'Consulta individual' },
    ],
    required: false,
  })
  @IsObject({ each: true })
  @IsOptional()
  services?: any[];

  @ApiProperty({
    example: {
      currency: 'BRL',
      hourly: 200,
      session: 300,
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  pricing?: any;

  @ApiProperty({
    example: {
      monday: ['09:00-17:00'],
      tuesday: ['09:00-17:00'],
      wednesday: ['09:00-17:00'],
    },
    required: false,
  })
  @IsObject()
  @IsOptional()
  availability?: any;
}
