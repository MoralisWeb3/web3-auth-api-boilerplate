import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetNftsResponseDto {
  @ApiProperty({
    type: Number,
    description: 'The total number of matches for this query',
    example: 2000,
  })
  @IsNumber()
  total: number;

  @ApiProperty({
    type: Number,
    description: 'The page of the current result',
    example: 2,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    type: Number,
    description: 'The number of results per page',
    example: 100,
  })
  @IsNumber()
  page_size: number;

  @ApiProperty({
    type: String,
    description: 'The cursor to get to the next page',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3aGVyZSI6eyJvd25lcl9vZiI6IjB4NTdhZjZiOTBjMjIzN2QyZjg4OGJmNGNhZTU2ZjI1ZmUxYjE0ZTUzMSJ9LCJsaW1pdCI6MTAsIm9mZnNldCI6MCwib3JkZXIiOltbInRyYW5zZmVyX2luZGV4IiwiREVTQyJdXSwicGFnZSI6MSwia2V5IjoiMjY4MTE2ODkuMTIuMzEuMCIsInRvdGFsIjoyNSwiaWF0IjoxNjU2NjY2MTk5fQ.IgdXw0MMrrWBCIAULAbDbk1AtvjDcFWV_6rD0laSKpo',
  })
  @IsString()
  cursor: string;

  @ApiProperty({
    type: [Object],
    description: 'The result of the NFT',
  })
  result: Array<any>;
}
