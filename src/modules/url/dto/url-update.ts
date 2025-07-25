import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UrlUpdateDto {
  @ApiProperty({
    description: 'Nova URL original para atualizar',
    example: 'https://novo-destino.com',
  })
  @IsNotEmpty({ message: 'A URL original é obrigatória' })
  @IsUrl({}, { message: 'A URL deve ser válida' })
  originalUrl: string;
}
