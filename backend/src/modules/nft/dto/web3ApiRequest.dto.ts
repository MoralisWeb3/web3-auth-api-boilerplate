import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class Web3ApiRequestDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'The current chain',
    example: 'eth',
  })
  @IsString()
  @IsOptional()
  chain?: string;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'The total number of matches for this query',
    example: '100',
  })
  @IsNumberString()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'The cursor to get to the next page',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3aGVyZSI6eyJvd25lcl9vZiI6IjB4NTdhZjZiOTBjMjIzN2QyZjg4OGJmNGNhZTU2ZjI1ZmUxYjE0ZTUzMSJ9LCJsaW1pdCI6MTAsIm9mZnNldCI6MCwib3JkZXIiOltbInRyYW5zZmVyX2luZGV4IiwiREVTQyJdXSwicGFnZSI6MSwia2V5IjoiMjY4MTE2ODkuMTIuMzEuMCIsInRvdGFsIjoyNSwiaWF0IjoxNjU2NjY2MTk5fQ.IgdXw0MMrrWBCIAULAbDbk1AtvjDcFWV_6rD0laSKpo',
  })
  @IsString()
  @IsOptional()
  cursor?: string;
}
