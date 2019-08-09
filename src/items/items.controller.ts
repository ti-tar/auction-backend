import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemsService } from './items.service';
import { Item } from './interfaces/item.interface'
import { threadId } from 'worker_threads';

@Controller('items')
export class ItemsController {
   constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(): Item[] {
    return this.itemsService.findAll();
  }

  @Get(':id')
  findOne( @Param('id') id: number): Item {
    return this.itemsService.findOne(id);
  }

  @Post()
  create( @Body() createItemDto: CreateItemDto): string {
    return `Name: ${createItemDto.name} Desc: ${createItemDto.description}`;
  }

  @Put(':id') 
  blavlfa(@Param('id') id: number ): string {
    return `item puted ${id}`;
  }

  @Delete(':id')
  delete( @Param('id') id: number): string {
    return `deleted  ${id}`;
  }
}

