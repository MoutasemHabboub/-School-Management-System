import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AttendSessionDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  classId: number;
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  sessionId: number;
}
