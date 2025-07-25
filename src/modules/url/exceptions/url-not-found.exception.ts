import { HttpStatus } from '@nestjs/common';
import { BaseTeddyUrlException } from 'src/exception/base-teddy-url-exception';

export class UrlNotFoundException extends BaseTeddyUrlException {
  constructor(
    message: string = 'UrlNotFoundException error.',
    statusCode: number = HttpStatus.UNAUTHORIZED,
  ) {
    super(message, statusCode);
  }
}
