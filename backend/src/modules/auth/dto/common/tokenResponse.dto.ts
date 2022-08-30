import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description:
      'The token to be used to call the third party API from the client',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGFpbklkIjoxLCJ2ZXJzaW9uIjoiMS4wIiwicmVzb3VyY2VzIjpbImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9zZWNyZXQiXSwiaWF0IjoxNjU1MjYwNjIyLCJleHAiOjMzOTA5NTAyMjIsImF1ZCI6ImxvY2FsaG9zdCIsImlzcyI6IjB4MUQ5YmMyQTdkRUVlQjcwRTQzNWE0MTdiREZDZEU2YmE5QjZhN2E0NSIsInN1YiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9jaGFsbGVuZ2UiLCJqdGkiOiJ3RG9CZ2FMaUYyQVRBVGJneCJ9.kD-PSK1nhR65WffY2zXb3uHLM38W4YHlfG1VPVSsLJ0',
  })
  token: string;
}
