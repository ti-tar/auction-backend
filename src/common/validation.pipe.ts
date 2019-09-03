import { ArgumentMetadata, Injectable, PipeTransform, HttpException, HttpStatus } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { throwErrorResponse } from '../libs/errors';

@Injectable()
export class VadationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {

    const { metatype } = metadata;

    if (!metadata || !this.toValidate(metadata)) {
      return value;
    }
    
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if(errors.length > 0) {
      console.log(errors);
      throwErrorResponse(errors);
      // throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }
}
