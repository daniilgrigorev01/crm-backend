import { ApiProperty } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';
import { GetContactDto } from './get-contact.dto';

export class GetClientDto extends CreateContactDto {
  @ApiProperty({ example: 'e63a509d-ca19-4258-a446-aca94457ea0d' })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [GetContactDto] })
  contacts: GetContactDto[];
}
