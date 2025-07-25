import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IUserService } from './contracts/user.service-use-case';
import { CreateUserDto } from './dto/user.user-create';
import { JwtGuard } from '../auth/auth-jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(200)
  @Get('allUsers')
  async getAllUsers() {
    const users = await this.userService.getAllUsers();

    const usersResponse = users.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password: _password, ...userWithoutPassword }) => userWithoutPassword,
    );

    return { message: 'Usuarios encontrados', data: usersResponse };
  }

  @HttpCode(201)
  @Post()
  async createUser(@Body() requestUser: CreateUserDto) {
    const user = await this.userService.createUser(requestUser);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = user;

    return { message: 'Usuário criado com sucesso', data: userResponse };
  }
}
