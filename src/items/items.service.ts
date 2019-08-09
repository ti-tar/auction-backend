import { Injectable } from '@nestjs/common';
import { Item } from './interfaces/item.interface';

@Injectable()
export class ItemsService {
  private readonly items: Item[] = [
    {
      id: '123',
      name: 'Item 1',
      qty: 66,
      description: 'this is one',
    },
    {
      id: '234',
      name: 'Item 2',
      qty: 13,
      description: 'this is two',
    }
  ];

  findAll(): Item[] {
    return this.items;
  }

  findOne(id): Item {
      return this.items.find(item => item.id === id);
  }
}
