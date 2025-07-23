import { Body, Controller, Get, HttpCode, Inject, Post } from '@nestjs/common';
import { IUserService } from './interfaces/user.service-use-case';
import { CreateUserDto } from './dto/user.user-create';

@Controller('user')
export class UserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @HttpCode(200)
  @Get('allUsers')
  async getAllUsers() {
    const users = await this.userService.getAllUsers();

    return { message: 'Usuarios encontrados', data: users };
  }

  @HttpCode(201)
  @Post('users')
  async createUser(@Body() requestUser: CreateUserDto) {
    const user = await this.userService.createUser(requestUser);

    return { message: 'Usuário criaro com sucesso', data: user };
  }
}
