import { Exclude } from 'class-transformer';
import { CreateContactDTO } from './create-contact.dto';

export class GetContactDTO extends CreateContactDTO {
  @Exclude()
  clientId: string;
}
