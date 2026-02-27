import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    where: { isDeleted: false },
    include: {
      user: true,
      specialties: {
        include: { specialty: true },
      },
    },
  });
  return doctors;
};

// 🔥 GET BY ID
const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      user: true,
      specialties: {
        include: { specialty: true },
      },
    },
  });

  if (!doctor || doctor.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  return doctor;
};

// 🔥 UPDATE DOCTOR
const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const doctorExists = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!doctorExists || doctorExists.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  const updatedDoctor = await prisma.doctor.update({
    where: { id },
    data: payload,
  });

  return updatedDoctor;
};

// 🔥 SOFT DELETE
const softDeleteDoctor = async (id: string) => {
  const doctorExists = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!doctorExists || doctorExists.isDeleted) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  const deletedDoctor = await prisma.doctor.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return deletedDoctor;
};

export const doctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  softDeleteDoctor,
};
