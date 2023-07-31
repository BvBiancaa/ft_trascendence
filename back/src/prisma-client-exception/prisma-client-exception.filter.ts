import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';

import { BaseExceptionFilter } from '@nestjs/core';

import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError) // 1
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  // 2

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message); // 3
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const message = exception.message.replace(/\n/g, '');
    const message2 = message.substring(message.lastIndexOf('fields'));

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;

        response.status(status).json({
          statusCode: status,
          message: message2,
        });

        break;
      }

      default:
        // default 500 error code
        super.catch(exception, host);

        break;
    }
  }
}
