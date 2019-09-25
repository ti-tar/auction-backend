import { ArgumentMetadata, Injectable, PipeTransform, HttpException, HttpStatus } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { throwErrorResponse } from '../libs/errors';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {

    if (!metadata || !this.toValidate(metadata)) {
      return value;
    }

    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);
    if ( errors.length > 0 ) {
      throwErrorResponse(errors);
      // throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }
}
