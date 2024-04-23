import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { TokensDTO } from './dto/tokens.dto';
import { RegistrationUserDTO } from './dto/registration-user.dto';
import { GetAuthUserDTO } from './dto/get-auth-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
    type: TokensDTO,
    description: 'Пользователь успешно аутентифицирован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при работе с базой данных',
  })
  @ApiUnauthorizedResponse({ description: 'Неверный пароль' })
  async login(
    @Body() user: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokensDTO> {
    try {
      const tokens: TokensDTO = await this.authService.login(
        user.username,
        user.password,
      );

      response.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return plainToInstance(TokensDTO, tokens);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw error;
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Ошибка валидации данных при аутентификации пользователя',
        );
      } else if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Ошибка в работе базы данных при аутентификации пользователя',
        );
      }
    }
  }

  @Post('registration')
  @ApiCreatedResponse({
    type: GetAuthUserDTO,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiConflictResponse({ description: 'Нарушение уникального ограничения' })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка в работе базы данных',
  })
  async registration(
    @Body() user: RegistrationUserDTO,
  ): Promise<GetAuthUserDTO> {
    try {
      const newUser: GetAuthUserDTO = await this.authService.registration(
        user.username,
        user.password,
      );

      return plainToInstance(GetAuthUserDTO, newUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw error;
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException(
          'Ошибка валидации данных при регистрации пользователя',
        );
      } else {
        throw new InternalServerErrorException(
          'Ошибка в работе базы данных при регистрации нового пользователя',
        );
      }
    }
  }

  @Get('refresh')
  @ApiOkResponse({ description: 'Успешное обновление токена доступа' })
  @ApiUnauthorizedResponse({ description: 'Недействительный токен обновления' })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка в работе базы данных',
  })
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokensDTO> {
    try {
      const tokens: TokensDTO = await this.authService.refreshToken(
        request.cookies.refreshToken,
      );

      response.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return plainToInstance(TokensDTO, tokens);
    } catch (error) {
      throw error instanceof UnauthorizedException
        ? error
        : new InternalServerErrorException(
            'Ошибка в работе базы данных при обновлении токена доступа',
          );
    }
  }
}
