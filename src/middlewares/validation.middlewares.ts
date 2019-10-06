import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../common/exceptions/HttpException';

function validationMiddleware<T>(dtoClass: any): express.RequestHandler {
	return  (req, res, next) => {
		let errors: ValidationError[];
		validate(plainToClass(dtoClass, req.body)).then(err => errors = err);
		if (errors && errors.length > 0) {
			const errorsMessages: object[] =  formatErrors(errors);
			throw new HttpException(errorsMessages, 400);
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
