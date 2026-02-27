import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { UserService } from "./user.service";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserService.createDoctor(payload);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserService.createAdmin(payload);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Admin registered successfully",
    data: result,
  });
});


export const UserController = {
  createDoctor,
  createAdmin,
};
