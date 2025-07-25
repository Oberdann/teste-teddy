import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class UrlResponseDto {
  @ApiProperty({
    description: 'ID da URL',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'URL original informada pelo usuário',
    example: 'https://teddy360.com.br',
  })
  @IsUrl()
  originalUrl: string;

  @ApiProperty({
    description: 'Código encurtado da URL',
    example: 'a1b2c3',
  })
  @IsString()
  shortCode: string;

  @ApiProperty({
    description: 'Número de vezes que a URL foi acessada',
    example: 42,
  })
  clickCount: number;

  @ApiProperty({
    description: 'Data de criação da URL',
    example: '2024-07-24T15:03:23.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Data da última atualização da URL',
    example: '2024-07-25T12:10:45.000Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'ID do usuário (caso autenticado)',
    example: 'user-123',
    required: false,
  })
  @IsOptional()
  userId?: string;
}
