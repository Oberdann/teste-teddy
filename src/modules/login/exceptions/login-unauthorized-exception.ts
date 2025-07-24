import { HttpStatus } from '@nestjs/common';
import { BaseTeddyUrlException } from 'src/exception/base-teddy-url-exception';

export class LoginUnauthorizedException extends BaseTeddyUrlException {
  constructor(
    message: string = 'LoginException error.',
    statusCode: number = HttpStatus.UNAUTHORIZED,
  ) {
    super(message, statusCode);
  }
}
