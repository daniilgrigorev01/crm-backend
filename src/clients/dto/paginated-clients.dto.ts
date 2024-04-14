import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { GetClientDTO } from './get-client.dto';
import { PaginateMetaDTO } from './paginate-meta.dto';

export class PaginatedClientsDTO {
  @ApiProperty({ type: [GetClientDTO] })
  @Type(() => GetClientDTO)
  clients: GetClientDTO[];

  @ApiProperty({ type: PaginateMetaDTO })
  meta: PaginateMetaDTO;
}
