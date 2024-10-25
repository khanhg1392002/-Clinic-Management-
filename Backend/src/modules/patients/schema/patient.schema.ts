import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { BenifitCode, Gender, Status } from "src/config/constants";
import { toVietnamTime } from "src/utils/timeUtil";

export type PatientDocument = Patient & Document;

@Schema({
    timestamps: { currentTime: toVietnamTime },
  })
export class Patient {

    @Prop({ required: true, maxlength: 100, trim: true })
    firstName: string;
  
    @Prop({ required: true, maxlength: 100, trim: true })
    lastName: string;
  
    @Prop({ maxlength: 100, lowercase: true, trim: true })
    email?: string;
  
    @Prop({ required: false, unique: true, maxlength: 20, sparse: true, trim: true })
    phoneNumber?: string;
  
    @Prop({ maxlength: 255, trim: true })
    address?: string;
  
    @Prop({ enum: Gender })
    gender?: Gender;
  
    @Prop({ type: Date })
    dob: Date;
  
    @Prop({ unique: true, maxlength: 20 })
    nationalId?: string;
  
    @Prop({ required: true, enum: Status, index: true, default: Status.ACTIVE })
    status: Status;
  
    @Prop({ trim: true })
    avatarUrl?: string;
  
    @Prop({ type: [{ type: Types.ObjectId, ref: 'VisitHistory' }], default: [] })
    visitHistory?: string[];
    
    @Prop({ unique: true, maxlength: 255 })
    insuranceNumber?: string

    @Prop({ enum: BenifitCode, index: true })
    benifitId?: BenifitCode

    @Prop({ maxlength: 255 })
    emergencyContactName?: string;
  
    @Prop({ maxlength: 20 })
    emergencyContactPhone?: string;
  
    @Prop({ maxlength: 255 })
    emergencyContactRelationship?: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;
  
    @Prop({ type: Types.ObjectId, ref: 'User' })
    updatedBy: Types.ObjectId;
  
    @Prop({ type: Types.ObjectId, ref: 'User' })
    deletedBy: Types.ObjectId;
  
    @Prop({ type: Date })
    deletedAt?: Date;
  _id: any;

}

export const PatientSchema = SchemaFactory.createForClass(Patient);