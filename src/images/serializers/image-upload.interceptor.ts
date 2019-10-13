import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as sharp from 'sharp';
export interface ImageUploadResponse<T> {
  file: {
    format: string,
    height: number,
    width: number,
    fileName: string,
  };
}

@Injectable()
export class ImageUploadSerializerInterceptor<T extends sharp.OutputInfo & { filename: string }>
  implements NestInterceptor<T, ImageUploadResponse<T>> {
  intercept( context: ExecutionContext, next: CallHandler<T>): Observable<ImageUploadResponse<T>> {
    return next.handle().pipe(map((data) => ({
      file: {
        format: data.format,
        height: data.height,
        width: data.width,
        fileName: data.filename,
      },
    })));
  }
}
