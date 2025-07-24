import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { ILoginService } from './contracts/user.service-use-case';
import { LoginDto } from './dto/login.interface';

@Controller('login')
export class LoginController {
  constructor(
    @Inject('ILoginService')
    private readonly loginService: ILoginService,
  ) {}

  @HttpCode(200)
  @Post()
  async login(@Body() requestLogin: LoginDto) {
    const tokenJwt = await this.loginService.login(requestLogin);

    return { message: 'Login realizado com sucesso', acess_token: tokenJwt };
  }
}
