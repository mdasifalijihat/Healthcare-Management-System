import { Prisma, Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
  const specialty = await prisma.specialty.create({
    data: payload,
  });
  return specialty;
};
const getAllSpecialty = async (): Promise<Specialty[]> => {
  const specialty = await prisma.specialty.findMany();
  return specialty;
};
const deleteSpecialties = async (id: string): Promise<Specialty> => {
  const specialty = await prisma.specialty.delete({
    where: {id}
  });
  return specialty;
};

const updateSpecialties = async (
  id: string,
  payload: Prisma.SpecialtyUpdateInput,
): Promise<Specialty> => {
  const specialty = await prisma.specialty.update({
    where: { id },
    data: payload,
  });

  return specialty;
};

export const specialtyService = {
  createSpecialty,
  getAllSpecialty,
  deleteSpecialties,
  updateSpecialties,
};
