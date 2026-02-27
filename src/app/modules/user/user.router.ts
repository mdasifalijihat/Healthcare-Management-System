import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validation";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post(
  "/create-doctor",
  validateRequest(createDoctorZodSchema),
  UserController.createDoctor,
);

router.post(
  "/create-admin",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  UserController.createAdmin,
);

export const UserRouters = router;
