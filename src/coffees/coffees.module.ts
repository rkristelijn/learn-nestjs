import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { Coffee } from './coffee.entity';
import { CoffeesService } from './coffees.service';
import { Flavor } from './flavor.entity';
import { Event } from './event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
