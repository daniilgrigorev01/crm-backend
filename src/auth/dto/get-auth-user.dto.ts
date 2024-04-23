import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetAuthUserDTO {
  @ApiProperty({ example: 'b38ee887-d799-48fe-a222-a4e66f5b0daa' })
  id: string;

  @ApiProperty({ example: 'username' })
  username: string;

  @Exclude()
  password: string;
}
