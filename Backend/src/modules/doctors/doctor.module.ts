// doctor.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { UserModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module';
import { DepartmentModule } from '../departments/department.module';
import { SharedModule } from 'src/SharedModule';
import { AppointmentModule } from '../appointments/appointment.module';
import { DoctorSchedule } from './schema/doctorSchedule.schema';

@Module({
  imports: [
    SharedModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => DepartmentModule),
    forwardRef(() => AppointmentModule),
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}