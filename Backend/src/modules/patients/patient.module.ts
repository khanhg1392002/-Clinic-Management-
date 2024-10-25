import { forwardRef, Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { SharedModule } from 'src/SharedModule';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { AppointmentModule } from '../appointments/appointment.module';

@Module({
  imports: [
    SharedModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => AppointmentModule),
    ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
