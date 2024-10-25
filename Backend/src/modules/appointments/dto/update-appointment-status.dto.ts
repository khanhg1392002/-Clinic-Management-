import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
    

}
