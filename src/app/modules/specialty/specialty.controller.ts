import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { specialtyService } from "./specialty.service";
import { sendResponse } from "../../shared/sendResponse";

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const payload = { ...req.body, icon: req.file?.path };
  const result = await specialtyService.createSpecialty(payload);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "specialty created successfully",
    data: result,
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtyService.getAllSpecialty();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "specialty get successfully",
    data: result,
  });
});

const deleteSpecialties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialtyService.deleteSpecialties(id as string);

  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "specialty delete successfully",
    data: result,
  });
});

const updateSpecialties = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await specialtyService.updateSpecialties(
    id as string,
    payload,
  );
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "specialty update successfully",
    data: result,
  });
});

export const SpecialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialties,
  updateSpecialties,
};
