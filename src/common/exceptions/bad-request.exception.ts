import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message: string, status: HttpStatus, errorCode?: string) {
    super(
      {
        statusCode: status,
        message,
        errorCode: errorCode || null,
      },
      status,
    );
  }
}
