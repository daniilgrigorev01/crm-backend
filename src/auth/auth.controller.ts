import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
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
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { AccessTokenDTO } from './dto/access-token.dto';
import { RegistrationUserDTO } from './dto/registration-user.dto';
import { GetAuthUserDTO } from './dto/get-auth-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({
    type: AccessTokenDTO,
    description: 'Пользователь успешно аутентифицирован',
  })
  @ApiBadRequestResponse({ description: 'Ошибка валидации данных' })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при работе с базой данных',
  })
  @ApiUnauthorizedResponse({ description: 'Неверный пароль' })
  async login(@Body() user: LoginDTO): Promise<AccessTokenDTO> {
    try {
      return await this.authService.login(user.username, user.password);
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
}
