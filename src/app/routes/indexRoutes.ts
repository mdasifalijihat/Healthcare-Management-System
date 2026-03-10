import { Router } from "express";
import { SpecialtyRouter } from "../modules/specialty/specialty.router";
import { AuthRouters } from "../modules/auth/auth.router";
import { UserRouters } from "../modules/user/user.router";
import { DoctorRouter } from "../modules/doctor/doctor.router";
import { AdminRoutes } from "../modules/admin/admin.route";

const router = Router();

router.use("/auth", AuthRouters);
router.use("/specialties", SpecialtyRouter);
router.use("/users", UserRouters);
router.use("/doctors", DoctorRouter);
router.use("/admins", AdminRoutes);

export const IndexRoutes = router;
