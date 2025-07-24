import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty({ example: 'senhaSegura123' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;
}
