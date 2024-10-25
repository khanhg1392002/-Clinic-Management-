// doctor.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
// import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { UserRole } from 'src/config/constants';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { PaginationSortDto } from '../PaginationSort.dto ';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('/api/v1/doctor')
@Roles(UserRole.ADMIN, UserRole.DOCTOR)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) { }

  @Post('add')
  async createDoctor(@Body() createDoctorDto: CreateDoctorDto, @Req() req) {
    const createdBy = req.user.userId;
    return this.doctorService.create(createDoctorDto, createdBy);
  }

  @Put('update/:id')
  async updateDoctor(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto, @Req() req) {
    const updatedBy = req.user.userId;
    return this.doctorService.update(id, updateDoctorDto, updatedBy);
  }

  @Delete('delete/:id')
  async deleteDoctor(@Param('id') id: string, @Req() req) {
    const deletedBy = req.user.userId;
    return this.doctorService.remove(id, deletedBy);
  }

  @Delete('batch-delete')
  async batchDeleteDoctors(@Body('ids') ids: string[], @Req() req) {
    const deletedBy = req.user.userId;
    return this.doctorService.remove(ids, deletedBy);
  }

  @Get('get')
  async getAllDoctors(@Query() paginationSortDto: PaginationSortDto) {
    return this.doctorService.getAllDoctors(paginationSortDto);
  }

  @Get('get/:id')
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  /////////////
    @Post('schedule/add')
  async createSchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.doctorService.createSchedule(createScheduleDto.doctorId, createScheduleDto);
  }

  @Get('schedule/:doctorId/:date')
  async getSchedule(@Param('doctorId') doctorId: string, @Param('date') date: string) {
    return this.doctorService.getSchedule(doctorId, new Date(date));
  }

  @Get('schedules/:doctorId')
  async getAllSchedulesForDoctor(@Param('doctorId') doctorId: string) {
    return this.doctorService.getAllSchedulesForDoctor(doctorId);
  }

  @Put('schedule/update')
  async updateSchedule(@Body() updateScheduleDto: UpdateScheduleDto) {
    return this.doctorService.updateSchedule(updateScheduleDto);
  }

  @Delete('schedule/:doctorId/:date')
  async deleteSchedule(@Param('doctorId') doctorId: string, @Param('date') date: string) {
    return this.doctorService.deleteSchedule(doctorId, new Date(date));
  }

  @Get('available')
  async findAvailableDoctor(
    @Query('departmentId') departmentId: string,
    @Query('date') date: string,
    @Query('timeSlot') timeSlot: number
  ) {
    return this.doctorService.findAvailableDoctor(departmentId, new Date(date), timeSlot);
  }
 
  
}