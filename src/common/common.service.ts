import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseModel } from './entities/base.entity';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { ConfigService } from '@nestjs/config';
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from './const/env-keys.const';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}

  pagenate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideFindOptions);
    } else {
      return this.cursorPaginate(dto, repository, overrideFindOptions, path);
    }
  }

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions<T>(dto);
    const [results, total] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions,
    });

    return {
      data: results,
      total: total,
    };
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    /**
     * where__likeCount__more_than
     *
     * where__title__ilike
     */
    const findOptions = this.composeFindOptions<T>(dto);
    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    const count = results.length;
    const lastItem =
      count > 0 && count === dto.take ? results[count - 1] : null;

    const protocol = this.configService.get<string>(ENV_PROTOCOL_KEY);
    const host = this.configService.get<string>(ENV_HOST_KEY);

    const nextUrl = lastItem && new URL(`${protocol}://${host}/${path}`);
    if (nextUrl) {
      /**
       * dto의 키값을 루핑하며
       * 키값에 해당하는 밸류가 존재하면
       * param에 붙여준다.
       *
       * 단, where__id__more_than 값만 lastItem.id를 넣어준다.
       */

      for (const key of Object.keys(dto)) {
        if (
          dto[key] &&
          key !== 'where__id__more_than' &&
          key !== 'where__id__less_than'
        ) {
          nextUrl.searchParams.append(key, dto[key]);
        }
      }

      const key =
        dto.order__createdAt === 'ASC'
          ? 'where__id__more_than'
          : 'where__id__less_than';

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: results,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: count,
      next: nextUrl?.toString() ?? null,
    };
  }

  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    /**
     * where,
     * order,
     * take,
     * skip - page일때만
     */

    /**
     * dto의 구조는
     * {
     *   where__id__more_than: 1,
     *   order_createdAt: 'ASC'
     * }
     *
     * 현재는 where__id__more_than / where__id__less_than에 해당하는 where 필터만 사용하지만,
     * 나중에 where__likCount__more_than 이나 where__title__ilike 등 추가 필터를 넣고 싶을떄,
     * 모든 where 필터를 자동으로 파싱할 수 있는 기능을 만들어야한다.
     *
     * 1) where로 시작한다면, 필터 로직을 적용한다.
     * 2) order로 시작하면, 정렬 로직을 적용한다.
     * 3) 필터 로직을 적용한다면, '__' 기준으로 split 했을 때 3개의 값으로 나뉘는지
     *    2개의 값으로 나뉘는지 확인한다.
     *    3-1) 3개로 나뉜다면, FILTER_MAPPER에서 해당하는 operator 함수를 찾아 적용한다.
     *        ex) where__id__more_than -> ['where','id','more_than']
     *    3-2) 2개로 나뉜다면, 정확한 값을 필터하는 것이기에 operator 없이 적용한다.
     *        ex) where__id -> ['where', 'id']
     * 4) order의 경우 3-2와 같이 적용한다.
     */

    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseWhereFilter(key, value),
        };
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseWhereFilter(key, value),
        };
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  private parseWhereFilter<T extends BaseModel>(
    key: string,
    value: any,
  ): FindOptionsWhere<T> | FindOptionsOrder<T> {
    const options: FindOptionsWhere<T> | FindOptionsOrder<T> = {};

    const split = key.split('__');
    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(
        `where 필터는 '__'로 split 했을때 길이가 2 또는 3이어야 합니다. 문제되는 키값:${key}`,
      );
    }

    if (split.length === 2) {
      const [_, field] = split;
      options[field] = value;
    } else {
      /**
       * 길이가 3인 경우, TypeOrm 유틸리티 적용이 필요한 경우이다.
       *
       * where__id__more_than의 경우
       * where은 버려도되고, 두번째 값은 필터할 키값, 세번째 값은 typeOrm 유틸리티이다.
       *
       * FILTER_MAPPER에 미리 정의 해둔 값들로
       * field 값에 FILTER_MAPPER에 해당되는 utility를 가져온 후 값에 적용해준다.
       */

      const [_, field, operator] = split;
      // const values = value.toString().split(',');
      // if (operator === 'between') {
      //   options[field] = FILTER_MAPPER[operator](values[0], values[1]);
      // } else {
      //   options[field] = FILTER_MAPPER[operator](value);
      // }

      options[field] = FILTER_MAPPER[operator](value);
    }
    return options;
  }
}
