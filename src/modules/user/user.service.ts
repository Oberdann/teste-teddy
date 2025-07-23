import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IUserService } from './interfaces/user.service-use-case';
import { User } from './dto/user.interface';
import { CreateUserDto } from './dto/user.user-create';

@Injectable()
export class UserService implements IUserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return await this.prisma.users.findMany();
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const user = this.prisma.users.create({
      data: userDto,
    });

    return user;
  }
}
