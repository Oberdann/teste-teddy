import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UrlService } from 'src/modules/url/url.service';
import { UrlCreateDto } from 'src/modules/url/dto/url-create';
import { UrlUpdateDto } from 'src/modules/url/dto/url-update';

describe('UrlService', () => {
  let service: UrlService;

  // Mock básico para prisma.urls
  const prismaMock = {
    urls: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get<UrlService>(UrlService);

    jest.clearAllMocks();
  });

  describe('createShortUrl', () => {
    it('should create a short URL and return UrlResponseDto', async () => {
      // forçamos o código curto fixo para testar
      jest
        .spyOn(service as any, 'generateUniqueShortCode')
        .mockResolvedValue('abc123');

      const input: UrlCreateDto = { originalUrl: 'https://example.com' };
      const prismaReturn = {
        id: 'url-id-1',
        originalUrl: input.originalUrl,
        shortCode: 'abc123',
        userId: 'user-1',
        clickCount: 0,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.urls.create.mockResolvedValue(prismaReturn);

      const result = await service.createShortUrl(input, 'user-1');

      expect(prismaMock.urls.create).toHaveBeenCalledWith({
        data: {
          originalUrl: input.originalUrl,
          shortCode: 'abc123',
          userId: 'user-1',
          clickCount: 0,
          deletedAt: null,
        },
      });

      expect(result).toEqual({
        id: prismaReturn.id,
        originalUrl: prismaReturn.originalUrl,
        shortCode: prismaReturn.shortCode,
        clickCount: 0,
        createdAt: prismaReturn.createdAt.toISOString(),
        updatedAt: prismaReturn.updatedAt.toISOString(),
        userId: prismaReturn.userId,
      });
    });
  });

  describe('getAllUrl', () => {
    it('should return list of UrlResponseDto', async () => {
      const prismaReturn = [
        {
          id: 'url-1',
          originalUrl: 'https://a.com',
          shortCode: 'abc',
          clickCount: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user-1',
          deletedAt: null,
        },
        {
          id: 'url-2',
          originalUrl: 'https://b.com',
          shortCode: 'def',
          clickCount: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user-1',
          deletedAt: null,
        },
      ];

      prismaMock.urls.findMany.mockResolvedValue(prismaReturn);

      const result = await service.getAllUrl('user-1');

      expect(prismaMock.urls.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', deletedAt: null },
        orderBy: { updatedAt: 'desc' },
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(prismaReturn[0].id);
      expect(result[1].id).toBe(prismaReturn[1].id);
    });
  });

  describe('updateOriginalUrl', () => {
    const id = 'url-123';
    const userId = 'user-1';

    it('should update URL if found and user owns it', async () => {
      const urlDb = {
        id,
        originalUrl: 'https://old.com',
        userId,
        deletedAt: null,
      };
      const updateDto: UrlUpdateDto = { originalUrl: 'https://new.com' };
      const updatedUrl = {
        ...urlDb,
        originalUrl: updateDto.originalUrl,
        updatedAt: new Date(),
        createdAt: new Date(),
        clickCount: 0,
        shortCode: 'short',
      };

      prismaMock.urls.findUnique.mockResolvedValue(urlDb);
      prismaMock.urls.update.mockResolvedValue(updatedUrl);

      const result = await service.updateOriginalUrl(id, updateDto, userId);

      expect(prismaMock.urls.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(prismaMock.urls.update).toHaveBeenCalledWith({
        where: { id },
        data: { originalUrl: updateDto.originalUrl },
      });
      expect(result.originalUrl).toBe(updateDto.originalUrl);
    });

    it('should throw NotFoundException if URL not found or deleted', async () => {
      prismaMock.urls.findUnique.mockResolvedValue(null);

      await expect(
        service.updateOriginalUrl(id, { originalUrl: 'x' }, userId),
      ).rejects.toThrow(NotFoundException);

      prismaMock.urls.findUnique.mockResolvedValue({
        id,
        deletedAt: new Date(),
      });

      await expect(
        service.updateOriginalUrl(id, { originalUrl: 'x' }, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if userId does not match', async () => {
      prismaMock.urls.findUnique.mockResolvedValue({
        id,
        originalUrl: 'https://old.com',
        userId: 'other-user',
        deletedAt: null,
      });

      await expect(
        service.updateOriginalUrl(id, { originalUrl: 'x' }, userId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deleteUrl', () => {
    const id = 'url-456';
    const userId = 'user-1';

    it('should mark URL as deleted if user owns it', async () => {
      const urlDb = { id, userId, deletedAt: null };

      prismaMock.urls.findUnique.mockResolvedValue(urlDb);
      prismaMock.urls.update.mockResolvedValue(undefined);

      await service.deleteUrl(id, userId);

      expect(prismaMock.urls.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(prismaMock.urls.update).toHaveBeenCalledWith({
        where: { id },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException if URL not found or deleted', async () => {
      prismaMock.urls.findUnique.mockResolvedValue(null);

      await expect(service.deleteUrl(id, userId)).rejects.toThrow(
        NotFoundException,
      );

      prismaMock.urls.findUnique.mockResolvedValue({
        id,
        deletedAt: new Date(),
      });

      await expect(service.deleteUrl(id, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if userId does not match', async () => {
      prismaMock.urls.findUnique.mockResolvedValue({
        id,
        userId: 'other-user',
        deletedAt: null,
      });

      await expect(service.deleteUrl(id, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('redirectAndCountClicks', () => {
    it('should return original URL and increment clickCount', async () => {
      const shortCode = 'abc123';
      const urlDb = {
        id: 'url-1',
        originalUrl: 'https://example.com',
        deletedAt: null,
      };

      prismaMock.urls.findFirst.mockResolvedValue(urlDb);
      prismaMock.urls.update.mockResolvedValue(undefined);

      const result = await service.redirectAndCountClicks(shortCode);

      expect(prismaMock.urls.findFirst).toHaveBeenCalledWith({
        where: { shortCode, deletedAt: null },
      });
      expect(prismaMock.urls.update).toHaveBeenCalledWith({
        where: { id: urlDb.id },
        data: { clickCount: { increment: 1 } },
      });
      expect(result).toBe(urlDb.originalUrl);
    });

    it('should throw NotFoundException if URL not found', async () => {
      prismaMock.urls.findFirst.mockResolvedValue(null);

      await expect(service.redirectAndCountClicks('notfound')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('generateUniqueShortCode', () => {
    it('should generate a unique short code', async () => {
      // Simula que o primeiro código já existe e o segundo não
      const existingCode = 'abc123';
      const newCode = 'def456';

      // Mock da função generateShortCode para controlar valores
      const spyGenerateShortCode = jest.spyOn(
        service as any,
        'generateShortCode',
      );
      spyGenerateShortCode
        .mockReturnValueOnce(existingCode)
        .mockReturnValueOnce(newCode);

      prismaMock.urls.findUnique
        .mockResolvedValueOnce({ id: 'some-id' }) // já existe
        .mockResolvedValueOnce(null); // não existe

      const code = await (service as any).generateUniqueShortCode();

      expect(code).toBe(newCode);
      expect(prismaMock.urls.findUnique).toHaveBeenCalledTimes(2);
    });
  });
});
