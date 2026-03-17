import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../interface/query.interface";

import {
  doctorFilterableFields,
  doctorIncludeConfig,
  doctorSearchableFields,
} from "./doctor.constant";
import { Doctor, Prisma } from "../../../generated/prisma/client";

const getAllDoctors = async (query: IQueryParams) => {
  // const doctors = await prisma.doctor.findMany({
  //     where: {
  //         isDeleted: false,
  //     },
  //     include: {
  //         user: true,
  //         specialties: {
  //             include: {
  //                 specialty: true
  //             }
  //         }
  //     }
  // })

  // // const query = new QueryBuilder().paginate().search().filter();
  // return doctors;

  const queryBuilder = new QueryBuilder<
    Doctor,
    Prisma.DoctorWhereInput,
    Prisma.DoctorInclude
  >(prisma.doctor, query, {
    searchableFields: doctorSearchableFields,
    filterableFields: doctorFilterableFields,
  });
  const result = await queryBuilder
    .search()
    .filter()
    .where({
      isDeleted: false,
    })
    .include({
      user: true,
      // specialties: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    })
    .dynamicInclude(doctorIncludeConfig)
    .paginate()
    .sort()
    .fields()
    .execute();

  console.log(result);
  return result;
};

// 🔥 GET BY ID
const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id, isDeleted: false },
    include: {
      user: true,
      specialties: {
        include: { specialty: true },
      },
      appointments: {
        include: {
          patient: true,
          schedule: true,
          prescription: true,
        },
      },
      doctorSchedules: {
        include: { schedule: true },
      },
      reviews: true,
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

  const { doctor: doctorData, specialties } = payload;

  await prisma.$transaction(async (tx) => {
    if (doctorData) {
      await tx.doctor.update({
        where: { id },
        data: { ...doctorData },
      });
    }

    if (specialties && specialties.length > 0) {
      for (const specialty of specialties) {
        const { specialtyId, shouldDelete } = specialty;
        if (!specialtyId) continue;
        if (shouldDelete) {
          await tx.doctorSpecialty.delete({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
          });
        } else {
          await tx.doctorSpecialty.upsert({
            where: {
              doctorId_specialtyId: {
                doctorId: id,
                specialtyId,
              },
            },
            create: {
              doctorId: id,
              specialtyId,
            },
            update: {},
          });
        }
      }
    }
  });
  const doctor = await getDoctorById(id);
  return doctor;
};

// 🔥 SOFT DELETE
const softDeleteDoctor = async (id: string) => {
  const isDoctorExists = await prisma.doctor.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!isDoctorExists) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: isDoctorExists.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });
    await tx.session.deleteMany({
      where: { userId: isDoctorExists.userId },
    });
    await tx.doctorSpecialty.deleteMany({
      where: { doctorId: id },
    });
  });
  return { message: "Doctor deleted Successfully" };
};

export const doctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  softDeleteDoctor,
};
