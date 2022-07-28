import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const data = (exception as any)?.response?.data;
    const status = data?.statusCode ?? 400;

    response.status(status).json({
      statusCode: status,
      name: data?.name ?? exception.name,
      message: data?.message ?? exception.message,
    });
  }
}
