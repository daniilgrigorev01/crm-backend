import { Exclude } from 'class-transformer';
import { CreateContactDto } from './create-contact.dto';

export class GetContactDto extends CreateContactDto {
  @Exclude()
  id: number;

  @Exclude()
  clientId: string;
}
