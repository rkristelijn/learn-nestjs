import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './coffee-create.dto';
import { UpdateCoffeeDto } from './coffee-update.dto';
import { PaginationQueryDto } from '../common';

@Controller('coffees')
export class CoffeesController {
  private readonly logger = new Logger('CoffeesController');

  constructor(private readonly coffeesService: CoffeesService) {}
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    const { limit = 10, offset = 0 } = paginationQuery;
    this.logger.debug({ location: 'findAll()', limit, offset });
    const pagination: any = { limit, offset };
    return this.coffeesService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    const coffee = this.coffeesService.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return coffee;
  }

  @Get(':id/recommend')
  async recommendCoffee(@Param('id') id: number) {
    const coffee = await this.coffeesService.findOne(id);

    this.coffeesService.recommendCoffee(coffee);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log(
      'CoffeesController',
      'createCoffeeDto instanceof CreateCoffeeDto',
      createCoffeeDto instanceof CreateCoffeeDto,
    );
    this.coffeesService.create(createCoffeeDto);
    return createCoffeeDto;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coffeesService.remove(id);
  }
}
