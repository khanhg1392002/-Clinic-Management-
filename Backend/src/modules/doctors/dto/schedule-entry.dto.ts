import { IsDateString, IsArray, ArrayNotEmpty, IsEnum } from "class-validator";
import { TimeSlot } from "src/config/constants"; // Điều chỉnh đường dẫn nếu cần

export class ScheduleEntryDto {
  @IsDateString()
  date: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(TimeSlot, { each: true }) // Đảm bảo mỗi giá trị trong mảng là một giá trị hợp lệ của TimeSlot
  availableTimeSlots: TimeSlot[];
}
