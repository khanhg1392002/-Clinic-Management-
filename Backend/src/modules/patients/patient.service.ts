import { Injectable, NotFoundException, HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient, PatientDocument } from './schema/patient.schema';
import { PaginationSortDto } from '../PaginationSort.dto ';
import { Status } from 'src/config/constants';
import { nowTime } from 'src/utils/timeUtil';
import ErrorService from 'src/config/errors';

@Injectable()
export class PatientService {
    constructor(
        @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    ) { }

    async create(createPatientDto: CreatePatientDto, createdBy: string): Promise<Patient> {
        const { phoneNumber, nationalId } = createPatientDto;

        // Check if phoneNumber is unique
        const existingPhoneNumber = await this.patientModel.findOne({ phoneNumber, status: Status.ACTIVE });
        if (existingPhoneNumber) {
            throw new ConflictException('Phone number already exists');
        }

        // Kiểm tra duy nhất cho nationalId nếu người dùng đã nhập
        if (nationalId) {
            const existingNationalId = await this.patientModel.findOne({ nationalId, status: Status.ACTIVE });
            if (existingNationalId) {
                throw new ConflictException('National ID already exists');
            }
        }

        const newPatient = new this.patientModel({
            ...createPatientDto,
            createdBy,
            status: Status.ACTIVE
        });
        return await newPatient.save();
    }

    async getAllPatients(
        query: any = {},
        paginationSortDto: PaginationSortDto
    ): Promise<{ patients: Patient[], total: number, page: number, limit: number }> {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search } = paginationSortDto;
        const skip = (page - 1) * limit;

        const searchQuery = search ? {
            $or: [
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { phoneNumber: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { insuranceNumber: new RegExp(search, 'i') },
                { emergencyContactName: new RegExp(search, 'i') },
                { emergencyContactPhone: new RegExp(search, 'i') },
                { emergencyContactRelationship: new RegExp(search, 'i') },
            ]
        } : {};

        const finalQuery = {
            ...query,
            ...searchQuery,
            status: Status.ACTIVE
        };

        const [patients, total] = await Promise.all([
            this.patientModel.find(finalQuery)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.patientModel.countDocuments(finalQuery)
        ]);

        if (patients.length === 0) {
            throw new HttpException('Không tìm thấy bệnh nhân', HttpStatus.NOT_FOUND);
        }

        return { patients, total, page: Number(page), limit: Number(limit) };
    }

    async findOne(id: string): Promise<Patient> {
        const patient = await this.patientModel.findOne({ _id: id, status: Status.ACTIVE }).exec();

        if (!patient) {
            throw new NotFoundException(`Patient with ID ${id} not found`);
        }
        return patient;
    }

    async update(id: string, updatePatientDto: UpdatePatientDto, updatedBy: string): Promise<Patient> {
        if (!updatePatientDto || Object.keys(updatePatientDto).length === 0) {
            throw new HttpException('No data fields provided for update', HttpStatus.BAD_REQUEST);
        }

        const existingEmail = await this.patientModel.findOne({ email: updatePatientDto.email }).exec();
        if (existingEmail) {
            throw new HttpException(ErrorService.USER_ERR_EMAIL_EXISTED.message, HttpStatus.BAD_REQUEST);
        }

        const existingPhone = await this.patientModel.findOne({ phoneNumber: updatePatientDto.phoneNumber }).exec();
        if (existingPhone) {
            throw new HttpException(ErrorService.PHONE_IS_EXISTED.message, HttpStatus.BAD_REQUEST);
        }

        const existingNationalId = await this.patientModel.findOne({ nationalId: updatePatientDto.nationalId }).exec();
        if (existingNationalId) {
            throw new HttpException(ErrorService.USER_ERR_EMAIL_EXISTED.message, HttpStatus.BAD_REQUEST);
        }

        const updatedPatient = await this.patientModel.findOneAndUpdate(
            { _id: id, status: Status.ACTIVE },
            {
                $set: {
                    ...updatePatientDto,
                    updatedBy: new Types.ObjectId(updatedBy)
                }
            },
            { new: true, runValidators: true }
        ).exec();

        if (!updatedPatient) {
            throw new HttpException('Patient not found or update failed', HttpStatus.NOT_FOUND);
        }

        return updatedPatient;
    }

    async remove(ids: string | string[], deletedBy: string): Promise<{ successMessages: string[], errorMessages: string[] }> {
        const idArray = Array.isArray(ids) ? ids : [ids];
        const successMessages: string[] = [];
        const errorMessages: string[] = [];

        for (const id of idArray) {
            try {
                const result = await this.patientModel.findOneAndUpdate(
                    { _id: id, status: Status.ACTIVE },
                    {
                        status: Status.SUSPENDED,
                        deletedBy: new Types.ObjectId(deletedBy),
                        deletedAt: nowTime
                    },
                    { new: true }
                ).exec();

                if (result) {
                    successMessages.push(`Successfully deleted patient with ID: ${id}`);
                } else {
                    errorMessages.push(`Patient with ID ${id} not found or already deleted`);
                }
            } catch (error) {
                errorMessages.push(`Error deleting patient with ID ${id}: ${error.message}`);
            }
        }

        return { successMessages, errorMessages };
    }

    // async findByPhone(phoneNumber: string): Promise<Patient> {
    //     const patient = await this.patientModel.findOne({ phoneNumber, status: Status.ACTIVE }).exec();
    //     if (!patient) {
    //         throw new NotFoundException('User with this phone number not found');
    //     }
    //     return patient;
    // }

    async findByPhone(phoneNumber: string): Promise<Patient | null> {
        const patient = await this.patientModel.findOne({ phoneNumber, status: Status.ACTIVE }).exec();
        return patient; // Trả về null nếu không tìm thấy thay vì throw exception
    }
    
}