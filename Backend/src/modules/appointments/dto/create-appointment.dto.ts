import { Type } from 'class-transformer';
import { IsNotEmpty, IsEnum, IsDateString, IsMongoId, IsNumber, IsString, IsOptional, IsEmail, MaxLength, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { appointmentStatus, Gender } from 'src/config/constants';
import { CreatePatientDto } from 'src/modules/patients/dto/create-patient.dto';

export class CreateAppointmentDto {

  @ValidateNested()
  @Type(() => CreatePatientDto)
  patient: CreatePatientDto;

  ///////////
  @IsOptional()
  @IsMongoId()
  doctor: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  department: Types.ObjectId;

  @IsNotEmpty()
  @IsDateString() // Đảm bảo chuỗi ngày tháng hợp lệ
  appointmentDate: Date;

  @IsNotEmpty()
  @IsNumber()
  timeSlot: number;

  @IsNotEmpty()
  @IsEnum(appointmentStatus) // Đảm bảo giá trị thuộc enum appointmentStatus
  status: appointmentStatus;

  @IsNotEmpty()
  @IsEnum(appointmentStatus) // Đảm bảo giá trị thuộc enum appointmentStatus
  bookingType: appointmentStatus;

  @IsNotEmpty()
  @IsString()
  symptoms: string;

  @IsNumber()
  queueNumber: number = 1; // Giá trị mặc định là 1
}
