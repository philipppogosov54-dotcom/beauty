import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
