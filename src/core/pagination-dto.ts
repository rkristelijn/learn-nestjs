import { IsNumber, IsPositive } from 'class-validator';

export class Pagination {
  @IsPositive() readonly limit = 10;
  @IsNumber() readonly offset = 0;
}
