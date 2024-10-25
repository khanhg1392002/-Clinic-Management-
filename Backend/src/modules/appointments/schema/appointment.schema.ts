import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";
import { appointmentStatus, bookingType, Gender } from "src/config/constants";
import { toVietnamTime } from "src/utils/timeUtil";

export type AppointmentDocument = Appointment & Document;

@Schema({
  timestamps: { currentTime: toVietnamTime },
})
export class Appointment {

  // Thông tin cuộc hẹn
  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctor: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Department', required: true })
  department: Types.ObjectId;

  @Prop({ required: true })
  appointmentDate: Date;

  @Prop({ type: Number, required: true })
  timeSlot: number;

  @Prop({ required: true, enum: appointmentStatus, default: appointmentStatus.PENDING, index: true })
  status: appointmentStatus;

  @Prop({ required: true, enum: bookingType, index: true })
  bookingType: bookingType;

  @Prop({ required: true })
  symptoms: string;

  @Prop({ default: 1 })
  queueNumber: number;

  // Tham chiếu đến Patient nếu có
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: false })
  patientId?: Types.ObjectId;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);