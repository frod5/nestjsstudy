import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from '../users/entities/users.entity';
import { HASH_ROUND, JWT_SECRET } from './const/auth.const';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 토큰을 사용하게 되는 방식
   *
   * 1) 사용자가 로그인 또는 회원가입을 진행하면
   *    accessToken, refreshToken을 발급받는다.
   *
   * 2) 로그인할 떄는 Basic 토큰과 함께 요청을 보낸다.
   *    Basic 토큰은 '이메일:비번'을 base64로 인코딩한 형태
   *    예) {Authorization: 'Basic {token}'}
   *
   * 3) 아무나 접근 할 수 없는 정보(private route)를 접근할 때는
   *    accessToken을 Header에 추가하여 요청.
   *    예) {authorization: 'Bearer {token}'}
   *
   * 4) 토큰과 요청을 함께 받은 서버는 토큰 검증을 통해 현재 요청을 보낸
   *    사용자가 누구인지 알 수 있다.
   *
   * 5) 모든 토큰은 만료기간이 있다. 만료기간이 지나면 새 토큰을 발급받아야한다.
   *    그렇지 않으면 인증이 되지 않는다.
   *    /auth/token/access, /auth/token/refresh api를 통해 토큰을 받아야한다.
   */

  /**
   * Header로 부터 받는 토큰을 받았을때
   *
   * {Authorization: 'Basic {token}'}
   * {authorization: 'Bearer {token}'}
   */
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('잘못된 토큰입니다.');
    }
    return splitToken[1];
  }

  /**
   * Basic {token}
   *
   * 1) asdfsadf.sadfasfasdf.sdfads -> email:password
   * 2) email:password -> [email, password]
   * 3) {email: email, password:password}
   */
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');
    const split = decoded.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    const email = split[0];
    const password = split[1];

    return {
      email,
      password,
    };
  }

  /**
   * 토큰 검증
   */
  verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });
  }

  rotateToken(token: string, isRefresh: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 refresh 토큰만 가능합니다.',
      );
    }

    return this.createToken({ ...decoded }, isRefresh);
  }

  /**
   * 우리가 만드려는 기능
   *
   * 1) registerWithEmail
   *      - email, nickname, password를 입력받고 사용자 생성
   *      - 생성이 완료되면, accessToken, refreshToken을 반환
   *        회원가입 후 다시 로그인해주세요 <- 쓸데없는 과정 없애기위해
   *
   * 2) loginWithEmail
   *      - email, password를 입력하면 사용자 검증을 진행
   *      - 검증이 완료되면 accessToken, refreshToken 반환
   *
   * 3) loginUser
   *      - (1),(2)에서 필요한 accessToken, refreshToken을 반환하는 로직
   *
   * 4) createToken
   *      - (3)에서 필요한 accessToken과 refreshToken을 sign하는 로직
   *
   * 5) authenticateWithEmailAndPassword
   *      - (2)에서 로그인을 진행할 때 필요한 기본적인 검증 진행
   *      1. 사용자가 존재하는지 (email)
   *      2. 비밀번호가 맞는지
   *      3. 모두 통과되면 찾은 사용자 정보 반환
   *      4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   */

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(user);
    return this.loginUser(existingUser);
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersService.getUserByEmail(user.email);
    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자 입니다.');
    }

    const passOk = await bcrypt.compare(user.password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    return existingUser;
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.createToken(user, false),
      refreshToken: this.createToken(user, true),
    };
  }

  /**
   * Payload에 들어갈 정보
   *
   * 1) email
   * 2) sub -> id
   * 3) type : 'access' | 'refresh'
   */
  createToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      //seconds
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  async registerWithEmail(
    user: Pick<UsersModel, 'nickname' | 'email' | 'password'>,
  ) {
    const hash = await bcrypt.hash(user.password, HASH_ROUND);
    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
  }
}
