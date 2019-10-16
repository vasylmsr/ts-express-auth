import { Request, Response } from 'express';
import HttpException from '../common/exceptions/HttpException';
import * as HttpStatus from 'http-status-codes';
function errorMiddleware(error: HttpException, request: Request, response: Response, next) {
  const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  const statusText = HttpStatus.getStatusText(status);
  const message = error.message || 'Something went wrong';
  response.status(status)
    .send({
      status,
      statusText,
      message,
    });
}

export default errorMiddleware;
