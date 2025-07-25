import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UrlCreateDto {
  @ApiProperty({
    description: 'URL original a ser encurtada',
    example: 'https://teddy360.com.br',
  })
  @IsNotEmpty({ message: 'A URL original é obrigatória' })
  @IsUrl({}, { message: 'A URL deve ser válida' })
  originalUrl: string;
}
