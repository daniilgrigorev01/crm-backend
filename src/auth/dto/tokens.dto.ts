import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class TokensDTO {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJuYW1lIiwic3ViIjoiYjM4ZWU4ODctZDc5OS00OGZlLWEyMjItYTRlNjZmNWIwZGFhIiwiaWF0IjoxNzEzNzg3ODE0LCJleHAiOjE3MTM3ODc4NzR9.fphKg2_CZaYdqN5FnwvN255EDbNPjcE4roIqJnD5D6I',
  })
  accessToken: string;

  @Exclude()
  refreshToken: string;
}
