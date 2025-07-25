import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { RequestWithUser } from 'src/modules/auth/dto/request-with-user';
import { IUrlService } from 'src/modules/url/contracts/url.service-use-case';
import { UrlCreateDto } from 'src/modules/url/dto/url-create';
import { UrlUpdateDto } from 'src/modules/url/dto/url-update';
import { UrlController } from 'src/modules/url/url.controller';

describe('UrlController', () => {
  let urlController: UrlController;
  let urlService: IUrlService;

  const mockUrlService = {
    createShortUrl: jest.fn(),
    getAllUrl: jest.fn(),
    redirectAndCountClicks: jest.fn(),
    updateOriginalUrl: jest.fn(),
    deleteUrl: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: 'IUrlService',
          useValue: mockUrlService,
        },
      ],
    }).compile();

    urlController = module.get<UrlController>(UrlController);
    urlService = module.get<IUrlService>('IUrlService');

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a short URL and return success message with data', async () => {
      const dto: UrlCreateDto = {
        originalUrl: 'https://example.com',
      };
      const req = { user: { id: 'user-id-1' } } as RequestWithUser;

      const createdUrl = {
        id: 'url-id-1',
        originalUrl: dto.originalUrl,
        shortCode: 'abc123',
        userId: req.user.id,
      };

      mockUrlService.createShortUrl.mockResolvedValue(createdUrl);

      const result = await urlController.create(dto, req);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(urlService.createShortUrl).toHaveBeenCalledWith(dto, req.user.id);
      expect(result).toEqual({
        message: 'Url criada com sucesso',
        data: createdUrl,
      });
    });
  });

  describe('findAll', () => {
    it('should return all URLs for the user with success message', async () => {
      const req = { user: { id: 'user-id-2' } } as RequestWithUser;

      const urls = [
        { id: 'url1', originalUrl: 'https://a.com', shortCode: 'a1' },
        { id: 'url2', originalUrl: 'https://b.com', shortCode: 'b2' },
      ];

      mockUrlService.getAllUrl.mockResolvedValue(urls);

      const result = await urlController.findAll(req);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(urlService.getAllUrl).toHaveBeenCalledWith(req.user.id);
      expect(result).toEqual({
        message: 'Url enconstradas com sucesso',
        data: urls,
      });
    });
  });

  describe('redirect', () => {
    it('should redirect to the original URL', async () => {
      const shortCode = 'abc123';
      const originalUrl = 'https://example.com';

      const mockRes = {
        redirect: jest.fn(),
      } as unknown as Response;

      mockUrlService.redirectAndCountClicks.mockResolvedValue(originalUrl);

      await urlController.redirect(shortCode, mockRes);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(urlService.redirectAndCountClicks).toHaveBeenCalledWith(shortCode);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRes.redirect).toHaveBeenCalledWith(originalUrl);
    });
  });

  describe('update', () => {
    it('should update the URL and return success message with data', async () => {
      const id = 'url-id-123';
      const dto: UrlUpdateDto = {
        originalUrl: 'https://newurl.com',
      };
      const req = { user: { id: 'user-id-3' } } as RequestWithUser;

      const updatedUrl = {
        id,
        originalUrl: dto.originalUrl,
        shortCode: 'short123',
        userId: req.user.id,
      };

      mockUrlService.updateOriginalUrl.mockResolvedValue(updatedUrl);

      const result = await urlController.update(id, dto, req);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(urlService.updateOriginalUrl).toHaveBeenCalledWith(
        id,
        dto,
        req.user.id,
      );
      expect(result).toEqual({
        message: 'Url atualizada com sucesso',
        data: updatedUrl,
      });
    });
  });

  describe('remove', () => {
    it('should delete the URL and return no content', async () => {
      const id = 'url-id-999';
      const req = { user: { id: 'user-id-4' } } as RequestWithUser;

      mockUrlService.deleteUrl.mockResolvedValue(undefined);

      const result = await urlController.remove(id, req);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(urlService.deleteUrl).toHaveBeenCalledWith(id, req.user.id);
      expect(result).toBeUndefined();
    });
  });
});
