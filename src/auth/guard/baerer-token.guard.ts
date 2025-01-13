import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../common/decorator/is-public.decorator';

@Injectable()
export class BaererTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const req = context.switchToHttp().getRequest();

    if (isPublic) {
      req.isRoutePublic = true;
      return true;
    }

    const rawToken = req.headers['authorization'];
    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const result = await this.authService.verifyToken(token);
    const user = await this.usersService.getUserByEmail(result.email);

    /**
     * 1) 사용자 정보 - user
     * 2) token - token
     * 3) tokenType - access | refresh
     */
    req.user = user;
    req.token = token;
    req.tokenType = result.type;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BaererTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.isRoutePublic) {
      return true;
    }

    if (req.tokenType !== 'access') {
      throw new UnauthorizedException('Access token이 아닙니다.');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BaererTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.isRoutePublic) {
      return true;
    }

    if (req.tokenType !== 'refresh') {
      throw new UnauthorizedException('refresh token이 아닙니다.');
    }

    return true;
  }
}
