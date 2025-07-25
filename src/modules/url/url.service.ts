import { Injectable } from '@nestjs/common';
import { Urls } from '@prisma/client';
import { IUrlService } from './contracts/url.service-use-case';
import { UrlResponseDto } from './dto/url-response';
import { UrlCreateDto } from './dto/url-create';
import { UrlUpdateDto } from './dto/url-update';
import { PrismaService } from 'src/database/prisma.service';
import { UrlForbiddenException } from './exceptions/url-forbidden-exception';
import { UrlNotFoundException } from './exceptions/url-not-found.exception';

@Injectable()
export class UrlService implements IUrlService {
  constructor(private prisma: PrismaService) {}

  async createShortUrl(
    data: UrlCreateDto,
    userId?: string,
  ): Promise<UrlResponseDto> {
    const shortCode = await this.generateUniqueShortCode();

    const url = await this.prisma.urls.create({
      data: {
        originalUrl: data.originalUrl,
        shortCode,
        userId: userId ?? null,
        clickCount: 0,
        deletedAt: null,
      },
    });

    const response = this.toResponseDto(url);

    return response;
  }

  async getAllUrl(userId: string): Promise<UrlResponseDto[]> {
    const urls: Urls[] = await this.prisma.urls.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const response = urls.map((url) => this.toResponseDto(url));

    return response;
  }

  async updateOriginalUrl(
    id: string,
    data: UrlUpdateDto,
    userId: string,
  ): Promise<UrlResponseDto> {
    const url = await this.prisma.urls.findUnique({ where: { id } });

    if (!url || url.deletedAt) {
      throw new UrlNotFoundException('URL não encontrada');
    }

    if (url.userId !== userId) {
      throw new UrlForbiddenException('Sem permissão para atualizar');
    }

    const updated = await this.prisma.urls.update({
      where: { id },
      data: {
        originalUrl: data.originalUrl,
      },
    });

    const response = this.toResponseDto(updated);

    return response;
  }

  async deleteUrl(id: string, userId: string): Promise<void> {
    const url = await this.prisma.urls.findUnique({ where: { id } });

    if (!url || url.deletedAt) {
      throw new UrlNotFoundException('URL não encontrada');
    }

    if (url.userId !== userId) {
      throw new UrlForbiddenException('Sem permissão para atualizar');
    }

    await this.prisma.urls.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async redirectAndCountClicks(shortCode: string): Promise<string> {
    const url = await this.prisma.urls.findFirst({
      where: { shortCode, deletedAt: null },
    });

    if (!url) {
      throw new UrlNotFoundException('URL não encontrada');
    }

    await this.prisma.urls.update({
      where: { id: url.id },
      data: {
        clickCount: { increment: 1 },
      },
    });

    const response = url.originalUrl;

    return response;
  }

  private generateShortCode(length = 6): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  private async generateUniqueShortCode(): Promise<string> {
    let code: string;

    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    let exists: Urls | null;

    do {
      code = this.generateShortCode();
      exists = await this.prisma.urls.findUnique({
        where: { shortCode: code },
      });
    } while (exists);

    return code;
  }

  private toResponseDto(url: Urls): UrlResponseDto {
    return {
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clickCount: url.clickCount,
      createdAt: url.createdAt.toISOString(),
      updatedAt: url.updatedAt.toISOString(),
      userId: url.userId ?? undefined,
    };
  }
}
