import { LoginUnauthorizedException } from './exceptions/login-unauthorized-exception';
import { ILoginService } from './contracts/user.service-use-case';
import { PrismaService } from 'src/database/prisma.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService implements ILoginService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.db.users.findFirst({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new LoginUnauthorizedException(
        'Usuário não encontrado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new LoginUnauthorizedException(
        'Credenciais inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userPayload = {
      id: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(userPayload);

    return token;
  }
}
