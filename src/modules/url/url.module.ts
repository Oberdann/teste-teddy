import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UrlService } from './url.service';
import { OptionalJwtGuard } from '../auth/auth.optional-jwt.guard';
import { UrlController } from './url.controller';

@Module({
  imports: [],
  controllers: [UrlController],
  providers: [
    {
      provide: 'IUrlService',
      useClass: UrlService,
    },
    PrismaService,
    OptionalJwtGuard,
  ],
})
export class UrlModule {}
