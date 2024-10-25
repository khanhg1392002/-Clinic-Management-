import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TimeSlot } from 'src/config/constants';

export type DoctorScheduleDocument = DoctorSchedule & Document;

@Schema()
export class DoctorSchedule {
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [Number], enum: TimeSlot, required: true })
  availableTimeSlots: TimeSlot[];

}

export const DoctorScheduleSchema = SchemaFactory.createForClass(DoctorSchedule);