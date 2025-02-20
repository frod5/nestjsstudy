import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    if (!req.queryRunner) {
      throw new InternalServerErrorException(
        `QueryRunner decorator를 사용하려면 TransactionInterceptor를 적용해야합니다.`,
      );
    }
    return req.queryRunner;
  },
);