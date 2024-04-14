import { ApiProperty } from '@nestjs/swagger';

export class PaginateMetaDTO {
  @ApiProperty({ example: 'true' })
  isFirstPage: boolean;

  @ApiProperty({ example: 'false' })
  isLastPage: boolean;

  @ApiProperty({ example: '1' })
  currentPage: number;

  @ApiProperty({ example: 'null' })
  previousPage: number | null;

  @ApiProperty({ example: '2' })
  nextPage: number | null;

  @ApiProperty({ example: '5' })
  pageCount: number;

  @ApiProperty({ example: '50' })
  totalCount: number;
}
