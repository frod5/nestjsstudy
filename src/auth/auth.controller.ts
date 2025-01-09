import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/baerer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  createTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, false);
    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  createTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, true);
    return {
      refreshToken: newToken,
    };
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  loginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);
    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  registerEmail(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerWithEmail(registerUserDto);
  }
}
