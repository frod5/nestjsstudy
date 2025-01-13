import { BasePaginationDto } from '../../../common/dto/base-pagination.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginateCommentsDto extends BasePaginationDto {
  @IsNumber()
  @IsOptional()
  where__post__equals?: number;
}
