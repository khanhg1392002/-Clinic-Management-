import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { BenifitCode, Gender, Status } from 'src/config/constants';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreatePatientDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender = Gender.MALE;

  @IsOptional()
  @Type(() => Date)
  dob?: Date;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  nationalId?: string;

  @IsEnum(Status)
  @IsOptional()
  status: Status = Status.ACTIVE;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  avatarUrl?: string;

  @IsOptional()
  @IsString({ each: true })
  visitHistory?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(255)
  insuranceNumber?: string;

  @IsOptional()
  @IsEnum(BenifitCode)
  benifitId?: BenifitCode;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  emergencyContactRelationship?: string;

  @IsOptional()
  @IsMongoId()
  createdBy?: Types.ObjectId;
}
