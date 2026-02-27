import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long"),

  doctor: z.object({
    name: z
      .string("Name must be required")
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long"),

    email: z.email("Invalid email format"),

    profilePhoto: z.string().url().optional(),

    contactNumber: z
      .string("Contact number must be required")
      .min(11, "Contact number must be at least 11 digits")
      .max(14, "Contact number must be at most 14 digits"),

    address: z
      .string("Address must be required")
      .min(10, "Address must be at least 10 characters long")
      .max(100, "Address must be at most 100 characters long"),

    registrationNumber: z
      .string("Registration number must be required")
      .min(3, "Registration number must be at least 3 characters long")
      .max(50, "Registration number must be at most 50 characters long"),

    experience: z
      .int("Experience must be an integer")
      .nonnegative("Experience cannot be negative")
      .optional(),

    gender: z.enum(
      [Gender.FEMALE, Gender.MALE, Gender.OTHER],
      "gender must be either 'FEMALE', 'MALE', or 'OTHER' ",
    ),
    qualification: z
      .string("qualification must be a string")
      .min(3, "Qualification must be at least 3 characters long")
      .max(100, "Qualification must be at most 100 characters long"),
    currentWorkingPlace: z
      .string("current Working Place  required")
      .min(3, "Current working place must be at least 3 characters long")
      .max(100, "Current working place must be at most 100 characters long"),

    designation: z
      .string("designation must be required")
      .min(3, "Designation must be at least 3 characters long")
      .max(100, "Designation must be at most 100 characters long"),

    appointmentFee: z
      .number("Appointment fee must be a number")
      .positive("Appointment fee must be a positive number"),
  }),

  specialties: z
    .array(z.uuid(), "Specialties must be an array of UUIDs")
    .min(1, "At least one specialty must be provided"),
});
