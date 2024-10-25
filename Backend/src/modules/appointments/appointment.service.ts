import { Injectable, ConflictException, NotFoundException, forwardRef, Inject, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DoctorService } from "../doctors/doctor.service";
import { Doctor, DoctorDocument } from "../doctors/schema/doctor.schema";
import { DoctorSchedule, DoctorScheduleDocument } from "../doctors/schema/doctorSchedule.schema";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { Appointment, AppointmentDocument } from "./schema/appointment.schema";
import { appointmentStatus, Status } from "src/config/constants";
import { addDays, startOfDay } from "date-fns";
import { Patient } from "../patients/schema/patient.schema";
import { CreatePatientDto } from "../patients/dto/create-patient.dto";
import { PatientService } from "../patients/patient.service";

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(DoctorSchedule.name) private doctorScheduleModel: Model<DoctorScheduleDocument>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel('Doctor') private doctorModel: Model<DoctorDocument>,
    @Inject(forwardRef(() => PatientService)) private patientService: PatientService,
  ) { }

  
  
  async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment & { doctorId: string, departmentId: string }> {
    try {
        // 1. Kiểm tra tính hợp lệ của patient phoneNumber
        if (!createAppointmentDto.patient || !createAppointmentDto.patient.phoneNumber) {
            throw new BadRequestException('Patient phone number is required.');
        }

        // 2. Xử lý thông tin patient
        let patientId: string;
        const existingPatient = await this.patientService.findByPhone(createAppointmentDto.patient.phoneNumber);

        if (existingPatient) {
            patientId = existingPatient._id.toString();
        } else {
            const newPatient = await this.patientService.create(createAppointmentDto.patient, "SYSTEM");
            patientId = newPatient._id.toString();
        }

        // 3. Kiểm tra số lượng appointment trong timeSlot
        const existingAppointments = await this.appointmentModel.count({
            doctor: new Types.ObjectId(createAppointmentDto.doctor),
            appointmentDate: createAppointmentDto.appointmentDate,
            timeSlot: createAppointmentDto.timeSlot,
            status: { $ne: appointmentStatus.CANCELLED }
        });

        if (existingAppointments >= 3) {
            throw new ConflictException('This time slot is fully booked');
        }

        // 4. Kiểm tra lịch bác sĩ
        const doctorSchedule = await this.doctorScheduleModel.findOne({
          doctor: createAppointmentDto.doctor,
          date: createAppointmentDto.appointmentDate,
          availableTimeSlots: createAppointmentDto.timeSlot
        });
    
        if (!doctorSchedule) {
          throw new NotFoundException('Doctor is not available at this time');
        }

        // 5. Tạo số thứ tự trong hàng đợi
        const queueNumber = existingAppointments + 1;

        // 6. Tạo appointment mới
        const newAppointment = new this.appointmentModel({
            doctor: new Types.ObjectId(createAppointmentDto.doctor),
            department: new Types.ObjectId(createAppointmentDto.department),
            appointmentDate: createAppointmentDto.appointmentDate,
            timeSlot: createAppointmentDto.timeSlot,
            bookingType: createAppointmentDto.bookingType,
            symptoms: createAppointmentDto.symptoms,
            patientId: new Types.ObjectId(patientId),
            queueNumber,
            status: appointmentStatus.PENDING
        });

        await newAppointment.save();

        // 7. Trả về đầy đủ thông tin
        const savedAppointment = await this.appointmentModel.findById(newAppointment._id)
            .populate('doctor')
            .populate('department')
            .populate('patientId')
            .lean()
            .exec();

        return {
            ...savedAppointment,
            doctorId: createAppointmentDto.doctor.toString(),
            departmentId: createAppointmentDto.department.toString(),
        };

    } catch (error) {
        if (error instanceof BadRequestException ||
            error instanceof ConflictException ||
            error instanceof NotFoundException) {
            throw error;
        }
        console.error('Error in createAppointment:', error);
        throw new InternalServerErrorException('An error occurred while creating appointment');
    }
}
  
  


  async findAvailableDoctor(
    departmentId: string,
    appointmentDate: Date,
    timeSlot: number
  ) {
    return this.findAvailableDoctor(departmentId, appointmentDate, timeSlot);
  }

  async validateAppointment(createAppointmentDto: CreateAppointmentDto): Promise<boolean> {
    return this.validateAppointment(createAppointmentDto);
  }
}