import { PartialType } from '@nestjs/swagger';
import { CreateClientDTO } from './create-client.dto';

export class UpdateClientDTO extends PartialType(CreateClientDTO) {}
