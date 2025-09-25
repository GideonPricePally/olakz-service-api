import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const AdminSession = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request?.['user'] || !request?.['user']?.['adminId']) {
    throw new UnauthorizedException();
  }
  return request?.['user'];
});
