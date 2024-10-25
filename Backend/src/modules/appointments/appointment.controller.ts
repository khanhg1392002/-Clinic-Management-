import { Body, Controller, Post, Get, Query, Param } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './schema/appointment.schema';

@Controller('/api/v1/appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('add')
  async createAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto
  ): Promise<Appointment> {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Get('available-doctors')
  async findAvailableDoctors(
    @Query('departmentId') departmentId: string,
    @Query('appointmentDate') appointmentDate: string,
    @Query('timeSlot') timeSlot: number
  ) {
    const date = new Date(appointmentDate);
    return this.appointmentService.findAvailableDoctor(departmentId, date, timeSlot);
  }

  @Post('validate') 
  async validateAppointment(
    @Body() createAppointmentDto: CreateAppointmentDto
  ): Promise<boolean> {
    return this.appointmentService.validateAppointment(createAppointmentDto);
  }
}