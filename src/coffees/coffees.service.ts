import { Injectable } from '@nestjs/common';
import { Pagination } from '../core';
import { UpdateCoffeeDto } from './coffee-update.dto';
import { Coffee } from './coffees.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwreck Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
    {
      id: 2,
      name: 'Shipwreck Toast',
      brand: 'Buddy Brew',
      flavors: ['bacon', 'vanilla'],
    },
  ];

  findAll(pagination: Pagination) {
    return this.coffees.slice(pagination.offset, pagination.limit);
  }

  findOne(id: number) {
    return this.coffees.find((item) => item.id === +id);
  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
    return this.coffees[this.coffees.length];
  }

  update(id: number, _updateCoffeeDto: UpdateCoffeeDto) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      // existingCoffee = { ...existingCoffee, updateCoffeeDto };
      return existingCoffee;
    }
  }

  remove(id: number) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
    if (coffeeIndex >= 0) {
      this.coffees.splice(coffeeIndex, 1);
      return {};
    }

    return {
      error: 'nothing found',
    };
  }
}
