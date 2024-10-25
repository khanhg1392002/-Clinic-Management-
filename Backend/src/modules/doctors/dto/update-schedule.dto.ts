import { IsString, IsDateString, IsArray, ArrayNotEmpty, IsEnum, ValidateNested, IsMongoId, IsNotEmpty } from "class-validator";
import { TimeSlot } from "src/config/constants";
import { ScheduleEntryDto } from "./schedule-entry.dto";
import { Type } from "class-transformer";
import { Types } from "mongoose";

export class UpdateScheduleDto {
  @IsNotEmpty()
  @IsString()
  doctorId: string;
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // Thêm để xác thực từng phần tử trong mảng
  @Type(() => ScheduleEntryDto) // Chuyển đổi kiểu dữ liệu
  schedules: ScheduleEntryDto[];
}
