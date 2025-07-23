import { Controller, Get, HttpCode } from '@nestjs/common';
import { IUserService } from './interfaces/user.service-use-case';

@Controller('user')
export class UserController {
  constructor(private readonly userService: IUserService) {}

  @HttpCode(200)
  @Get('allUsers')
  async getAllUsers() {
    const users = await this.userService.getAllUsers();

    return { message: 'Usuarios encontrados', data: users };
  }
}
