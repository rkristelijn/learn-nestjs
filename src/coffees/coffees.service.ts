import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from '../core/pagination-dto';
import { CreateCoffeeDto } from './coffee-create.dto';
import { UpdateCoffeeDto } from './coffee-update.dto';
import { Coffee } from './coffees.entity';

@Injectable()
export class CoffeesService {
  private readonly logger = new Logger('CoffeesService');
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}

  findAll(pagination: Pagination) {
    this.logger.debug({ ...pagination, location: 'findAll()' });
    return this.coffeeRepository.find({
      /**
       * Offset (paginated) where from entities should be taken.
       */
      skip: pagination.offset,
      /**
       * Limit (paginated) - max number of entities should be taken.
       */
      take: pagination.limit,
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(createCoffeeDto);
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    /** if exist, replaces values, if not, create.
     * sort of an upsert (updateOrInsert) */
    const coffee = await this.coffeeRepository.preload({
      id: +id, // todo: do we need type safety here?
      ...updateCoffeeDto,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }
}
