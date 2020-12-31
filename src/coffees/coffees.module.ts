import { Injectable, Module, UseFilters } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { Coffee } from './coffee.entity';
import { CoffeesService } from './coffees.service';
import { Flavor } from './flavor.entity';
import { Event } from './event.entity';
import { COFFEE_BRANDS, COFFEE_COUNTRIES } from './coffees.constants';

// for demo purposes
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeCountriesFactory {
  create() {
    return ['brazil', 'vietnam', 'colombia', 'indonesia', 'ethiopia'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    // Non-class-based Provider Token
    { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] },
    // Class Provider Pattern
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    // Factory Providers
    CoffeeCountriesFactory,

    {
      provide: COFFEE_COUNTRIES,
      useFactory: (coffeeCountriesFactory: CoffeeCountriesFactory) =>
        coffeeCountriesFactory.create(),
      inject: [CoffeeCountriesFactory],
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
