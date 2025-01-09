import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth.service';
import { UsersService } from '../../../users/users.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketBaererTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const socket = context.switchToWs().getClient();
    const headers = socket.handshake.headers;
    const rawToken = headers['authorization'];

    if (!rawToken) {
      throw new WsException('토큰이 없습니다.');
    }

    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);
      const payload = this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(payload.email);
      socket.user = user;
      socket.token = token;
      socket.tokenType = payload.type;
      return true;
    } catch (error) {
      throw new WsException('토큰이 유효하지 않습니다.');
    }
  }
}
