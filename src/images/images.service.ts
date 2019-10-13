import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import { UserDecorator } from '../users/user.decorator';
import { User } from '../entities/user';
import * as sharp from 'sharp';
import { LoggerService } from '../shared/logger.service';
import { ConfigService } from '../shared/config.service';

@Injectable()
export class ImagesService {
  constructor(
    private loggerService: LoggerService,
    private configService: ConfigService,
  ) {}

  async resize(@UploadedFile() file, @UserDecorator() user: User): Promise<sharp.OutputInfo & { filename: string }> {
    const fullPath = this.configService.getLotCoverPath(file.filename);
    try {
      const outputInfo: sharp.OutputInfo = await sharp(file.path).resize(this.configService.lotCoverThumbWidth).toFile(fullPath);
      this.loggerService.log(`Upload File. User: id ${user.id}, ${user.firstName}. File '${file.filename}' ` +
        `thumbed to${outputInfo.width}x${outputInfo.height} ${outputInfo.size}b!`);
      return { ...outputInfo, filename: file.filename };
    } catch (error) {
      this.loggerService.error(error);
      throw new BadRequestException('Error during resizing/saving image.');
    }
  }
}
