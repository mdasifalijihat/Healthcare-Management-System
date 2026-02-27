import z from "zod";

export const updateDoctorZodSchema = z
  .object({
    name: z
      .string("Name must be a string")
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long")
      .optional(),
    profilePhoto: z.string().url().optional(),
    contactNumber: z
      .string("Contact number must be a string")
      .min(11, "Contact number must be at least 11 digits")
      .max(14, "Contact number must be at most 14 digits")
      .optional(),
    address: z
      .string("Address must be a string")
      .min(10, "Address must be at least 10 characters long")
      .max(100, "Address must be at most 100 characters long")
      .optional(),
    registrationNumber: z
      .string("Registration number must be a string")
      .min(3, "Registration number must be at least 3 characters long")
      .max(50, "Registration number must be at most 50 characters long")
      .optional(),
    experience: z
      .int("Experience must be an integer")
      .nonnegative("Experience cannot be negative")
      .optional(),
  })
  .partial();
