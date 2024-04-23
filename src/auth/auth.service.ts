import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { UsersService } from '../users/users.service';
import { TokensDTO } from './dto/tokens.dto';
import { GetAuthUserDTO } from './dto/get-auth-user.dto';
import { PayloadDTO } from './dto/payload.dto';
import { GetUserDTO } from '../users/dto/get-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async login(username: string, password: string): Promise<TokensDTO> {
    const user: GetAuthUserDTO =
      await this.userService.findByUsername(username);

    if (await argon2.verify(user.password, password)) {
      const payload: PayloadDTO = {
        username: user.username,
        sub: user.id,
      };

      const accessToken: string = this.jwtService.sign(payload);
      const refreshToken: string = crypto.randomUUID();

      await this.redis.set(refreshToken, user.id, 'EX', 60 * 60 * 24 * 7);

      return {
        accessToken,
        refreshToken,
      };
    }
    throw new UnauthorizedException('Неверный пароль');
  }

  async registration(
    username: string,
    password: string,
  ): Promise<GetAuthUserDTO> {
    const hashPassword: string = await argon2.hash(password);

    return await this.userService.create({ username, password: hashPassword });
  }

  async refreshToken(refreshToken: string): Promise<TokensDTO> {
    const userId: string | null = await this.redis.get(refreshToken);

    if (userId) {
      const user: GetUserDTO = await this.userService.findById(userId);

      const payload: PayloadDTO = {
        sub: user.id,
        username: user.username,
      };

      const accessToken: string = this.jwtService.sign(payload);
      const newRefreshToken: string = crypto.randomUUID();

      await this.redis
        .pipeline()
        .del(refreshToken)
        .set(newRefreshToken, user.id, 'EX', 60 * 60 * 24 * 7)
        .exec();

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    }
    throw new UnauthorizedException('Токен обновления недействителен');
  }

  async logout(refreshToken: string): Promise<void> {
    await this.redis.del(refreshToken);
  }
}
