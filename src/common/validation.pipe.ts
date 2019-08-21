import { ArgumentMetadata, Injectable, PipeTransform, HttpException, HttpStatus } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class VadationPipe implements PipeTransform<any> {
  async transform(value, metadata: ArgumentMetadata) {
    console.log(value)
    // console.log(metadata)
    const { metatype } = metadata;

    if (!metadata || !this.toValidate(metadata)) {
      return value;
    }
    
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if(errors.length > 0) {
      console.log(errors);
      this.throwErrorResponse(errors);
      // throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }

  throwErrorResponse(errors: ValidationError[]): void {

    const errorMsgs = []
    errors.forEach((error: ValidationError): void => {
      errorMsgs.push({
        property: error.property, 
        message: `${error.constraints ? Object.keys(error.constraints).map(k => error.constraints[k]).join(', ') : '' }`
      })
    });

    throw new HttpException(errorMsgs, HttpStatus.BAD_REQUEST);
  }
}