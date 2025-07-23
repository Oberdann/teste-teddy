import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
