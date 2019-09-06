import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const throwErrorResponse = (errors: ValidationError[]): void => {

  const errorMsgs = [];
  errors.forEach((error: ValidationError): void => {
    errorMsgs.push({
      property: error.property,
      message: `${error.constraints ? Object.keys(error.constraints).map(k => error.constraints[k]).join(', ') : '' }`,
    });
  });

  throw new HttpException(errorMsgs, HttpStatus.BAD_REQUEST);
};
