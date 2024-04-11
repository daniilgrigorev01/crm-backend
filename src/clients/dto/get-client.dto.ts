import { ApiProperty } from '@nestjs/swagger';
import { GetContactDto } from './get-contact.dto';
import { CreateClientDto } from './create-client.dto';

export class GetClientDto extends CreateClientDto {
  @ApiProperty({ example: 'e63a509d-ca19-4258-a446-aca94457ea0d' })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [GetContactDto] })
  declare contacts: GetContactDto[];
}
