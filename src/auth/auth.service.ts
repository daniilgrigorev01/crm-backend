import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AccessTokenDTO } from './dto/access-token.dto';
import { GetAuthUserDTO } from './dto/get-auth-user.dto';
import { PayloadDTO } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<AccessTokenDTO> {
    const user: GetAuthUserDTO =
      await this.userService.findByUsername(username);

    if (await argon2.verify(user.password, password)) {
      const payload: PayloadDTO = {
        username: user.username,
        sub: user.id,
      };

      return {
        accessToken: this.jwtService.sign(payload),
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
}
