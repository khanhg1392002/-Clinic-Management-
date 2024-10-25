import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {
    
    @IsNotEmpty()
    @IsMongoId()
    updatedBy?: Types.ObjectId;
}
