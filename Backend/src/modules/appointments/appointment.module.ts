import { forwardRef, Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { DoctorModule } from '../doctors/doctor.module';
import { PatientModule } from '../patients/patient.module';
import { DepartmentModule } from '../departments/department.module';
import { SharedModule } from 'src/SharedModule';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    SharedModule,
    forwardRef(() => DoctorModule),
    forwardRef(() => PatientModule),
    forwardRef(() => DepartmentModule),
    forwardRef(() => UserModule),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}