import { IsString, IsArray, ArrayNotEmpty, ValidateNested, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";
import { ScheduleEntryDto } from "./schedule-entry.dto"; // Đảm bảo đường dẫn chính xác

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsArray()
  @ArrayNotEmpty()
  schedules: ScheduleEntryDto[];
}
