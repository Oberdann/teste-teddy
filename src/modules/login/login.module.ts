import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { AuthJwtGuard } from '../auth/auth.module';

@Module({
  imports: [],
  controllers: [LoginController],
  providers: [
    {
      provide: 'ILoginService',
      useClass: LoginService,
    },
    AuthJwtGuard,
  ],
})
export class LoginModule {}
