import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseTeddyUrlException extends HttpException {
  constructor(
    message: string = 'BaseTeddyUrlException error.',
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
  }
}
