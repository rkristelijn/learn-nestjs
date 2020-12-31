import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from '../core/pagination-dto';
import { CreateCoffeeDto } from './coffee-create.dto';
import { UpdateCoffeeDto } from './coffee-update.dto';
import { Coffee } from './coffee.entity';
import { Flavor } from './flavor.entity';

@Injectable()
export class CoffeesService {
  private readonly logger = new Logger('CoffeesService');
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
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
      /**
       * Indicates what relations of entity should be loaded
       * (simplified left join form).
       */
      relations: ['flavors'],
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    // upsert all flavors
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    // merge input with created or found flavors
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });

    // return the result
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDto,
      flavors,
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

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      this.logger.debug(`${name} found; returning existing Flavor`);
      return existingFlavor;
    }
    this.logger.debug(`${name} not found; creating new Flavor`);
    return this.flavorRepository.create({ name });
  }
}
