import { UrlCreateDto } from '../dto/url-create';
import { UrlResponseDto } from '../dto/url-response';
import { UrlUpdateDto } from '../dto/url-update';

export interface IUrlService {
  getAllUrl(userId: string): Promise<UrlResponseDto[]>;
  createShortUrl(data: UrlCreateDto, userId?: string): Promise<UrlResponseDto>;
  updateOriginalUrl(
    id: string,
    data: UrlUpdateDto,
    userId: string,
  ): Promise<UrlResponseDto>;
  deleteUrl(id: string, userId: string): Promise<void>;
  redirectAndCountClicks(shortCode: string): Promise<string>;
}
