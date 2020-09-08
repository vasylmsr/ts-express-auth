import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../common/exceptions/HttpException';
import {BAD_REQUEST} from 'http-status-codes';

function validationMiddleware(dtoClass: any): express.RequestHandler {
  return async (req, res, next) => {
    const errors: ValidationError[] = await validate(plainToClass(dtoClass, req.body));
    if (errors && errors.length > 0) {
      const errorsMessages: object[] =  formatErrors(errors);
      next(new HttpException(errorsMessages, BAD_REQUEST));
    } else {
      next();
    }
  };
}

function formatErrors(errors: any): object[] {
  return errors.map(err => {
    for (const property in err.constraints) {
      return {
        field: err.property,
        rule: property,
        message: err.constraints[property],
      };
    }
  });
}

export default validationMiddleware;
