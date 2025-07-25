import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserModule } from './modules/user/user.module';
import { LoginModule } from './modules/login/login.module';
import { DatabaseModule } from './database/prisma.module';
import { JwtGlobalModule } from './modules/auth/jwt-global.module';
import { UrlModule } from './modules/url/url.module';

@Module({
  imports: [
    DatabaseModule,
    JwtGlobalModule,
    LoginModule,
    UserModule,
    UrlModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
