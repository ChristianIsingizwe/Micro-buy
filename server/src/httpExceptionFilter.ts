import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

// Interface for the structure of the HTTP exception response
export interface HttpExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}

@Catch()
// A custom exception filter that handles all exceptions
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    // Determining the HTTP status code based on the type of exception
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(exception);

    // Determining the response body based on the type of exception
    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : String(exception);

    // Constructing the response body
    const responseBody = {
      statusCode: httpStatus,
      timeStamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()), // Get the request URL
      message:
        (exceptionResponse as HttpExceptionResponse).message ||
        (exceptionResponse as HttpExceptionResponse).error ||
        exceptionResponse ||
        'Something went wrong',
      errorResponse: exceptionResponse as HttpExceptionResponse,
    };

    // Sending the response body using the http adapter
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
