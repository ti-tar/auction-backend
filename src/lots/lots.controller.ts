import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';

import { LotsService } from './lots.service';
import { Lot } from '../entities/lot';

// import { VadationLotPipe } from '../common/validationLot.pipe';
// import { CreateLotDto } from './create-lot.dto';

@Controller('lots')
export class LotsController {
  constructor(private readonly lotsService: LotsService) {}

  @Get()
  async findAll(): Promise<Lot[]> {
    return this.lotsService.findAll();
  }

  @Post()
  //@UsePipes(new VadationLotPipe())
  create(@Body() lot: Lot) {
    return this.lotsService.create(lot);
  }
}
