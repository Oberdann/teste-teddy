import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IUserService } from './contracts/user.service-use-case';
import { CreateUserDto } from './dto/user.user-create';
import * as bcrypt from 'bcrypt';
import { JwtGuard } from '../auth/auth-jwt.guard';

@Injectable()
export class UserService implements IUserService {
  constructor(private db: PrismaService) {}

  @UseGuards(JwtGuard)
  async getAllUsers(): Promise<CreateUserDto[]> {
    const users = await this.db.users.findMany();

    return users;
  }

  async createUser(userDto: CreateUserDto): Promise<CreateUserDto> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const userCreate = {
      ...userDto,
      password: hashedPassword,
    };

    const user = this.db.users.create({
      data: userCreate,
    });

    return user;
  }
}
