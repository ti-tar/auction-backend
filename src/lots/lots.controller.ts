import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';

@Controller('lots')
export class LotsController {
  @Get()
  findAll(): string {
    return 'lots';
  }
}
