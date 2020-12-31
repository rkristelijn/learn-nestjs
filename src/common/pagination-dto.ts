import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  limit: number;

  @IsOptional()
  /** Offset may be 0... so use this: */
  // @Min(0)
  /** but in our case, id starts with 1 */
  @IsPositive()
  // @Type(() => Number) we don't need this since main.js
  //   specifies this implicitly
  offset: number;
}
