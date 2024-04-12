import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GetContactDTO } from './get-contact.dto';
import { CreateClientDTO } from './create-client.dto';

export class GetClientDTO extends CreateClientDTO {
  @ApiProperty({ example: 'e63a509d-ca19-4258-a446-aca94457ea0d' })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [GetContactDTO] })
  @Type(() => GetContactDTO)
  declare contacts: GetContactDTO[];
}
