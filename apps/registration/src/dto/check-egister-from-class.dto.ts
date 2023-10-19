import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CheckRegisterFromClassDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  classId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  sessionId: number;
}
