import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetUserAttendedSession {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  classId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;
}
