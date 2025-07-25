import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { IUrlService } from './contracts/url.service-use-case';
import { UrlCreateDto } from './dto/url-create';
import { JwtGuard } from '../auth/auth-jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestWithUser } from '../auth/dto/request-with-user';
import { UrlUpdateDto } from './dto/url-update';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: IUrlService) {}

  @HttpCode(201)
  @Post()
  async create(@Body() data: UrlCreateDto, @Req() req: RequestWithUser) {
    const userId = req.user?.id;

    const urlResponse = await this.urlService.createShortUrl(data, userId);

    return { message: 'Url criada com sucesso', data: urlResponse };
  }

  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Get()
  async findAll(@Req() req: RequestWithUser) {
    const userId = req.user?.id;

    const urlsResponse = await this.urlService.getAllUrl(userId);

    return { message: 'Url enconstradas com sucesso', data: urlsResponse };
  }

  @HttpCode(200)
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UrlUpdateDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.id;

    const urlResponse = await this.urlService.updateOriginalUrl(
      id,
      data,
      userId,
    );

    return { message: 'Url atualizada com sucesso', data: urlResponse };
  }

  @HttpCode(204)
  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user?.id;

    await this.urlService.deleteUrl(id, userId);
  }
}
