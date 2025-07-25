import { HttpStatus } from '@nestjs/common';
import { BaseTeddyUrlException } from 'src/exception/base-teddy-url-exception';

export class UrlForbiddenException extends BaseTeddyUrlException {
  constructor(
    message: string = 'UrlForbiddenException error.',
    statusCode: number = HttpStatus.UNAUTHORIZED,
  ) {
    super(message, statusCode);
  }
}
