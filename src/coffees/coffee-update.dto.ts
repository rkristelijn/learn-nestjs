import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeDto } from './coffee-create.dto';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
