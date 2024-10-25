/**
 * @file Business constants & interfaces
 * @module constants/biz
 */

import { execPath } from "process";

// User
export enum Gender {
  FEMALE = 0,
  MALE = 1,
}

export enum Status {
  SUSPENDED = 0,
  ACTIVE = 1,
}

export enum UserRole {
  PATIENT = 0,
  ADMIN = 1,
  DOCTOR = 2,
  RECEPTIONIST = 3
}

// Department
export enum DepartmentStatus {
  INACTIVE = 0,
  ACTIVE = 1,
}

// Doctor
export enum AcademicDegree {
  BACHELOR = 0, // Bằng Cử nhân
  MASTER = 1, // Bằng Thạc sĩ
  DOCTORATE = 2, // Bằng Tiến sĩ
  PROFESSOR = 3, // Giáo sư
}

export enum TimeSlot {
  SLOT_8_9 = 8,
  SLOT_9_10 = 9,
  SLOT_10_11 = 10,
  SLOT_11_12 = 11,
  SLOT_13_14 = 13,
  SLOT_14_15 = 14,
  SLOT_15_16 = 15,
  SLOT_16_17 = 16,
}

// Patient
export enum BenifitCode {
  DISCOUNT80 = 0,
  DISCOUNT95 = 1,
  DISCOUNT100 = 2,
}

// Appointment
export enum appointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum bookingType {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE"
}

// config/constants.ts
type SizeConfig = {
  width: number | 'auto';
  height: number | 'auto';
  name: string;
  type: string;
};

export const UPLOAD: {
  EXTENSION: string[];
  AVATAR: {
    width: number;
    height: number;
    name: string;
  };
  SIZES: SizeConfig[];
  PATH_FOLDER: string;
} = {
  EXTENSION: [".png", ".jpg", ".jpeg", ".gif"],
  AVATAR: {
    width: 250,
    height: 250,
    name: "avatar",
  },
  SIZES: [
    {
      width: 1280,
      height: 'auto',
      name: "origin",
      type: "origin",
    },
    {
      width: 300,
      height: 300,
      name: "300x300",
      type: "thumbnail",
    },
    // ... other sizes
  ],
  PATH_FOLDER: process.env.PATH_FOLDER || "./assets/uploads/",
};

