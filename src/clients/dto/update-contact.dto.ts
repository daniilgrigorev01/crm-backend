import { PartialType } from '@nestjs/swagger';
import { CreateContactDTO } from './create-contact.dto';

export class UpdateContactDTO extends PartialType(CreateContactDTO) {}
